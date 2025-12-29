/// <reference path="../../node_modules/cypress/types/index.d.ts" />
/*

  The index file imports commands and adds them to Cypress

*/

import { safeType, overwrite } from './commands';

const SILK_PROFILE_HEADER = 'x-silk-profile';
const SILK_RUN_ID_HEADER = 'x-silk-run-id';
const SILK_SPEC_HEADER = 'x-silk-spec';
const SILK_TEST_HEADER = 'x-silk-test';

function getCurrentTestPath(): string {
  const runnable = Cypress.state('runnable') as any;
  const titlePath = runnable?.titlePath?.();
  if (Array.isArray(titlePath) && titlePath.length) {
    return titlePath.join(' > ');
  }
  return 'unknown-test';
}

function buildSilkHeaders(testPath: string): Record<string, string> {
  return {
    [SILK_PROFILE_HEADER]: '1',
    [SILK_RUN_ID_HEADER]: String(Cypress.env('SILK_RUN_ID') || 'unknown-run'),
    [SILK_SPEC_HEADER]: Cypress.spec?.name || 'unknown-spec',
    [SILK_TEST_HEADER]: testPath || 'unknown-test',
  };
}

function isApiUrl(url: string): boolean {
  try {
    const baseUrl = Cypress.config('baseUrl') || window.location.origin;
    const resolved = new URL(url, baseUrl);
    return resolved.pathname.startsWith('/api/');
  } catch {
    return url.includes('/api/');
  }
}

function normalizeRequestArgs(args: any[]) {
  if (args.length === 1 && typeof args[0] === 'object') {
    return { ...args[0] };
  }
  if (args.length >= 2 && typeof args[0] === 'string' && typeof args[1] === 'string') {
    return {
      method: args[0],
      url: args[1],
      body: args[2],
    };
  }
  if (args.length >= 2 && typeof args[0] === 'string') {
    return {
      url: args[0],
      method: 'POST',
      body: args[1],
    };
  }
  if (args.length === 1 && typeof args[0] === 'string') {
    return {
      url: args[0],
      method: 'GET',
    };
  }
  return {};
}
Cypress.Commands.add('safeType', { prevSubject: true }, safeType);
Cypress.Commands.add('overwrite', { prevSubject: true }, overwrite);

beforeEach(function () {
  const testPath = this.currentTest?.titlePath().join(' > ') || 'unknown-test';
  const silkHeaders = buildSilkHeaders(testPath);

  cy.intercept({ url: '**/api/**', middleware: true }, (req) => {
    Object.assign(req.headers, silkHeaders);
    req.continue();
  });
});

Cypress.Commands.overwrite('request', (originalFn, ...args) => {
  const options = normalizeRequestArgs(args);
  if (options.url && isApiUrl(options.url)) {
    const testPath = getCurrentTestPath();
    options.headers = {
      ...(options.headers || {}),
      ...buildSilkHeaders(testPath),
    };
  }
  return originalFn(options);
});

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
