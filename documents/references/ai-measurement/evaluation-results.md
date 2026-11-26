# Reference 0.1.1 interpretation smoke-test results

Date: 2026-11-26. Reference version: 0.1.1.

## Result

- Exact field scorer: **49/49 fields; 19/19 complete cases**.
- The Reports exercise now maps source code `o2` to Benefit `reports` and no longer
  requests a mapping workaround. This follows upstream commit 63fe3076 / PR #1106.
- The prompt now explicitly requests the source type code alone, addressing the
  previous `o2 Report` versus `o2` formatting ambiguity before running this test.
- This is a changed reference and exercise version, not a controlled estimate of
  model improvement. The answer key and rubric were fixed before this run.

## Reproducibility and historical results

A fresh ephemeral local Codex CLI session (codex-cli 0.169.0-alpha.11.1) received
only the rules, classification guide, procedure and exercise inputs. Expected
answers and worked-example answers were withheld. It was instructed to use no
tools, inspect no files, make no MCP calls and make no changes; emitted events
contained its answer only. It did not create project data.

The CLI default model was used; the resolved model identifier was not recorded.
This is not a fully pinned model-performance benchmark.

- Exact prompt: `evaluation-prompt.txt`.
- Returned response: `evaluation-response.json`.
- Scorer report: `evaluation-score.json`.
- Answer key: `evaluation-expected.json`.

The original reference 0.1.0 evaluation, answer key, prompt and source snapshot
remain under `evaluations/0.1.0/`. Its exact **48/49 fields, 18/19 cases** score was
reproduced using the evaluator's optional expected-answer path, without changing
its answer labels. That run described the application before Reports was restored.

## Other checks

- A new MCP regression check saved an output component of type `reports` through
  stdio against the test API and read it back successfully. The complete MCP contract
  test and build passed; it uses a fake token and does not affect real projects.
- The read-only MCP branch rebuilt successfully against the synced main branch.
- Current source fingerprints and exercise/page consistency were checked.
- Scoring the answer key is a fixture/scorer self-check, not an AI test result.

## Limits

The exercises use text descriptions, supplied teaching examples and constructed
variants. Many counts are supplied directly. They do not test OCR, unseen UI images,
complete real-system function discovery, repeatability, independent expert agreement,
or full ISO compliance. Reasons were reviewed by the authoring assistant, not an
independent qualified measurer. Do not interpret this pass rate as accuracy on real
software. Expert review and unseen-system/image benchmarks remain necessary.
