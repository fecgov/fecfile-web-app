/// <reference path="../../node_modules/cypress/types/index.d.ts" />
/*

  The index file imports commands and adds them to Cypress

*/

import { safeType, overwrite } from './commands';
Cypress.Commands.add('safeType', { prevSubject: true }, safeType);
Cypress.Commands.add('overwrite', { prevSubject: true }, overwrite);

const HEADER_VALUE_MAX = 200;
const PROFILE_CLIENT = 'cypress';
const HTTP_METHODS = new Set(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD']);
const requestSeqByTestInstance = new WeakMap<object, number>();
const requestSeqByFallbackKey = new Map<string, number>();

const sanitizeHeaderValue = (value: string) =>
  value
    .replaceAll(/[\r\n]+/g, ' ')
    .replaceAll(/[\\/]+/g, '_')
    .replaceAll(/\s+/g, ' ')
    .trim()
    .slice(0, HEADER_VALUE_MAX);

const getSpecGroup = () =>
  sanitizeHeaderValue(Cypress.spec?.relative || Cypress.spec?.name || 'unknown-spec');

const getCurrentTestTitle = () => {
  const runnable = (Cypress as any).state('runnable');
  const test = runnable?.type === 'test' ? runnable : runnable?.ctx?.currentTest;
  if (typeof test?.fullTitle === 'function') {
    return test.fullTitle();
  }
  return test?.title || '';
};

const getTestInstance = (): object | null => {
  const runnable = (Cypress as any).state('runnable');
  const test = runnable?.type === 'test' ? runnable : runnable?.ctx?.currentTest;
  return test || null;
};

const getNextSeq = (testInstance: object | null, fallbackKey: string) => {
  if (testInstance && typeof testInstance === 'object') {
    const next = (requestSeqByTestInstance.get(testInstance) || 0) + 1;
    requestSeqByTestInstance.set(testInstance, next);
    return next;
  }

  const next = (requestSeqByFallbackKey.get(fallbackKey) || 0) + 1;
  requestSeqByFallbackKey.set(fallbackKey, next);
  return next;
};

const buildProfileHeaders = () => {
  const runId = Cypress.env('FECFILE_PROFILE_RUN_ID');
  if (!runId) {
    return {};
  }

  const headers: Record<string, string> = {
    'x-fecfile-profile-run-id': sanitizeHeaderValue(String(runId)),
    'x-fecfile-profile-client': PROFILE_CLIENT,
    'x-fecfile-profile-group': getSpecGroup(),
  };

  const testTitle = getCurrentTestTitle();
  if (testTitle) {
    const testInstance = getTestInstance();
    const retry =
      testInstance && typeof (testInstance as any).currentRetry === 'function'
        ? (testInstance as any).currentRetry()
        : 0;
    const testKey = `${testTitle}::${Cypress.spec?.relative || Cypress.spec?.name || 'unknown-spec'}::${retry}`;
    headers['x-fecfile-profile-test'] = sanitizeHeaderValue(testTitle);
    headers['x-fecfile-profile-seq'] = String(getNextSeq(testInstance, testKey));
  }

  return headers;
};

const isApiUrl = (url?: string) => {
  if (!url) {
    return false;
  }
  try {
    const baseUrl = Cypress.config('baseUrl') || globalThis.location.origin;
    const parsed = new URL(url, baseUrl);
    return parsed.pathname.startsWith('/api/');
  } catch {
    return url.includes('/api/');
  }
};

beforeEach(() => {
  cy.intercept({ url: '**/api/**', middleware: true }, (req) => {
    const headers = buildProfileHeaders();
    if (Object.keys(headers).length > 0) {
      req.headers = { ...req.headers, ...headers };
    }
    req.continue();
  });
});

Cypress.Commands.overwrite(
  'request',
  (
    originalFn: (...args: any[]) => Cypress.Chainable<any>,
    ...args: any[]
  ) => {
    let options: Partial<Cypress.RequestOptions>;

    if (typeof args[0] === 'string') {
      if (args.length === 1) {
        options = { url: args[0] };
      } else if (args.length === 2) {
        if (HTTP_METHODS.has(args[0].toUpperCase())) {
          options = { method: args[0], url: args[1] };
        } else {
          options = { url: args[0], body: args[1] };
        }
      } else {
        options = { method: args[0], url: args[1], body: args[2] };
      }
    } else {
      options = { ...(args[0]) };
    }

    if (isApiUrl(options.url)) {
      const headers = buildProfileHeaders();
      options.headers = { ...(options.headers), ...headers };
    }

    return originalFn(options as Cypress.RequestOptions);
  },
);

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
