# CI Scheduling: Nightly E2E & Latest Sprint Auto-Targeting

This repo uses **CircleCI Schedule Triggers (scheduled pipelines)** (not cron triggers in `.circleci/config.yml`) to run the **full-nightly** workflow on:

- `main`
- `develop`
- `release/test`
- **only the latest** `release/sprint-<N>` branch (greatest integer `N`)

During sprint overlap (e.g., `release/sprint-78` and `release/sprint-79` both exist), **only the latest sprint** receives scheduled nightly pipelines. Older sprint branches should **not** show scheduled nightly pipelines in CircleCI.

---

## Why this exists

Previously, the regex-based scheduled workflow in `.circleci/config.yml` matched multiple `release/sprint-*` branches during overlaps.

Now we use:

1. **Pipeline-parameter gating** so the nightly workflow does **not** run on pushes
2. **Separate CircleCI schedules** for the static branches
3. A single schedule named **`nightly-latest-sprint`** that is automatically updated to point at the newest sprint branch via an updater job/script

---

## Key implementation details

### Project slug

CircleCI project slug (used by the updater script / API commands):

- `gh/fecgov/fecfile-web-app`

> Note: This is a GitHub OAuth slug, which supports schedule trigger management via the CircleCI v2 Schedule API.

### Pipeline parameters (in `.circleci/config.yml`)

- `is-triggered-full-nightly` (boolean, default `false`)
  - enables the `full-nightly` workflow
- `is-triggered-update-sprint-schedule` (boolean, default `false`)
  - enables the updater workflow which retargets the latest-sprint schedule

### Workflows

- `primary`
  - default workflow for regular pushes/PRs
- `full-nightly`
  - runs nightly jobs **only** when triggered by schedule or manually through the CircleCI UI
- `update-sprint-schedule`
  - runs the updater script to move `nightly-latest-sprint` to the newest sprint branch

### Updater script

Location (relative to repo root):

- `scripts/update_sprint_schedule_trigger.py`

What it does:

1. lists remote branches matching `release/sprint-<integer>` (e.g., `release/sprint-78` & `release/sprint-79`)
2. picks the **greatest** sprint number
3. finds the CircleCI schedule named `nightly-latest-sprint`
4. PATCHes that schedule so `parameters.branch = release/sprint-<latest>`

**Sprint selection rules**
- deterministic: **greatest integer sprint number wins**
- **No multi-part versions** supported (e.g., `78.1` is ignored by design)

---

## Where schedules are defined

Schedules are managed in CircleCI (UI):

- CircleCI → Project → **Project Settings** → **Triggers / Schedules** (UI wording varies)

Schedules are **not** stored in git, and **do not** require edits to `.circleci/config.yml` once set up.

---

## Required schedules

Create these schedules in CircleCI (example time: **06:00 UTC daily**):

### 1) `nightly-main`
- Branch: `main`
- Pipeline parameters:
  - `is-triggered-full-nightly: true`

### 2) `nightly-develop`
- Branch: `develop`
- Pipeline parameters:
  - `is-triggered-full-nightly: true`

### 3) `nightly-release-test`
- Branch: `release/test`
- Pipeline parameters:
  - `is-triggered-full-nightly: true`

### 4) `nightly-latest-sprint`
- Branch: set once initially to the current latest sprint (example: `release/sprint-78`)
- Pipeline parameters:
  - `is-triggered-full-nightly: true`

---

## Updater schedule (recommended)

To keep `nightly-latest-sprint` always targeting the newest sprint branch automatically, create:

### 5) `update-nightly-latest-sprint`
- branch: `main`
- time: before the nightly window (example: **05:30 UTC daily**)
- pipeline parameters:
  - `is-triggered-update-sprint-schedule: true`

**Why run updater on `main`?**
- the updater is “control-plane” logic: it should run from a stable, protected branch
- it avoids needing to retarget *the updater* every sprint
- it ensures the updater always runs the latest script/config version

---

## Secrets and context configuration

The updater needs a CircleCI API token with permission to list and patch schedules.

Context name:

- `nightly-schedule-admin`

Environment variables (stored in the context):

- `CIRCLE_TOKEN` (CircleCI personal API token)
- `CIRCLECI_PROJECT_SLUG` = `gh/fecgov/fecfile-web-app`
- `CIRCLECI_SPRINT_SCHEDULE_NAME` = `nightly-latest-sprint` (optional; defaults to this)

> Operational note: CircleCI schedules run with an “actor”. That actor must have permission to execute workflows that use restricted contexts; otherwise jobs may fail with “Unauthorized”.

---

## Runbook: Sprint cutover

When a new sprint branch is created (example: `release/sprint-79`):

1. Wait until the branch is created in GitHub like normal
2. Let the updater schedule run (next scheduled run), **or** trigger the updater manually:
   - CircleCI → Run pipeline on branch `main`
   - pipeline parameter: `is-triggered-update-sprint-schedule=true`
3. Confirm the updater job logs:
   - detected sprint branches
   - picked the greatest sprint number
   - updated `nightly-latest-sprint` schedule to the new branch
4. Next nightly window: only the newest sprint branch receives scheduled nightly pipelines

---

## Verification checklist (acceptance criteria)

### Branch coverage
Confirm scheduled nightly pipelines appear daily on:
- `main`
- `develop`
- `release/test`
- latest `release/sprint-<N>`

### Overlap behavior
With two sprint branches present (e.g., `release/sprint-78` and `release/sprint-79`):
- Only `release/sprint-79` shows scheduled nightlies
- `release/sprint-78` shows **no new** scheduled nightly pipelines

### Nightly does not run on pushes
- push to `develop`
- confirm `primary` runs as normal
- confirm `full-nightly` does not run unless triggered by schedule + parameter


---

## Troubleshooting

### Nightly is not running on a branch
1. check that a schedule exists for that branch (`nightly-main`, `nightly-develop`, etc.)
2. confirm the schedule includes:
   - `is-triggered-full-nightly: true`
3. confirm the pipeline did not run from a normal push:
   - nightly should only run from scheduled pipelines (or manually triggered in CircleCI UI)
4. confirm schedule time zone and timing (UTC)

### Older sprint branch still shows nightly pipelines
- old pipelines remain in history; what matters is **no new scheduled pipelines** appear.
- ensure `nightly-latest-sprint` has been retargeted to the newest sprint

### Updater job fails
Common causes:

- **Schedule not found**
  - you must create the schedule named `nightly-latest-sprint` once in the CircleCI UI
- **Unauthorized**
  - context/actor mismatch; token missing; or actor lacks access to required context
- **No sprint branches found**
  - branch naming does not match `release/sprint-<integer>`
- **Multiple schedules with the same name**
  - ensure `nightly-latest-sprint` is unique

---

## API quick-reference (optional)

List schedules:

```bash
curl --request GET \
  --url "https://circleci.com/api/v2/project/gh/fecgov/fecfile-web-app/schedule" \
  --header "Circle-Token: ${CIRCLE_TOKEN}"
