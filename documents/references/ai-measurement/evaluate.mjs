import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

// Source-derived decision checks only. Does not call a model, MCP, or Benefit API.
const expected = JSON.parse(
  await readFile(
    new URL("./evaluation-expected.json", import.meta.url),
    "utf8",
  ),
);
if (!process.argv[2]) {
  console.error(
    `Usage: node ${fileURLToPath(import.meta.url)} /path/to/model-answers.json`,
  );
  process.exit(2);
}
const actual = JSON.parse(await readFile(process.argv[2], "utf8"));
if (!Array.isArray(actual.answers))
  throw new Error("Expected an answers array");
const ids = actual.answers.map((a) => a.id);
if (new Set(ids).size !== ids.length) throw new Error("Duplicate answer IDs");
const known = new Set(expected.answers.map((a) => a.id));
if (ids.some((id) => !known.has(id))) throw new Error("Unknown answer ID");
let passedFields = 0;
let totalFields = 0;
const results = expected.answers.map((want) => {
  const got = actual.answers.find((a) => a.id === want.id);
  const failures = [];
  for (const [key, value] of Object.entries(want)) {
    if (key === "id") continue;
    totalFields++;
    const received = got?.[key];
    const matches =
      typeof value === "number"
        ? typeof received === "number" &&
          Number.isFinite(received) &&
          Math.abs(value - received) < 1e-9
        : received === value;
    if (matches) passedFields++;
    else
      failures.push({
        field: key,
        expected: value,
        received: received ?? null,
        missing: received === undefined,
      });
  }
  return { id: want.id, passed: failures.length === 0, failures };
});
const report = {
  referenceVersion: expected.referenceVersion,
  passedCases: results.filter((r) => r.passed).length,
  totalCases: results.length,
  passedFields,
  totalFields,
  results,
  limitation:
    "Checks decision fields only; explanations, vision accuracy and independent expert correctness are not scored.",
};
console.log(JSON.stringify(report, null, 2));
if (report.passedCases !== report.totalCases) process.exitCode = 1;
