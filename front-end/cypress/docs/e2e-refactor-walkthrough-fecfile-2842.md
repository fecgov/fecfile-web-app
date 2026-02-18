# PR #3544 (`feature/2842-refactor-utils`) vs `develop`

## Procedure (high level)

1. fixed the **foundation**: API route construction, intercept matching, and authenticated setup requests

2. fixed **shared UI behavior**: especially datepicker behavior and page-object waits

3. fixed **setup determinism**: `DataSetup` was turned into a true Cypress chainable flow

4. migrated **specs** to consume the shared helpers, so we stop solving the same flaky problem in every file


## Why `cy.wrap(DataSetup(...))` was risky

Cypress already gives async sequencing through its own command queue (`cy.*` chainables)

So when we used `async/await` + `cy.wrap(DataSetup(...))`, we effectively introduced a 2nd promise scheduler on top of Cypress

In the old pattern (pre-refactor `front-end/cypress/e2e-smoke/F3X/setup.ts`), `DataSetup` was `async` and awaited `Cypress.Promise.all(...)`, while calling helpers that queued Cypress commands via callbacks

At the same time, tests did `cy.wrap(DataSetup(...))` (for example many call sites in `front-end/cypress/e2e-smoke/F3X/receipts.cy.ts:44`, `:82`, `:117`, etc.)

That means two interacting async flows were active:

- Cypress command queue flow

- External promise resolution flow

Those flows can drift, which explains the “loose cannon” setup behavior (setup activity overlapping with later UI/navigation steps)

The refactor fixes this by going fully Cypress-native:

- `DataSetup` now returns `Cypress.Chainable<Results>` (`front-end/cypress/e2e-smoke/F3X/setup.ts:35`)

- request helpers return their Cypress chain (`front-end/cypress/e2e-smoke/requests/methods.ts:7`, `:16`, `:25`, `:29`)

- specs now call `DataSetup(...).then(...)` instead of `cy.wrap(DataSetup(...))` (across F3X smoke specs)

So now there is one sequencing model: **Cypress queue only**, which is the deterministic path.


## Foundation Layer (where most flake originates)

### `front-end/cypress.config.ts`

- `front-end/cypress.config.ts:11`

  Added `env.apiUrl` (`CYPRESS_API_URL` fallback)

  Why: removes hard-coded backend origin assumptions


### `front-end/cypress/support/commands.ts`

- `front-end/cypress/support/commands.ts:257`

  Added request option typing for cookie-aware API requests

  Why: standard entry point for setup/cleanup API calls

- `front-end/cypress/support/commands.ts:271`

  Added URL/cookie domain/path matching helpers

  Why: avoid attaching wrong cookies to wrong requests

- `front-end/cypress/support/commands.ts:289`

  Added `CypressApi.requestWithCookies()`

  Why: one reliable path for CSRF + cookies, instead of duplicated inline request boilerplate


### `front-end/cypress/support/e2e.ts`

- `front-end/cypress/support/e2e.ts:10`

  Registered `cy.apiRequestWithCookies`

  Why: exposes new/repurposed command globally

- `front-end/cypress/support/e2e.ts:25`

  Added Cypress command type declaration

  Why: TS safety and maintainability


### `front-end/cypress/e2e-smoke/utils/api.ts`

- `front-end/cypress/e2e-smoke/utils/api.ts:1`

  New file introducing `ApiUtils`

- `front-end/cypress/e2e-smoke/utils/api.ts:17`

  `apiBaseUrl()` reads env and normalizes trailing slashes

- `front-end/cypress/e2e-smoke/utils/api.ts:27`

  `apiPath(path)` for full API URLs (used in `cy.request`)

- `front-end/cypress/e2e-smoke/utils/api.ts:31`

  `apiRoutePrefix()` to normalize pathname prefixes for intercepts

- `front-end/cypress/e2e-smoke/utils/api.ts:41`

  `apiRoutePathname(path)` for stable `pathname` matchers

  Why overall: eliminate brittle full-URL hard-coding


### `front-end/cypress/e2e-smoke/utils/intercepts.ts`

- `front-end/cypress/e2e-smoke/utils/intercepts.ts:1`

  New file introducing `Intercepts`

- `front-end/cypress/e2e-smoke/utils/intercepts.ts:27`

  `reportList()` matcher with regex pathname handling optional form segment/slash variants

- `front-end/cypress/e2e-smoke/utils/intercepts.ts:44`

  `transactionsList()` with opt-in paging params and structured query matching

- `front-end/cypress/e2e-smoke/utils/intercepts.ts:83`

  `summaryCalc()` POST matcher

  Why overall: solve `wait-alias-no-request` by making intercepts reusable and less fragile


### `front-end/cypress/e2e-smoke/requests/methods.ts`

- `front-end/cypress/e2e-smoke/requests/methods.ts:4`

  Added `ApiUtils` import

- `front-end/cypress/e2e-smoke/requests/methods.ts:7`, `:16`, `:25`, `:29`

  `makeF3x`, `makeF24`, `makeContact`, `makeTransaction` now return chainables and use `ApiUtils.apiPath(...)`

- `front-end/cypress/e2e-smoke/requests/methods.ts:39`

  Replaced manual cookie/CSRF request assembly with `cy.apiRequestWithCookies(...)`

  Why: chain correctness + auth consistency + less repeated fragile code


## F3X Utility Refactor (core test architecture)

### `front-end/cypress/e2e-smoke/F3X/setup.ts` (major)

- `front-end/cypress/e2e-smoke/F3X/setup.ts:35`

  `DataSetup` changed to return `Cypress.Chainable<Results>`

- `front-end/cypress/e2e-smoke/F3X/setup.ts:47`

  Added internal `createReports()` chain composition

- `front-end/cypress/e2e-smoke/F3X/setup.ts:68` through `:108`

  Contact/report creation converted from promise-array style to explicit Cypress chain steps

- `front-end/cypress/e2e-smoke/F3X/setup.ts:123`

  Added guard assertion for created report id

  Why: resolves async queue conflicts and setup-order races


## Impact

- intercept stability improves because waits now use shared structured matchers (`pathname` + query), not brittle literal URL strings

- calendar/date-entry flake decreases because datepicker handling is state-aware and panel-close behavior is explicit

- setup race conditions decrease because setup no longer mixes Cypress queueing with external promise orchestration

- cleanup/setup API requests are more reliable due to centralized CSRF/cookie command

- fail-on-5xx posture is preserved; this improves determinism without masking real backend failures


## Conclusion

This PR removes mixed async scheduling and brittle per-spec plumbing, then standardizes on Cypress-native chain flow and shared helpers so tests execute deterministically
