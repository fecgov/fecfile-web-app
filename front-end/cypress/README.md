# Cypress E2E

## Overview
- Specs live in `cypress/e2e-smoke` and `cypress/e2e-extended`
- the configuration file is `front-end/cypress.config.ts`
- Tests drive the app at `http://localhost:4200` and hit the API at `http://localhost:8080`
- The `Initialize()` helper (used by many specs in a beforeEach hook) logs in and purges reports and contacts on startup, so use a dedicated E2E database
- make sure you're checked out to the same branch name for both `fecfile-web-api` and `fecfile-web-app`, i.e. `feature/0123-identifying-details`

## Prerequisites
- Node.js + npm (front-end scripts).
- Docker + Docker Compose (backend services)
- Ports `4200` (front-end) and `8080` (API) available

## Quickstart (Local)
1) Start the backend (from `fecfile-web-api`):
   ```bash
   # from dev workspace or whatever parent directory you have the `fecfile-web-api` local repo located i.e., ~/dev/fecfile-web-api 

   # from ~/dev/ 
   cd fecfile-web-api
   docker compose up
   ```
   Note: `E2E_TEST` must be `True` for the contacts purge endpoint. You can create `fecfile-web-api/.env`, add the environment variable in, save it, source it in the terminal, and docker-compose passes it into services. If you don't want to edit `.env`, you can start with:
   ```bash
   # from fecfile-web-api
   E2E_TEST=True docker compose up
   ```

2) Start the front-end (from `fecfile-web-app/front-end`):
   ```bash
   # from ~/dev/
   cd fecfile-web-app/front-end
   npm install
   npm start
   ```
   Note: you can also run `npm run local` instead of `npm start`

3) Run Cypress (see "Running tests" below).

## Backend setup for E2E
- The API container entrypoint runs migrations and seeds data on startup (including `fixtures/user-data.json` and `load_mocked_committee_data`).
- Backend setup details live in the API repo at `fecfile-web-api/README.md`.
- E2E tests purge data via:
  - `POST /api/v1/reports/e2e-delete-all-reports/`
  - `POST /api/v1/contacts/e2e-delete-all-contacts/`
  These only work when `E2E_TEST=True`.
- CircleCI uses the E2E Dockerfiles by setting:
  - `DB_DOCKERFILE=Dockerfile-e2e`
  - `WORKER_DOCKERFILE=Worker_Dockerfile-e2e`
  - `API_DOCKERFILE=Dockerfile-e2e`
  You can do the same locally if you need parity.

## Frontend setup for E2E
- Cypress `baseUrl` is `http://localhost:4200` and is set in `cypress.config.ts`.
- Report submission helpers read `Cypress.env('FILING_PASSWORD')`. To supply it locally, set `CYPRESS_FILING_PASSWORD` before running Cypress.

### Env var tips (.env, .zshrc)
- Local one-off (current shell):
  ```bash
  # from fecfile-web-app/front-end
  export CYPRESS_FILING_PASSWORD="make-it-up"
  ```
- Using a local `.env` file you can `source` (example uses `fecfile-web-api/.env`):
  ```bash
  # from fecfile-web-api
  set -a; source .env; set +a;
  ```
  (Keep `.env` out of git.)
- Using `~/.zshrc` for persistent vars:
  ```bash
  # from your home directory (~)
  printf '\nexport CYPRESS_FILING_PASSWORD="make-it-up"\n' >> ~/.zshrc
  source ~/.zshrc
  ```
