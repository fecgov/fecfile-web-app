# CI Scheduling: Weekly Cross-Browser E2E (Main Branch)

This repo uses **CircleCI Schedule Triggers (scheduled pipelines)** (not cron triggers in `.circleci/config.yml`) to run cross-browser E2E jobs on `main`.

---

## Why this exists

Cross-browser runs are scheduled/opt-in because they are heavier than default push/PR CI.

Now we use:

1. **Pipeline-parameter gating** so cross-browser workflow does **not** run on pushes
2. **A dedicated CircleCI schedule** for `main`
3. A browser matrix (Chrome/Firefox/Edge) for both smoke and extended suites

---

## Key implementation details

### Project slug

CircleCI project slug:

- `gh/fecgov/fecfile-web-app`

### Pipeline parameters (in `.circleci/config.yml`)

- `is-triggered-cross-browser` (boolean, default `false`)
  - enables the `cross-browser-weekly` workflow
- `cypress-browsers-image` (string)
  - pinned Cypress browsers image tag used by E2E jobs

### Workflows

- `primary`
  - default workflow for regular pushes/PRs
  - explicitly guarded to **not** run cross-browser workflow jobs
- `cross-browser-weekly`
  - runs E2E smoke + extended as a matrix:
    - `chrome`
    - `firefox`
    - `edge`
  - runs only when `is-triggered-cross-browser: true`

---

## Where schedules are defined

Schedules are managed in CircleCI (UI):

- CircleCI -> Project -> **Project Settings** -> **Triggers / Schedules** (UI wording varies)

Schedules are **not** stored in git.

---

## Required schedule (current scope)

Create this schedule in CircleCI (example time: weekly at **06:00 UTC**):

### 1) `cross-browser-main`
- Branch: `main`
- Pipeline parameters:
  - `is-triggered-cross-browser: true`

---

## Version traceability (logs + artifacts)

Each E2E matrix job captures browser/tool versions inline in the existing test command:

- Printed to job logs
- Written to `ci/browser-versions.txt` inside the test container
- Exported as CircleCI artifact at `cypress/ci/browser-versions.txt`

This avoids repo scripts while still preserving downloadable run metadata.

---

## Verification checklist (acceptance criteria)

1. **Scheduled pipeline appears on `main`**
   - verify `cross-browser-main` runs on cadence
2. **Cross-browser does not run on normal pushes**
   - push to `main`
   - confirm `primary` runs as normal
   - confirm `cross-browser-weekly` does not run unless triggered by parameter
3. **Matrix coverage**
   - verify smoke + extended both run for:
     - `chrome`
     - `firefox`
     - `edge`
4. **Version traceability present**
   - confirm job logs include browser/tool version output
   - confirm artifact `cypress/ci/browser-versions.txt` exists per matrix job

---

## Troubleshooting

### Cross-browser workflow did not run
1. confirm the schedule exists and targets branch `main`
2. confirm schedule parameter includes:
   - `is-triggered-cross-browser: true`
3. confirm the pipeline was schedule-triggered (or manually run with parameter), not a normal push

### Missing version artifact
1. confirm the job reached artifact staging step (`when: always`)
2. confirm `docker cp` captured `/root/fecfile-web-app/front-end/ci/`
3. check job logs for version block output (helps distinguish generation vs copy issue)

### Browser version drift
1. confirm `.circleci/config.yml` still uses pinned `cypress-browsers-image`
2. avoid switching back to mutable tags such as `latest`

---

## Future expansion

If branch coverage expands later, create additional schedules in CircleCI UI with the same parameter:

- `is-triggered-cross-browser: true`

No code changes are needed for branch expansion.
