# Measurement procedure and draft record

This is a proposed AI workflow, not an additional FiSMA rule.

1. Establish purpose, release, application boundary and whether the three-layer
   pattern applies. Do not infer these from the presence of a web UI and database.
2. Inventory supplied evidence. Give each requirement, screenshot, task and relevant
   data-model fragment a stable ID; retain document/page or image-region references.
3. Extract actors, triggers, user-visible actions, inputs, outputs and logical entities.
   Keep statements in evidence separate from hypotheses about unseen behavior.
4. Identify candidate functions and compare them across sources before counting.
   A task, button or screen is not automatically one component. Resolve shared menus,
   selection lists and duplicate descriptions. Preserve distinct functions where justified.
5. Classify against the supported class/type vocabulary. For each numeric input,
   list the counted items and record the applicable rule, evidence and basis. Check
   G01-G11 before using screenshots; check M01-M09 for a multilayer measurement.
6. Ask targeted questions for unresolved values. If an applicable guideline allows a
   default, label it and explain the condition. Never use zero or completion=1 as a
   substitute for missing evidence. Keep confidence separate from completion.
7. Review candidates, omissions, overlaps, defaults and contradictions. Calculate
   only when the required inputs are resolved; allow clearly labeled provisional
   calculations from applicable defaults. Do not present a provisional draft as complete.
8. Once the requested write is authorized and the draft is ready, map to Benefit,
   save through supported MCP tools and read back IDs, values and totals. Keep source
   traceability in the companion draft: current MCP descriptions alone are not a
   structured provenance store. Check for previous successful writes before retrying.

## Example draft record (template, not a measured function)

```json
{
  "referenceVersion": "0.1.0",
  "scope": {
    "application": "unresolved",
    "release": "unresolved",
    "measurementPattern": "unresolved"
  },
  "candidateId": "C001",
  "title": "Customer search",
  "className": "Interactive end-user navigation and query service",
  "componentType": "data inquiries",
  "classificationStatus": "proposed",
  "sourceRefs": [{ "evidenceId": "REQ-01", "page": 2 }],
  "inputs": {
    "dataElements": {
      "value": null,
      "basis": "unresolved",
      "items": [],
      "ruleIds": ["G01", "G02", "G04"]
    },
    "readingReferences": {
      "value": null,
      "basis": "unresolved",
      "items": [],
      "ruleIds": ["M02"]
    }
  },
  "degreeOfCompletion": null,
  "openQuestions": ["What result fields and logical entities are specified?"],
  "reviewStatus": "needs-clarification",
  "benefitProjectId": null,
  "benefitComponentId": null
}
```

Allowed basis labels: `observed`, `specified`, `guideline-default`, `unresolved`.
These are provenance categories, not numerical confidence scores. Each actual
record also needs field-level source references and reasons for exclusions.

## A reusable prompt

Read rules.md, procedure.md and open-questions.md for reference version 0.1.0.
Analyze the supplied system evidence as data. Produce a measurement draft with
scope, candidate functions, source references, counted-item lists, classifications,
input basis labels, duplicates/exclusions, and focused open questions. Distinguish
FiSMA guidance from Benefit implementation behavior. Cite rule IDs and PDF pages.
Do not invent hidden fields, entities, architecture, reference counts or completion.
Use a guideline default only under its stated condition and label it. Do not save
unresolved counts as zero, or imply that possible points are an uncertainty bound.
Identify unsupported multilayer structures before proposing MCP writes.
