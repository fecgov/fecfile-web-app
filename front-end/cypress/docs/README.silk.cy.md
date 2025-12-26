# Cypress + Silk Profiling Runbook

This runbook explains how to tag Cypress /api/** requests so the API's Silk recorder
captures only profiled traffic and exports per-spec artifacts.

For a concise pre-flight checklist and where results are stored, see
`README.silk.meta.md`.

## Quick env setup (optional)

If you prefer, copy/paste the env vars you plan to use into `fecfile-web-api/.env`,
`~/.zshrc`, or another shell profile. Then apply the changes in your terminal:

```bash
source ~/.zshrc
```

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

## Prereqs

- API repo running locally with Silk enabled.
- Cypress available via `npm run profile:e2e`.
- Optional: Locust installed for Mode B.

## Mode A: Silk + Cypress (no Locust)

1. In the API repo, enable Silk and keep Locust off:

   From `fecfile-web-api/`:

   ```bash
   export FECFILE_SILK_ENABLED=1  # Silk middleware/hooks: 1/true -> enable; 0/false/unset -> disable
   export FECFILE_PROFILE_WITH_LOCUST=0  # Mode A: Locust off, SILKY_ANALYZE_QUERIES on
   ```

2. Run migrations and collectstatic (first time or after migrations):

   From `fecfile-web-api/django-backend/`:

   ```bash
   python manage.py migrate
   python manage.py collectstatic --no-input
   ```

3. Start the API (docker compose or `runserver`).

   Docker compose should be run from `fecfile-web-api/`; `runserver` should be run from `fecfile-web-api/django-backend/`. Docker compose can still be run from `fecfile-web-api/` even when `FECFILE_SILK_ENABLED` is set in `.env`.

4. In the web app repo, run Cypress with profiling exports enabled:

   From `fecfile-web-app/front-end/`:

   ```bash
   export FECFILE_API_ROOT=/path/to/fecfile-web-api  # API repo root (or .../django-backend) for exporter
   npm run profile:e2e
   ```

   Notes:
   - `FECFILE_API_ROOT` can point to the API repo root or `.../django-backend`.
   - The command prints `FECFILE_PROFILE_RUN_ID` to the console.

5. Validate capture:

   - Visit `http://localhost:8080/silk/` and confirm only `/api/**` requests appear.
   - Exported artifacts land in `silk/<run-id>/` (automatic if `FECFILE_API_ROOT` is set).
   - Manual export is also available:

     From `fecfile-web-api/django-backend/`:

     ```bash
     python manage.py silk_export_profile --run-id <run-id> --outdir silk
     ```

## Mode B: Silk + Locust + Cypress

1. Enable Silk and Locust mode in the API repo:

   From `fecfile-web-api/`:

   ```bash
   export FECFILE_SILK_ENABLED=1  # Silk middleware/hooks: 1/true -> enable; 0/false/unset -> disable
   export FECFILE_PROFILE_WITH_LOCUST=1  # Mode B: Locust on, SILKY_ANALYZE_QUERIES off
   export FECFILE_LOCUST_SILK_SAMPLE_PCT=2.0  # percent of Locust requests to record (0-100)
   ```

   This turns `SILKY_ANALYZE_QUERIES` off to keep Locust volumes manageable.

2. Choose a shared run id and export it for all clients:

   From `fecfile-web-api/` (or any shell that will run both clients):

   ```bash
   export FECFILE_PROFILE_RUN_ID=$(python -c 'import uuid; print(uuid.uuid4())')  # shared run id for Cypress + Locust
   ```

3. Start the API (migrate/collectstatic if needed).

   Docker compose should be run from `fecfile-web-api/`; `runserver` should be run from `fecfile-web-api/django-backend/`. Docker compose can still be run from `fecfile-web-api/` even when `FECFILE_SILK_ENABLED` is set in `.env`.

4. Run Locust with the same run id:

   From `fecfile-web-api/`:

   ```bash
   FECFILE_PROFILE_RUN_ID=$FECFILE_PROFILE_RUN_ID locust -f performance-testing/locustfile.py --headless -u 50 -r 10 -t 10m --host http://localhost:8080  # shared run id
   ```

   Docker compose variant (API repo, assumes API running via docker compose):

   From `fecfile-web-api/`:

   ```bash
   docker compose --profile locust run --rm \
     -e FECFILE_PROFILE_RUN_ID=$FECFILE_PROFILE_RUN_ID locust-leader \
     -f /mnt/locust/performance-testing/locustfile.py --headless \
     -u 50 -r 10 -t 10m --host http://fecfile-api-proxy:8080  # shared run id
   ```

5. Run Cypress with the same run id and exports enabled:

   From `fecfile-web-app/front-end/`:

   ```bash
   FECFILE_PROFILE_RUN_ID=$FECFILE_PROFILE_RUN_ID FECFILE_API_ROOT=/path/to/fecfile-web-api npm run profile:e2e  # shared run id + exporter path
   ```

6. Review artifacts:

   - `silk/<run-id>/index.html` shows both Cypress and Locust groups.
   - Per-group outputs live at `silk/<run-id>/<client>/<group>/`.

## Troubleshooting

- If exports do not run, verify `FECFILE_API_ROOT` points to a path that contains
  `manage.py` or a `django-backend/manage.py`.
- If Silk is not recording anything, confirm:
  - `FECFILE_SILK_ENABLED=1`
  - requests include `X-FECFILE-PROFILE-RUN-ID`
  - `/api/**` is the request path prefix (Silk ignores non-API paths).
