/// <reference types="cypress" />
/// <reference types="cypress-mochawesome-reporter" />
/// <reference types="cypress-terminal-report" />

/*
  Order matters:
  1) register reporter
  2) define afterEach to push logs (with null guard)
  3) install CTR collector once
  4) custom commands can live anywhere, but we keep them at top
*/

// --- Custom commands ---------------------------------------------------------
import { safeType, overwrite } from './commands';

Cypress.Commands.add('safeType', { prevSubject: true }, safeType);
Cypress.Commands.add('overwrite', { prevSubject: true }, overwrite);

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      safeType(value: string | number): Chainable<JQuery<HTMLElement>>;
      overwrite(value: string | number): Chainable<JQuery<HTMLElement>>;
    }
  }
}

// --- BrowserStack Test Observability (safe in support) -----------------------
import 'browserstack-cypress-cli/bin/testObservability/cypress';

// --- Mochawesome reporter ----------------------------------------------------
import 'cypress-mochawesome-reporter/register';

// Push terminal logs into the Mochawesome report for each test (null-safe)
afterEach(() => {
  cy.wait(50, { log: false }).then(() => {
    const getLogs =
      (Cypress as any).TerminalReport?.getLogs as
        | ((fmt?: 'txt' | 'json' | 'html') => string | null)
        | undefined;

    const logs = getLogs?.('txt') ?? null;

    // Only add context if we actually have logs
    if (logs) {
      cy.addTestContext({ title: 'Terminal logs', value: logs });
    }
  });
});

// --- Cypress Terminal Report (collector) -------------------------------------
import installLogsCollector from 'cypress-terminal-report/src/installLogsCollector';
installLogsCollector({
  collectTypes: [
    'cons:log','cons:info','cons:warn','cons:error',
    'cy:command','cy:intercept','cy:xhr','cy:request','cy:log'
  ],
  xhr: {
    printBody: true,
    printHeaderData: false,
    printRequestData: false,
  },
});
