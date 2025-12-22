# Cypress E2E CI process (end-to-end)

This is the end-to-end flow for how Cypress E2E results become artifacts, GitHub comments, and Jira-visible updates (via Exalate).

## 1) Workflow starts
1. A commit triggers a CircleCI workflow (primary, triggered, or nightly).
2. `e2e-smoke` and/or `e2e-extended` run on `cimg/node:lts-browsers`.

## 2) E2E jobs execute in Docker
1. Each job launches the `cypress/browsers:latest` container and clones the repo.
2. The container writes debug breadcrumbs (node, chrome, cypress versions) to `/tmp/fecfile_ci_debug.txt`.
3. The E2E suite runs via `ng e2e --spec ...`.

## 3) Artifacts are staged and uploaded
1. The job captures the exit code into `/tmp/cypress/out/e2e_exit_code`.
2. Artifacts are copied from the container to the host with `docker cp`:
   - Results: `/tmp/cypress/results`
   - Videos: `/tmp/cypress/videos`
   - Screenshots: `/tmp/cypress/screenshots`
   - Debug: `/tmp/cypress/debug/fecfile_ci_debug.txt`
3. CircleCI uploads the staged artifacts for each suite.
4. The job exits using the captured exit code so failures are reported correctly.

## 4) Report pipeline is triggered
1. Each E2E job invokes the report trigger script to request a report-only pipeline.
2. The trigger script waits briefly and checks recent pipelines so only one report pipeline is created per workflow.
3. The report pipeline passes the source workflow id, branch, and commit SHA as parameters.
4. `e2e-report` polls the CircleCI API until the source E2E jobs are in a terminal state.

## 5) Summary is generated
1. `build-unified-run-summary.mjs` queries workflow jobs and artifacts.
2. It builds `/tmp/cypress/out/run-summary.md` with:
   - suite/job status and links
   - spec globs
   - retry hints from screenshot filenames
   - debug artifact links

## 6) GitHub comments and labels
1. `post-github-summary.mjs` resolves the PR by commit SHA and upserts a sticky PR comment.
2. It finds the best Jira-mapped GitHub Issue:
   - Jira key from branch, PR, or commit message, or
   - PR closing keywords (Fixes/Closes #123)
3. It upserts a sticky comment on the issue and applies labels:
   - `e2e-failure` when failures occur
   - `e2e-smoke` or `e2e-extended`

## 7) Nightly incident handling (only when eligible)
1. If no PR and no Jira-mapped issue, and a nightly signal is present, the job creates or updates:
   - one incident issue per failed suite
   - one rollup issue with a daily sticky comment
2. If `NIGHTLY_SPRINT` is set, it ensures the sprint epic exists and links incidents to it.

## 8) Jira visibility (via Exalate)
1. Exalate syncs GitHub issue comments and labels into Jira.
2. Jira users review the failure summary and artifacts through the synced issue.

## 9) Where to look
1. CircleCI artifacts: `cypress/results`, `cypress/videos`, `cypress/screenshots`, `cypress/debug`
2. Unified summary: `cypress/run-summary`
3. GitHub: PR comment and issue comment (sticky)
4. Jira: synced issue comment and labels
