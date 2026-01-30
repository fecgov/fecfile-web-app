/// <reference path="../../node_modules/cypress/types/index.d.ts" />
import { RunOptions } from 'axe-core';
import * as commands from './commands';
import { registerFailOn5xx } from './fail-on-5xx';
import 'cypress-axe';
import 'cypress-mochawesome-reporter/register';

Cypress.Commands.add('safeType', { prevSubject: true }, commands.safeType);
Cypress.Commands.add('overwrite', { prevSubject: true }, commands.overwrite);

registerFailOn5xx();

declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      addTestContext(context: unknown): Chainable<void>;
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