- Note: you can just open the file in your IDE (VSCode, Cursor, etc.) and add the environment variables in and then source it in your terminal
- Example file contents:
  ```bash
  # fecfile-web-api/.env
  REDIS_URL=redis://localhost:<port>>
  DATABASE_URL=postgres://postgres:postgres@localhost:<port>>/postgres
  E2E_TEST=True
  MOCK_OIDC_PROVIDER=True
  FECFILE_API_ROOT=/home/<user>/dev/fecfile-web-api
  FECFILE_API_PYTHON=/home/<user>/dev/.venv/bin/python
  OIDC_RP_CLIENT_ID=test_client_id
  FECFILE_SILK_ENABLED=0
  FECFILE_WEB_API_DIR=/home/<user>/dev/fecfile-web-api/django-backend

  ```
  ```bash
  # ~/.zshrc
  export PATH=$HOME/bin:$HOME/.local/bin:/usr/local/bin:$PATH
  # Path to your Oh My Zsh installation
  export ZSH="$HOME/.oh-my-zsh"
  export DJANGO_SECRET_KEY="make-it-up"
  export CYPRESS_RECORD_KEY="f0ce7ede-a176-4d72-8650-756286b47471"
  export CYPRESS_BASE_URL="http://localhost:4200"
  export CYPRESS_EMAIL='test@test.com'
  export CYPRESS_COMMITTEE_ID='C99999999'
  export CYPRESS_PASSWORD=''
  export CYPRESS_FILING_PASSWORD='make-it-up'
  export CYPRESS_PIN='make-it-up'
  export CIRCLE_BRANCH='feature/your-branch'
  export E2E_DJANGO_SECRET_KEY='make-it-up'
  export E2E_DATABASE_URL='postgresql://postgres:postgres@localhost:<port>>/postgres'
  export CELERY_WORKER_STORAGE="local"
  export DB_DOCKERFILE="Dockerfile-e2e"
  export CIRCLECI_CLI_TOKEN="<your-token>"
  export REPO="fecfile-web-app"
  export ORG="fecgov"
  export OPEN_FEC_API_KEY="<your-key>"
  export STAGE_OPEN_FEC_API_KEY="<your-key>"
  export PRODUCTION_OPEN_FEC_API_KEY= "<your-key>"
  export PATH=/usr/local/node/bin:$PATH
  export SPACE=local

  plugins=(git)

  source $ZSH/oh-my-zsh.sh

  PROMPT='%n@%m:%~ %# '

  # -----------------------------

  # ✨ Sweet Dev Prompt (Zsh)

  # -----------------------------

  # Symbols

  CHECK="✔︎"
  CROSS="✘"
  NODE_SYMBOL="⬢"
  DOCKER_SYMBOL="🐳"
  GIT_SYMBOL=""  # optional nerd font

  # Prompt function

  build_prompt() {

  # Exit status

    local exit_status=$?
    if [[ $exit_status -eq 0 ]]; then
      STATUS="$CHECK"
    else
      STATUS="$CROSS ($exit_status)"
    fi

  # Git branch

    if git rev-parse --is-inside-work-tree &>/dev/null; then
      BRANCH="[$(git rev-parse --abbrev-ref HEAD)]"
    else
      BRANCH=""
    fi

  # Node.js version

    if command -v node &>/dev/null; then
      NODE="via $NODE_SYMBOL $(node -v)"
    else
      NODE=""
    fi

  # Docker running?

    if pgrep dockerd &>/dev/null; then
      DOCKER="$DOCKER_SYMBOL"
    else
      DOCKER=""
    fi

  # Build final prompt

    PROMPT="%F{green}$STATUS %F{blue}%n@%m%f:%F{cyan}%~%f %F{yellow}$BRANCH%f $NODE $DOCKER
  ❯ "
  }

  precmd_functions+=(build_prompt)

  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
  [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

  # Load Angular CLI autocompletion

  if command -v ng >/dev/null 2>&1; then
    source <(ng completion script)
  fi

  # activate API venv

  fecapi() {
    source /home/<user>/fecfile-web-api venv"
  }

  ```

## Running tests
### Run Cypress directly (requires the Angular dev server already running)

- Start Angular Dev server from `fecfile-web-app/front-end` in one terminal
  ```bash
  # from fecfile-web-app/front-end
  npm start
  ```
- Interactive runner (UI): from `fecfile-web-app/front-end` in another terminal
  ```bash
  # from fecfile-web-app/front-end
  npx cypress open
  ```
  Then choose a browser and a spec to run.

