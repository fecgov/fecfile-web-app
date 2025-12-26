# Silk Profiling Meta-Runbook (API + Cypress + Locust)

This is the pre-flight checklist and run sequence for:
- Mode A: Silk + Cypress
- Mode B: Silk + Locust + Cypress

For full details, also see:
- `README.silk.cy.md`
- `fecfile-web-api/README.md`
- `fecfile-web-api/performance-testing/README.md`

## Quick env setup (optional)

If you prefer, copy/paste the env vars you plan to use into `fecfile-web-api/.env`,
`~/.zshrc`, or another shell profile. Then apply the changes in your terminal:

```bash
source ~/.zshrc
```
Note: `source ~/.zshrc` is done in your working terminal after you've added the environment variables to your .zshrc, .env, etc.,


Example (Mode A):

```bash
export FECFILE_SILK_ENABLED=1  # Silk middleware/hooks: 1/true -> enable; 0/false/unset -> disable
export FECFILE_PROFILE_WITH_LOCUST=0  # Mode A: Locust off, SILKY_ANALYZE_QUERIES on
```

Example (Mode B):

```bash
export FECFILE_SILK_ENABLED=1  # Silk middleware/hooks: 1/true -> enable; 0/false/unset -> disable
export FECFILE_PROFILE_WITH_LOCUST=1  # Mode B: Locust on, SILKY_ANALYZE_QUERIES off
export FECFILE_LOCUST_SILK_SAMPLE_PCT=2.0  # percent of Locust requests to record (0-100)
```

## Prereqs (before each run)

### API repo (fecfile-web-api)
- Enable Silk locally:
  - `FECFILE_SILK_ENABLED=1` (1/true enables; 0/false/unset disables)
- Choose run mode:
  - Mode A: `FECFILE_PROFILE_WITH_LOCUST=0` (SILKY_ANALYZE_QUERIES ON)
  - Mode B: `FECFILE_PROFILE_WITH_LOCUST=1` (SILKY_ANALYZE_QUERIES OFF)
- If needed, set Locust sampling:
  - `FECFILE_LOCUST_SILK_SAMPLE_PCT=2.0` (0-100)
- Migrations + static assets (from `fecfile-web-api/django-backend/`):
  - `python manage.py migrate`
  - `python manage.py collectstatic --no-input`
- Start API:
  - `docker compose` from `fecfile-web-api/`, or
  - `runserver` from `fecfile-web-api/django-backend/`

### Cypress repo (fecfile-web-app)
- Ensure E2E login env vars are set (see `front-end/cypress/README.md`).
- Set exporter location if you want auto-exports:
  - `FECFILE_API_ROOT=/path/to/fecfile-web-api` (or `.../django-backend`)

### Optional: Locust (Mode B)
- Locust installed locally or available via docker compose.
- Plan a shared run id for Locust + Cypress:
  - `FECFILE_PROFILE_RUN_ID=<same-id>` in both processes

## Mode A: Silk + Cypress (no Locust)

1. In `fecfile-web-api/`, set:
   - `FECFILE_SILK_ENABLED=1`
   - `FECFILE_PROFILE_WITH_LOCUST=0`
2. Start API (docker compose or runserver).

   From `fecfile-web-api/`:

   ```bash
   docker compose up
   ```

   From `fecfile-web-api/django-backend/`:

   ```bash
   python manage.py runserver 0.0.0.0:8080
   ```
3. In `fecfile-web-app/front-end/`, run:
   - `FECFILE_API_ROOT=/path/to/fecfile-web-api npm run profile:e2e`

## Mode B: Silk + Locust + Cypress

1. In `fecfile-web-api/`, set:
   - `FECFILE_SILK_ENABLED=1`
   - `FECFILE_PROFILE_WITH_LOCUST=1`
   - Optional: `FECFILE_LOCUST_SILK_SAMPLE_PCT=2.0`
2. Create a shared run id and export it:
   - `export FECFILE_PROFILE_RUN_ID=$(python -c 'import uuid; print(uuid.uuid4())')`
3. Start API.

   From `fecfile-web-api/`:

   ```bash
   docker compose up
   ```

   From `fecfile-web-api/django-backend/`:

   ```bash
   python manage.py runserver 0.0.0.0:8080
   ```
4. Run Locust with the same run id.
5. Run Cypress with the same run id:
   - `FECFILE_PROFILE_RUN_ID=$FECFILE_PROFILE_RUN_ID FECFILE_API_ROOT=/path/to/fecfile-web-api npm run profile:e2e`

## Where results are stored

1) **Silk DB tables**  
   All recorded requests/queries are stored in the API database and viewable at:
   - `http://localhost:8080/silk/`

2) **Binary profiler output**  
   Silk cProfile output goes to `SILKY_PYTHON_PROFILER_RESULT_PATH`
   (defaults to `silk-profiles`). Location depends on how the API runs:
   - Local `runserver`: `fecfile-web-api/django-backend/silk-profiles/`
   - Docker container: typically `/opt/nxg_fec/silk-profiles/` inside the container

3) **Exported artifacts (JSON + HTML)**  
   Exported files are written by the management command:
   - `silk/<run-id>/<client>/<group>/profile.json`
   - `silk/<run-id>/<client>/<group>/summary.html`
   - `silk/<run-id>/index.html`

   When the exporter is triggered from Cypress, the output is created relative to the
   `manage.py` working directory resolved from `FECFILE_API_ROOT`.
