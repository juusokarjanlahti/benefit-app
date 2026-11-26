import assert from "node:assert/strict";
import http from "node:http";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
test(
  "creation tools validate inputs, append without overwrites, and do not retry uncertain writes",
  { timeout: 20000 },
  async () => {
    const requests = [];
    const project = {
      id: 41,
      projectName: "Contract test",
      version: 1,
      functionalComponents: [],
    };
    const api = http.createServer(async (req, res) => {
      let raw = "";
      for await (const part of req) raw += part;
      const body = raw ? JSON.parse(raw) : undefined;
      requests.push({ method: req.method, path: req.url, body });
      assert.equal(req.headers.authorization, "Bearer a.b.c");
      if (req.method === "POST" && body?.projectName === "Uncertain write") {
        req.socket.destroy();
        return;
      }
      if (req.url.includes("/999")) {
        res.writeHead(403).end();
        return;
      }
      if (req.method === "POST" && req.url === "/projects") {
        assert.equal(req.headers["content-type"], "application/json");
        assert.deepEqual(body, {
          projectName: "Contract test",
          version: 1,
          functionalComponents: [],
          calculationDate: null,
        });
        res.writeHead(201, { Location: "/projects/41" }).end();
        return;
      }
      if (
        req.method === "POST" &&
        req.url === "/functional-components/projects/41"
      ) {
        project.functionalComponents.push({
          ...body,
          id: 100 + project.functionalComponents.length,
        });
      } else assert.equal(req.method, "GET");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(req.url === "/projects" ? [project] : project));
    });
    await new Promise((resolve) => api.listen(0, "127.0.0.1", resolve));
    const transport = new StdioClientTransport({
      command: process.execPath,
      args: [fileURLToPath(new URL("../dist/server.mjs", import.meta.url))],
      env: {
        BENEFIT_API_URL: `http://127.0.0.1:${api.address().port}`,
        BENEFIT_TOKEN: "a.b.c",
      },
    });
    const client = new Client({ name: "write-contract-test", version: "1" });
    const call = (name, args) => client.callTool({ name, arguments: args });
    try {
      await client.connect(transport);
      const { tools } = await client.listTools();
      assert.equal(tools.length, 5);
      for (const name of ["create_project", "add_component"]) {
        const tool = tools.find((t) => t.name === name);
        assert.equal(tool.annotations.readOnlyHint, false);
        assert.equal(tool.annotations.idempotentHint, false);
      }
      const component = {
        title: "Customers",
        className: "Data storage service",
        componentType: "entities or classes",
        dataElements: 6,
        degreeOfCompletion: 1,
      };
      for (const bad of [
        { ...component, dataElements: -1 },
        { ...component, dataElements: 1.5 },
        { ...component, degreeOfCompletion: 2 },
        { ...component, componentType: "data inquiries" },
        { ...component, parentFCId: 99 },
        { ...component, title: "" },
        {
          title: "Input",
          className: "Interactive end-user input service",
          componentType: "1-functional",
          dataElements: 3,
          readingReferences: 1,
          writingReferences: 1,
          degreeOfCompletion: 1,
        },
      ])
        assert.equal(
          (await call("add_component", { projectId: 41, component: bad }))
            .isError,
          true,
        );
      assert.equal(
        (await call("create_project", { projectName: "   " })).isError,
        true,
      );
      assert.equal(
        requests.length,
        0,
        "invalid writes must never reach HTTP API",
      );
      assert.equal(
        (await call("create_project", { projectName: "Contract test" }))
          .structuredContent.id,
        41,
      );
      assert.equal(
        (await call("add_component", { projectId: 41, component })).isError,
        undefined,
      );
      const second = {
        title: "Search",
        className: "Interactive end-user navigation and query service",
        componentType: "data inquiries",
        dataElements: 4,
        readingReferences: 1,
        degreeOfCompletion: 0.7,
      };
      const appended = await call("add_component", {
        projectId: 41,
        component: second,
      });
      assert.equal(appended.structuredContent.functionalComponents.length, 2);
      assert.equal(
        appended.structuredContent.functionalComponents[0].title,
        "Customers",
      );
      assert.equal(
        appended.structuredContent.functionalComponents[1].degreeOfCompletion,
        0.7,
      );
      assert.equal(
        appended.structuredContent.functionalComponents[1].isMLA,
        false,
      );
      assert.equal(
        (await call("get_project", { projectId: 41 })).structuredContent
          .functionalComponents.length,
        2,
      );
      const denied = await call("add_component", { projectId: 999, component });
      assert.equal(denied.isError, true);
      assert.match(denied.content[0].text, /HTTP 403/);
      const uncertain = await call("create_project", {
        projectName: "Uncertain write",
      });
      assert.equal(uncertain.isError, true);
      assert.match(uncertain.content[0].text, /may have succeeded/);
      assert.equal(
        requests.filter((r) => r.body?.projectName === "Uncertain write")
          .length,
        1,
        "writes must not retry",
      );
      assert.equal(project.functionalComponents.length, 2);
    } finally {
      await client.close();
      await new Promise((resolve) => api.close(resolve));
    }
  },
);
