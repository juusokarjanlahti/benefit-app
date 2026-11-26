import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  calculateGrandTotalPoints,
  calculateGrandTotalPossiblePoints,
  calculateParentOnlyPoints,
  calculateParentOnlyPossiblePoints,
} from "../frontend/src/lib/centralizedCalculations.ts";

import {
  componentClassFields,
  componentTypeOptions,
} from "../frontend/src/lib/fc-constants.ts";

function benefitApiUrl(value) {
  const url = URL.parse(value);
  const loopback = ["localhost", "127.0.0.1", "[::1]"].includes(url?.hostname);
  if (
    !url ||
    (url.protocol !== "https:" && !(url.protocol === "http:" && loopback)) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "BENEFIT_API_URL must be an HTTPS backend URL or a loopback HTTP URL, without credentials, a query, or a fragment.",
    );
  }

  return url.href.replace(/\/+$/, "");
}

const apiUrl = benefitApiUrl(
  process.env.BENEFIT_API_URL ?? "http://localhost:8080",
);
const token = process.env.BENEFIT_TOKEN?.trim();
if (!token || !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token)) {
  throw new Error(
    "Set BENEFIT_TOKEN to a Benefit JWT without the Bearer prefix.",
  );
}

async function requestBenefit(path, body) {
  let response;
  try {
    response = await fetch(apiUrl + path, {
      method: body === undefined ? "GET" : "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      redirect: "error",
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    throw new Error(
      body === undefined
        ? "Could not reach Benefit. Check the backend URL and connectivity."
        : "Benefit did not confirm the write. It may have succeeded; read the project list or project before retrying.",
    );
  }

  if (!response.ok) {
    await response.body?.cancel().catch(() => {});
    if (response.status === 401) {
      throw new Error(
        "Benefit rejected the session. Set a fresh JWT and restart the MCP server.",
      );
    }
    if (response.status === 403 || response.status === 404) {
      throw new Error(
        `Benefit could not provide that resource (HTTP ${response.status}). Check the project ID and account access.`,
      );
    }
    throw new Error(`Benefit returned HTTP ${response.status}.`);
  }

  return response;
}

async function readBenefit(path) {
  const response = await requestBenefit(path);
  try {
    return await response.json();
  } catch {
    throw new Error("Benefit returned an unreadable JSON response.");
  }
}

function projectSummary(project) {
  if (
    !Number.isSafeInteger(project?.id) ||
    typeof project.projectName !== "string" ||
    !Number.isSafeInteger(project.version)
  ) {
    throw new Error("Benefit returned an unexpected project record.");
  }
  const { id, familyId, projectName, version, calculationDate, updatedAt } =
    project;
  return { id, familyId, projectName, version, calculationDate, updatedAt };
}

function projectComponents(project) {
  if (!Array.isArray(project.functionalComponents)) {
    throw new Error(
      "Benefit returned an unexpected functional component list.",
    );
  }
  return project.functionalComponents;
}

const server = new McpServer({ name: "fisma-benefit", version: "0.1.0" });
const annotations = { readOnlyHint: true, openWorldHint: true };
const projectInput = {
  projectId: z
    .number()
    .int()
    .positive()
    .describe("Project version ID from list_projects"),
};

function result(data) {
  const json = JSON.stringify(data);
  return {
    content: [{ type: "text", text: json }],
    structuredContent: JSON.parse(json),
  };
}

server.registerTool(
  "list_projects",
  {
    description:
      "List Benefit projects and archived versions accessible to the configured account.",
    annotations,
  },
  async () => {
    const projects = await readBenefit("/projects");
    if (!Array.isArray(projects)) {
      throw new Error("Benefit returned an unexpected project list.");
    }
    return result({ projects: projects.map(projectSummary) });
  },
);

server.registerTool(
  "get_project",
  {
    description:
      "Read a Benefit project version and its functional component tree.",
    inputSchema: projectInput,
    annotations,
  },
  async ({ projectId }) => {
    const project = await readBenefit(`/projects/${projectId}`);
    return result({
      ...projectSummary(project),
      functionalComponents: projectComponents(project),
    });
  },
);

const writeAnnotations = {
  readOnlyHint: false,
  destructiveHint: false,
  idempotentHint: false,
  openWorldHint: true,
};
const count = z.number().int().min(0).max(2147483647);
const componentSchemas = componentTypeOptions.map(
  ({ className, componentTypeOptions: types }) => {
    const fields = componentClassFields.find(
      (entry) => entry.className === className,
    ).inputFields;
    return z.strictObject({
      title: z.string().trim().min(1).max(255),
      description: z.string().max(10000).optional(),
      className: z.literal(className),
      componentType: z.enum(types),
      degreeOfCompletion: z.number().min(0).max(1),
      ...Object.fromEntries(fields.map((field) => [field, count])),
      ...(className === "Interactive end-user input service"
        ? { functionalMultiplier: z.number().int().min(1).max(2147483647) }
        : {}),
    });
  },
);

server.registerTool(
  "create_project",
  {
    description:
      "Create a new empty Benefit project at version 1 for the configured account. This saves data. Not idempotent: inspect list_projects before retrying after an uncertain failure.",
    inputSchema: { projectName: z.string().trim().min(1).max(255) },
    annotations: writeAnnotations,
  },
  async ({ projectName }) => {
    const response = await requestBenefit("/projects", {
      projectName,
      version: 1,
      functionalComponents: [],
      calculationDate: null,
    });
    const location = response.headers.get("Location");
    const match =
      location &&
      new URL(location, apiUrl + "/").pathname.match(/\/projects\/([1-9]\d*)$/);
    const projectId = match && Number(match[1]);
    if (!Number.isSafeInteger(projectId)) {
      throw new Error(
        "Project was created but its ID could not be read. Use list_projects before retrying.",
      );
    }
    return result(projectSummary(await readBenefit(`/projects/${projectId}`)));
  },
);

server.registerTool(
  "add_component",
  {
    description:
      "Append a non-multilayer functional component to an owned, editable Benefit project. This saves data. Required numeric inputs depend on className. Not idempotent: inspect get_project before retrying after an uncertain failure.",
    inputSchema: {
      ...projectInput,
      component: z.discriminatedUnion("className", componentSchemas),
    },
    annotations: writeAnnotations,
  },
  async ({ projectId, component }) => {
    const response = await requestBenefit(
      `/functional-components/projects/${projectId}`,
      {
        dataElements: null,
        readingReferences: null,
        writingReferences: null,
        functionalMultiplier: null,
        operations: null,
        description: null,
        ...component,
        orderPosition: 0,
        isMLA: false,
        isReadonly: false,
        parentFCId: null,
        subComponents: [],
      },
    );
    let project;
    try {
      project = await response.json();
    } catch {
      throw new Error(
        "Component was saved but the response could not be read. Use get_project before retrying.",
      );
    }
    return result({
      ...projectSummary(project),
      functionalComponents: projectComponents(project),
    });
  },
);

server.registerTool(
  "get_project_function_points",
  {
    description:
      "Calculate FiSMA 1.1 actual and possible function points for a saved Benefit project version, including totals with and without multilayer subcomponents.",
    inputSchema: projectInput,
    annotations,
  },
  async ({ projectId }) => {
    const project = await readBenefit(`/projects/${projectId}`);
    const summary = projectSummary(project);
    const components = projectComponents(project);
    let points;
    try {
      points = {
        actual: calculateGrandTotalPoints(components),
        possible: calculateGrandTotalPossiblePoints(components),
        parentActual: calculateParentOnlyPoints(components),
        parentPossible: calculateParentOnlyPossiblePoints(components),
      };
    } catch {
      throw new Error(
        "Benefit could not calculate function points for these saved components.",
      );
    }
    if (!Object.values(points).every(Number.isFinite)) {
      throw new Error(
        "Benefit’s calculation returned an invalid total. Review the saved component inputs.",
      );
    }
    return result({ ...summary, ...points });
  },
);

await server.connect(new StdioServerTransport());
