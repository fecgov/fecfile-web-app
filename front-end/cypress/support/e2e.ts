/// <reference path="../../node_modules/cypress/types/index.d.ts" />
/*

  The index file imports commands and adds them to Cypress

*/
import { RunOptions } from 'axe-core';
import * as commands from './commands';
import 'cypress-axe';
import 'cypress-mochawesome-reporter/register';
Cypress.Commands.add('safeType', { prevSubject: true }, commands.safeType);
Cypress.Commands.add('overwrite', { prevSubject: true }, commands.overwrite);

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      checkA11yCritical(
        context?: any,
        options?: Partial<RunOptions> & { includedImpacts?: string[] },
        waivers?: Record<string, { reason: string; link: string }>
      ): Chainable<void>;
      safeType(value: string | number): Chainable<JQuery<HTMLElement>>;
      overwrite(value: string | number): Chainable<JQuery<HTMLElement>>;
    }
  }
}
