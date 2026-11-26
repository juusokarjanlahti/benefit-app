# Handoff: MCP and measurement reference

Last updated: 2026-11-26. Work intentionally stopped after freezing the login trial.
This note records the handoff; no automation or background monitoring is scheduled.

## Current review branches

All changes are in the user's fork, juusokarjanlahti/benefit-app. PRs #1 and #2
were merged by the user; main is a9abc409 at this handoff. PR #3 remains open
and was rebased/retargeted to main. No PR was merged by the assistant.

1. [PR #1: read-only MCP](https://github.com/juusokarjanlahti/benefit-app/pull/1)
   **Merged into main**: list projects, read a project/tree, calculate saved points.
2. [PR #2: creation tools](https://github.com/juusokarjanlahti/benefit-app/pull/2)
   **Merged into main**: create empty projects and append non-MLA components,
   plus portable contract tests, including restored reports support.
3. [PR #3: measurement reference](https://github.com/juusokarjanlahti/benefit-app/pull/3)
   **Open, targets main**: reference 0.1.1, exercises, source audit,
   historical evaluation, this handoff and the frozen login case.

The original stack has been unstacked after the first two merges. Review PR #3
against main. Re-read actual GitHub status on resume instead of assuming this
snapshot is current; do not recreate the already merged PRs.

## Validated and outstanding

- Local read-only MCP rebuild passed after syncing main.
- MCP contract build/test passed, including reports save/readback against a fake API.
- Earlier real MCP smoke tests read the local backend and saved demo project 11,
  `[MCP demo] Customer portal - 2026-11-25`, with three components. That live test
  predates the main refresh; do not recreate the demo blindly on resume.
- Formatting and patch checks passed. Frontend/backend suites were skipped because
  the PR changes do not modify those sources relative to synced main.
- No GitHub workflow runs were reported at the last check; CI is not claimed green.
- Reference 0.1.1 text exercises scored 19/19 cases and 49/49 fields. Original 0.1.0
  results (18/19, 48/49) are retained under evaluations/0.1.0. These are limited
  interpretation exercises, not real-world measurement accuracy or vision results.
- Full ISO material, independent expert review and unseen-image benchmarks remain
  outstanding. Other interpretation/implementation gaps are in open-questions.md.
- The MCP can read MLA trees, but creation cannot save them. Do not flatten an MLA
  draft into top-level components or imply it has been saved faithfully.

## Frozen current experiment

[Benefit login first pass](case-studies/benefit-login-2026-11-26/README.md) is frozen
before professional review. It proposes 8 core login elements; shared header and
several interpretation/reference questions remain open. There is no final FP total,
no supplied professional baseline and no saved login measurement project.

The experiment used browser observation only. Scope was limited to login-page
states, with MLA chosen as the measurement convention at the user's request. React,
Spring Boot and PostgreSQL were not treated as enough evidence to infer logical
entities or reference counts.

## Resume here

1. Read this note, the frozen case and current PR/main state. Preserve local changes.
2. Obtain the scope manager's independent count with the same page states, shared
   header allocation and MLA scope. Record what evidence and AI output they saw.
3. Compare function inventory, counted/excluded elements, references, default use
   and layer allocation. Distinguish AI mistakes from scope differences or ambiguity.
4. Record findings separately, version the reference if needed, and add reviewed
   regression cases. Do not rewrite the frozen AI answer to improve its score.
5. As a separate controlled implementation task, add MLA creation support and resolve
   required inputs before saving the reviewed login project. Verify via MCP and UI.
6. Expand to another unseen case only after the first comparison is understood.

## Local setup considerations

The registered MCP uses the existing benefit-mcp-smoke worktree and its built server.
Keep that checkout available; moving or archiving it requires updating registration.
Keep Docker Compose running for live tests. The local JWT is in `~/.benefit-mcp.env`;
never print or commit it. It may expire before resumption. Check registration and
connectivity without exposing secrets, then rebuild/restart the client as needed.

Returning to the same chat is useful for context, but these repository artifacts are
the durable handoff and should allow a fresh chat or another collaborator to resume.
