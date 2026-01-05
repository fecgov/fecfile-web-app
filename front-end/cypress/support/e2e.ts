/// <reference path="../../node_modules/cypress/types/index.d.ts" />
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

let currentTestTitle = 'unknown';
let currentSpecName = 'unknown';

beforeEach(() => {
  currentTestTitle = (Cypress).currentTest?.title ?? 'unknown';
  currentSpecName = (Cypress.spec)?.relative ?? Cypress.spec.name ?? 'unknown';
});

Cypress.on('window:before:load', (win) => {
  const runId = String(Cypress.env('silkRunId') ?? '');
  if (!runId) return;

  const getPathname = (url: string) => {
    try {
      return new URL(url, win.location.origin).pathname;
    } catch {
      return url;
    }
  };

  const shouldTag = (url: string) => {
    const path = getPathname(url || '');
    if (!path.startsWith('/api/')) return false;
    if (path.startsWith('/api/docs/')) return false;
    return true;
  };

  const setCommonHeaders = (setHeader: (name: string, value: string) => void) => {
    setHeader('X-Test-Source', 'cypress');
    setHeader('X-Test-Run-Id', runId);
    if (currentTestTitle) setHeader('X-Test-Title', currentTestTitle);
    if (currentSpecName) setHeader('X-Test-Spec', currentSpecName);
  };

  const originalFetch = win.fetch.bind(win);
  win.fetch = (input: RequestInfo | URL, init: RequestInit = {}) => {
    const url = typeof input === 'string' ? input : (input as Request).url;
    if (shouldTag(url)) {
      const headers = new Headers(init.headers || {});
      setCommonHeaders((name, value) => headers.set(name, value));
      init.headers = headers;
    }
    return originalFetch(input, init);
  };

  const originalOpen = win.XMLHttpRequest.prototype.open;
  const originalSend = win.XMLHttpRequest.prototype.send;

  win.XMLHttpRequest.prototype.open = function (
    method: string,
    url: string,
    async?: boolean,
    user?: string | null,
    password?: string | null,
  ) {
    (this as any).__silkUrl = url;
    return originalOpen.call(this, method, url, async ?? true, user ?? null, password ?? null);
  };

  win.XMLHttpRequest.prototype.send = function (body?: Document | BodyInit | null) {
    try {
      const url = String((this as any).__silkUrl || '');
      if (shouldTag(url)) {
        setCommonHeaders((name, value) => this.setRequestHeader(name, value));
      }
    } catch {
      // ignore header injection errors
    }
    return originalSend.call(this, body ?? null);
  };
});