- Headless run (runs both `e2e-smoke` + `e2e-extended`): from `fecfile-web-app/front-end`
  ```bash
  # from fecfile-web-app/front-end
  npx cypress run
  ```

- Optional flags (Cypress CLI): `--spec` can target a single spec or a glob, for example: `npx cypress run --spec "cypress/e2e-smoke/**/*.cy.ts"`.

### Angular-managed run (starts dev server automatically in the same terminal)
From `fecfile-web-app/front-end`:

Run all tests:
```bash
# from fecfile-web-app/front-end
npm run e2e
```

Run specific spec(s) (comma-separated, no spaces):
```bash
# from fecfile-web-app/front-end
npm run e2e:spec --spec="cypress/path/to/test.cy.ts"
```

Headless (Chrome, watch disabled; mimics CI flags):
```bash
# from fecfile-web-app/front-end
npm run e2e:headless
```

- this runs ` + `e2e-extended`

Headless: e2e-extended suite only:
```bash
# from fecfile-web-app/front-end
npm run e2e:extended:headless
```

Headless: smoke suite only:
```bash
# from fecfile-web-app/front-end
npm run e2e:smoke:headless
```

## CI behavior (CircleCI)

- CircleCI setup info found at `fecfile-web-app/.circleci/README.md`
- CircleCI config lives at `fecfile-web-app/.circleci/config.yml`.
- The `e2e-smoke` and `e2e-extended` jobs:
  - Spin up the API with docker-compose using the E2E Dockerfiles and `E2E_TEST=True`.
  - Run `ng e2e` headless from `fecfile-web-app/front-end` inside a `cypress/browsers:latest` container with `--spec` targeting either `e2e-smoke` or `e2e-extended`, `--watch=false`, and `--browser chrome`.
  - Pass Cypress env vars into the container (`CYPRESS_EMAIL`, `CYPRESS_COMMITTEE_ID`, `CYPRESS_PASSWORD`, `CYPRESS_FILING_PASSWORD`) along with `CIRCLE_BRANCH`.
  - Store test results/artifacts like videos, and/or screenshots from `cypress/results`.

If you want to approximate CI locally, use the headless npm scripts above.

Example (from `fecfile-web-app` repo root):
```bash
# from fecfile-web-app
circleci local execute e2e-smoke
```

## Troubleshooting
- **404 or 500 on `/api/v1/contacts/e2e-delete-all-contacts/`**: `E2E_TEST` is false. Set it in `fecfile-web-api/.env` or run `E2E_TEST=True docker compose up` from `fecfile-web-api`.
- **Cypress can't reach `http://localhost:4200`**: the Angular dev server isn't running. Start it with `npm start` or `npm run local` from `fecfile-web-app/front-end`.
- **Cypress can't reach `http://localhost:8080`**: backend is not running or compose is down. Start it with `docker compose up` from `fecfile-web-api`.
- **Filing password errors on submit**: set `CYPRESS_FILING_PASSWORD` before running specs that submit reports.
- **Clear Cypress cache**: from `fecfile-web-app/front-end`
  ```bash
  # from fecfile-web-app/front-end
  npx cypress cache prune
  ```
  (This prunes cached binaries while keeping the active version.)

## Tips for writing/maintaining tests in this repo
- Put core, critical-path coverage in `cypress/e2e-smoke`.
- Put longer, task-intensive coverage in `cypress/e2e-extended`
- Prefer stable selectors (`data-cy`) used throughout existing specs
- When PrimeNG components are involved, prefer `data-cy` or stable input IDs; avoid brittle `.p-*` class selectors unless there is no alternative.
- Reuse helpers and page objects in `cypress/e2e-smoke/pages`, request helpers in `cypress/e2e-smoke/requests`, `cypress/e2e-extended/**/*.helpers.ts`, and `cypress/e2e-extended/utils/**/*.helpers.ts`
- Avoid flake by waiting on `cy.intercept` aliases before asserting
