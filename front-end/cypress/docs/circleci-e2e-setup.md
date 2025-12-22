# CircleCI E2E reporting setup

This guide covers the CircleCI configuration, contexts, and environment variables needed for Cypress E2E artifacts and unified reporting.

## 1) Create or update the cypress context
1. In CircleCI, create a context named `cypress` (or update it if it already exists).
2. Add the reporting secrets to the context:
   - CIRCLE_TOKEN (CircleCI API v2 personal token)
   - CIRCLE_PROJECT_SLUG (example: `gh/fecgov/fecfile-web-app`)
   - GITHUB_TOKEN (PAT with repo issues/comments/labels permissions)
3. The E2E/Cypress vars already live in CircleCI project environment variables, so keep using those (no need to duplicate them in the context).
4. Optional: add `NIGHTLY_SPRINT` (example: `Sprint-42`) to link nightly incidents to a sprint epic. If it is unset, the report job will parse `PIPELINE_SCHEDULE_NAME` for `Sprint-<N>` and use that value.

## 2) Workflow context signals
The `e2e-report` job uses these signals to decide when to create nightly incidents:
- `RUN_CONTEXT` is set in workflows to `primary`, `triggered`, or `nightly`.
- `PIPELINE_TRIGGER_SOURCE` is set from `pipeline.trigger_source`.
- `PIPELINE_SCHEDULE_NAME` is set from `pipeline.schedule.name`.

## 3) Artifact staging paths
E2E tests run inside `cypress/browsers:latest`. Artifacts are copied out of the container and staged on the host:
- Results: `/tmp/cypress/results`
- Videos: `/tmp/cypress/videos`
- Screenshots: `/tmp/cypress/screenshots`
- Debug breadcrumbs: `/tmp/cypress/debug`
- Unified summary: `/tmp/cypress/out/run-summary.md`

The debug breadcrumb file is written inside the container at `/tmp/fecfile_ci_debug.txt` and then copied to `/tmp/cypress/debug/`.

## 4) Unified report behavior
- E2E jobs trigger a report-only pipeline via the CircleCI API using `CIRCLE_TOKEN` and `CIRCLE_PROJECT_SLUG`.
- `e2e-report` polls the original workflow until `e2e-smoke` and/or `e2e-extended` are in a terminal state before building the summary.
- It posts a sticky PR comment (if a PR exists) and a sticky GitHub Issue comment for Jira syncing.
- It applies labels like `e2e-failure`, `e2e-smoke`, `e2e-extended`, and `nightly-e2e` when failures occur.
- Nightly incidents and the rollup issue are created only when nightly context rules are met.

## 5) Optional wait tuning
If needed, you can tune the polling behavior by adding these optional env vars to the `cypress` context:
- E2E_REPORT_POLL_MS (default 15000)
- E2E_REPORT_MAX_WAIT_MS (default 2700000)
- E2E_REPORT_DISCOVER_MS (default 120000)
- E2E_REPORT_SETTLE_MS (default 5000)

## 6) Polling mode
The report pipeline runs without workflow-level `requires`. Instead, the `e2e-report` job waits for E2E jobs by polling the CircleCI API. Each E2E job invokes the trigger script, which adds a short delay and checks recent pipelines to avoid duplicate report pipelines when both suites run. The polling env vars belong in the `cypress` context so they apply to `e2e-report` when it runs.

## 7) Quick verification
1. Trigger a failing E2E run.
2. Confirm CircleCI artifacts exist under `cypress/results`, `cypress/videos`, `cypress/screenshots`, and `cypress/debug`.
3. Confirm a single sticky PR comment and a single sticky issue comment are posted.
4. For nightly runs, confirm incident issues, rollup updates, and sprint epic linking when `NIGHTLY_SPRINT` is set.
