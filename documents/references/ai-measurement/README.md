# AI measurement reference

Version: 0.1.1 · 2026-11-26 · Status: source-derived draft, awaiting expert review.

Use this reference to turn requirements, UI images, and user tasks into a reviewable
FiSMA 1.1 measurement draft. It does not replace ISO/IEC 29881:2010 or certify a
measurement. No ISO text was available for this extraction; both official guides
explicitly say to use them together with that standard.

## Read in this order

1. `sources.json`: exact source editions, hashes, and provenance.
2. `rules.md`: source-linked rules and conditional defaults.
3. `procedure.md`: analysis workflow and evidence record.
4. `classification.md`: source type definitions and exact Benefit mapping.
5. `source-audit.md`: introduction examples that must not be copied blindly.
6. `open-questions.md`: interpretation and implementation gaps.
7. `worked-examples.json`: source examples and constructed exercises with answers.

For an interpretation smoke test, give the model only `rules.md`, `classification.md`, `procedure.md`,
and `evaluation-inputs.json`. Keep `worked-examples.json` and `evaluation-expected.json`
out of its context. Ask for a JSON object containing an `answers` array; each answer
must have `id`, the requested `answerFields`, and a short `reason` with rule IDs.
Score with:

```sh
node evaluate.mjs /absolute/path/to/model-answers.json
```

The scorer checks requested decision fields, not explanation quality. A human must
review source use and explanations. Passing these exercises is not an independent
expert assessment, an unseen-system benchmark, or a vision benchmark. Several
exercises adapt supplied worked examples; they are intentionally simple checks.

Current results and their limits are recorded in `evaluation-results.md`.
The original 0.1.0 run is preserved under `evaluations/0.1.0/`, with its original
prompt, expected answers, response, score and source snapshot. To reproduce its score:

```sh
node evaluate.mjs evaluations/0.1.0/evaluation-response.json evaluations/0.1.0/evaluation-expected.json
```

Version 0.1.1 includes the upstream Reports fix (63fe3076, merged in #1106),
so `o2 Report` now maps to the supported `reports` option.

## Source roles and conflicts

- GUI and MLA are FiSMA-issued guidelines for the topics they cover.
- INTRO provides teaching examples and type descriptions. Numeric labels require
  an arithmetic audit; see source-audit.md. It does not override the later guides.
- BENEFIT describes product requirements and local explanations/examples; these are
  not additional universal FiSMA rules. Its multilayer section explicitly defers to MLA.
- CODE describes this checkout's behavior; it is not evidence that a rule is correct.
- WORKFLOW rules are proposed safeguards for this AI-assisted process, not standard text.
- If sources disagree, record both references and ask for a ruling. Do not silently
  combine incompatible interpretations or claim the missing ISO text has been checked.

Page numbers mean 1-based physical PDF pages. Original PDFs remain outside the
repository; hashes identify the supplied copies. Recheck the sources after a revision,
keep rule IDs stable, bump this reference version, and rerun the exercises. No project
data is created by this reference or its evaluator.
