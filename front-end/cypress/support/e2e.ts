/// <reference path="../../node_modules/cypress/types/index.d.ts" />
/*

  The index file imports commands and adds them to Cypress

*/

import { safeType, overwrite } from './commands';
Cypress.Commands.add('safeType', { prevSubject: true }, safeType);
Cypress.Commands.add('overwrite', { prevSubject: true }, overwrite);

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      safeType(value: string | number): Chainable<JQuery<HTMLElement>>;
      overwrite(value: string | number): Chainable<JQuery<HTMLElement>>;
    }
  }
}

import 'browserstack-cypress-cli/bin/testObservability/cypress'
