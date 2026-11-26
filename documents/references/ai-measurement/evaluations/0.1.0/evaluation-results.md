# First interpretation smoke-test results

Date: 2026-11-26. Reference version: 0.1.0.

## Result

- Exact field scorer: **48/49 fields; 18/19 complete cases**.
- Only mismatch: `intro-reports-mapping.sourceType` expected `o2`; model returned
  `o2 Report`. It correctly chose the output class, left the unsupported Benefit
  type null and requested mapping review. This is a code/label formatting ambiguity,
  not evidence of a different classification. The exact score is retained without
  adding aliases or changing the answer key after observing the output.
- The output correctly distinguished guideline defaults, missing counts and completion,
  source arithmetic conflicts, and external integrations without default references.
- The scorer self-check passed all 19 cases / 49 fields against the stored answer key.
  A deliberate wrong data-element count was rejected, confirming that the evaluator
  can detect a numeric mismatch. This is evaluator verification, not an AI result.

## Run conditions

A fresh ephemeral local Codex CLI session (codex-cli 0.169.0-alpha.11.1) received
only the composed rules, classification guide, workflow and exercise inputs.
The expected-answer file and worked-example answer file were withheld. The model
was instructed to use no tools, inspect no files, make no MCP calls and make no
changes; emitted events showed only its answer. This test did not create project data.
The CLI default model was used; the resolved model identifier was not recorded,
so this run is not a fully pinned model-performance benchmark.

- Exact supplied prompt: `evaluation-prompt.txt`.
- Original returned answer: `evaluation-response.json`.
- Machine scorer output: `evaluation-score.json`.
- Expected decision fields: `evaluation-expected.json`.

The returned reasons were inspected for this initial smoke test. That inspection
was by the same authoring assistant, not an independent qualified measurer.
The input-function, incoming-message and algorithmic formulas agreed within the
scorer's 1e-9 tolerance. Source labels were not substituted for conflicting equations.

## Limits and next checks

This test uses text descriptions, including supplied teaching examples and constructed
variants. It does not test image recognition, OCR, invisible requirements, complete
function discovery in a real system, repeatability, independent expert agreement,
or the full ISO method. The source exercise inputs also directly supply many counts.
Do not interpret 48/49 as 98% measurement accuracy on real software.

Before the next benchmark:

1. Specify whether classification outputs require source codes or labels; keep the
   rubric fixed before generating answers.
2. Have a qualified measurer review the rules, examples and unresolved questions.
3. Add unseen requirements and unannotated UI images with expert-reviewed function
   inventories and counted-item evidence, not just a total FP target.
4. Evaluate omitted/duplicate functions, classifications, input counts and totals
   separately. Run multiple trials with recorded model/version and source versions.
