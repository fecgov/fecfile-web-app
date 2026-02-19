/// <reference path="../../node_modules/cypress/types/index.d.ts" />
import { RunOptions } from 'axe-core';
import * as commands from './commands';
import { popAliasEvent, pushAliasEvent } from './alias-event-context';
import { registerFailOn5xx } from './fail-on-5xx';
import 'cypress-axe';
import 'cypress-mochawesome-reporter/register';

type InterceptTimesPolicy = number | 'any';
type TimesAwareMatcher = {
  times?: InterceptTimesPolicy;
  middleware?: boolean;
  [key: string]: unknown;
};

const DEFAULT_INTERCEPT_TIMES = 1;

function isStringOrRegExp(value: unknown): value is string | RegExp {
  return typeof value === 'string' || value instanceof RegExp;
}

function normalizeMatcherTimes<T>(matcher: T): T {
  if (!matcher || typeof matcher !== 'object' || Array.isArray(matcher)) return matcher;

  const typedMatcher = matcher as TimesAwareMatcher;

  if (typedMatcher.times === 'any') {
    const { times: _times, ...rest } = typedMatcher;
    return rest as T;
  }

  // Global observer intercepts (middleware=true) should remain open-ended.
  if (typedMatcher.middleware === true) return matcher;

  if (typedMatcher.times === undefined) {
    return { ...typedMatcher, times: DEFAULT_INTERCEPT_TIMES } as T;
  }

  return matcher;
}

// Default all intercepts to one match for alias determinism.
// Opt out with matcher `times: 'any'`.
Cypress.Commands.overwrite('intercept', (originalFn: any, ...args: unknown[]) => {
  if (args.length < 1) return originalFn(...args);

  if (isStringOrRegExp(args[0]) && isStringOrRegExp(args[1])) {
    const [method, url, routeHandler] = args;
    const matcher = normalizeMatcherTimes({ method, url });
    return routeHandler === undefined
      ? originalFn(matcher)
      : originalFn(matcher, routeHandler);
  }

  if (isStringOrRegExp(args[0])) {
    const [url, routeHandler] = args;
    const matcher = normalizeMatcherTimes({ url });
    return routeHandler === undefined
      ? originalFn(matcher)
      : originalFn(matcher, routeHandler);
  }

  if (args[0] && typeof args[0] === 'object') {
    args[0] = normalizeMatcherTimes(args[0]);
  }

  return originalFn(...args);
});

Cypress.Commands.add('safeType', { prevSubject: true }, commands.safeType);
Cypress.Commands.add('overwrite', { prevSubject: true }, commands.overwrite);
Cypress.Commands.add('apiRequestWithCookies', (options) =>
  commands.CypressApi.requestWithCookies(options),
);
Cypress.Commands.add('withAliasEvent', (eventLabel: string, run: () => void | Cypress.Chainable<any>) => {
  pushAliasEvent(eventLabel);

  const restoreOnFail = (error: Error): never => {
    popAliasEvent();
    throw error;
  };
  Cypress.once('fail', restoreOnFail);

  return cy.then(() => run()).then((value) => {
    Cypress.off('fail', restoreOnFail);
    popAliasEvent();
    return value;
  });
});

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
      apiRequestWithCookies<T = unknown>(
        options: Partial<Cypress.RequestOptions> & { attachCookieHeader?: boolean }
      ): Chainable<Cypress.Response<T>>;
      withAliasEvent(
        eventLabel: string,
        run: () => void | Cypress.Chainable<any>
      ): Chainable<any>;
      safeType(value: string | number): Chainable<JQuery<HTMLElement>>;
      overwrite(value: string | number): Chainable<JQuery<HTMLElement>>;
    }
  }
}
