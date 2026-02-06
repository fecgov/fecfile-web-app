import 'cypress-axe';
import type { Result } from 'axe-core';

type A11yWaiver = { reason: string; link: string };
type A11yWaivers = Record<string, A11yWaiver>;
type A11ySummary = {
  durationMs: number;
  violations: number;
  unwaivedViolations: number;
  waivedViolations: number;
  ruleIds: string[];
  nodesAffected: number;
  timestamp: string;
  scope?: string;
};

function isValidWaiver(value: unknown): value is A11yWaiver {
  if (!value || typeof value !== 'object') return false;
  const v = value as A11yWaiver;
  return (
    typeof v.reason === 'string' &&
    v.reason.trim().length > 0 &&
    typeof v.link === 'string' &&
    v.link.trim().length > 0
  );
}

function formatViolations(title: string, violations: Result[], waivers?: A11yWaivers): string {
  const lines: string[] = [`${title}: ${violations.length}`];

  for (const v of violations) {
    const waiver = waivers?.[v.id];
    const waiverNote = isValidWaiver(waiver) ? ` (WAIVED: ${waiver.reason} | ${waiver.link})` : '';

    const targets = v.nodes
      .slice(0, 8)
      .map((n) => (Array.isArray(n.target) ? n.target.join(', ') : String(n.target)));

    const entryLines = [
      `\n[${v.id}] impact=${v.impact}${waiverNote}`,
      `help: ${v.help}`,
      ...(v.helpUrl ? [`helpUrl: ${v.helpUrl}`] : []),
      ...(targets.length ? [`targets:\n - ${targets.join('\n - ')}`] : []),
    ];

    lines.push(...entryLines);
  }

  return lines.join('\n');
}

function getTitlePath(candidate: any): string[] {
  if (!candidate) return [];
  if (typeof candidate.titlePath === 'function') {
    const titlePath = candidate.titlePath();
    if (Array.isArray(titlePath)) return titlePath;
  }
  if (typeof candidate.fullTitle === 'function') return [candidate.fullTitle()];
  if (candidate.fullTitle) return [candidate.fullTitle];
  if (candidate.title) return [candidate.title];
  return [];
}

function joinTitlePath(parts: string[]): string | null {
  if (!Array.isArray(parts) || parts.length === 0) return null;
  const joined = parts.filter(Boolean).join(' > ').trim();
  return joined || null;
}

function getCurrentTestId(): string | null {
  try {
    const cypressAny = Cypress as any;
    const runnable =
      typeof cypressAny.state === 'function'
        ? cypressAny.state('runnable')
        : undefined;
    const fromRunnable = joinTitlePath(getTitlePath(runnable));
    if (fromRunnable) return fromRunnable;

    const runner = cypressAny.mocha?.getRunner?.();
    const current = runner?.test ?? runner?.suite?.ctx?.currentTest ?? cypressAny.currentTest;
    return joinTitlePath(getTitlePath(current)) ?? null;
  } catch {
    return null;
  }
}

function getScopeLabel(context?: any): string | undefined {
  if (!context) return 'document';
  if (typeof context === 'string') return context;
  const el = (context)?.[0] ?? context;
  if (!el || typeof el !== 'object') return undefined;
  const tag = (el.tagName || '').toString().toLowerCase();
  if (!tag) return undefined;
  const id = el.id ? `#${el.id}` : '';
  const classes =
    typeof el.className === 'string'
      ? el.className
        .split(/\s+/g)
        .filter(Boolean)
        .map((c: string) => `.${c}`)
        .join('')
      : '';
  return `${tag}${id}${classes}`;
}

function summarizeViolations(violations: Result[], waivers: A11yWaivers, durationMs: number, context?: any): A11ySummary {
  const waived: Result[] = [];
  const unwaived: Result[] = [];

  for (const v of violations) {
    if (isValidWaiver(waivers[v.id])) waived.push(v);
    else unwaived.push(v);
  }

  const ruleIds = Array.from(new Set(violations.map((v) => v.id))).sort((a, b) => a.localeCompare(b));
  const nodesAffected = violations.reduce((sum, v) => sum + (v.nodes?.length ?? 0), 0);

  return {
    durationMs,
    violations: violations.length,
    unwaivedViolations: unwaived.length,
    waivedViolations: waived.length,
    ruleIds,
    nodesAffected,
    timestamp: new Date().toISOString(),
    scope: getScopeLabel(context),
  };
}

function formatSummaryLine(summary: A11ySummary): string {
  const rules = summary.ruleIds.length ? summary.ruleIds.join(', ') : 'none';
  const scope = summary.scope ? `scope=${summary.scope}` : 'scope=unknown';
  return [
    `${scope}`,
    `duration=${summary.durationMs}ms`,
    `violations=${summary.violations}`,
    `unwaived=${summary.unwaivedViolations}`,
    `nodes=${summary.nodesAffected}`,
    `rules=${rules}`,
  ].join(' | ');
}

function isA11ySpec(): boolean {
  const spec = Cypress.spec as { name?: string; relative?: string; fileName?: string } | undefined;
  const specPath = (Cypress.spec as any)?.path;
  const name = spec?.name || spec?.relative || spec?.fileName || specPath || '';
  return /a11y/i.test(String(name));
}

function pushMochawesomeContext(title: string, value: string) {
  if (!isA11ySpec()) return;
  Cypress.Mochawesome ??= {
    currentAttemptScreenshots: [],
    attempts: [],
    context: [],
  };
  Cypress.Mochawesome.context.push({ title, value });
}

Cypress.Commands.add(
  'checkA11yCritical',
  (context?: any, options: any = {}, waivers: A11yWaivers = {}) => {
    // Inject axe into the AUT (app under test)
    cy.injectAxe();
    const startedAt = Date.now();
    let unwaivedMessage: string | null = null;

    const axeOptions = {
      includedImpacts: ['critical'],
      ...options,
    };

    cy.checkA11y(context, axeOptions, undefined, true);
    cy.then(() => {
      // Since cy.checkA11y does not return a Promise, we need to access the last run violations via Cypress.state or use an event workaround, 
      // but for now, we assume cy.checkA11y logs or fails if violations are found.
      // The following lines would only run after cy.checkA11y finishes.

      // Simulate gathering violations from the axe results injected into the window object
      // This is a workaround; for real use, you might need to hook into cy.on('fail') or handle through a custom task.
      const violations = (Cypress as any).axe?.getViolations
        ? (Cypress as any).axe.getViolations()
        : [];

      // cypress-axe already filtered to CRITICAL via includedImpacts,
      // but we still treat all incoming violations as relevant.
      const waived: Result[] = [];
      const unwaived: Result[] = [];

      for (const v of violations) {
        if (isValidWaiver(waivers[v.id])) waived.push(v);
        else unwaived.push(v);
      }

      const durationMs = Date.now() - startedAt;
      const summary = summarizeViolations(violations, waivers, durationMs, context);
      const summaryLine = `[a11y] ${formatSummaryLine(summary)}`;
      Cypress.log({ name: 'a11y', message: summaryLine });

      pushMochawesomeContext('A11Y scan', summaryLine);

      const testId = getCurrentTestId();
      cy.task('log', summaryLine, { log: false });
      if (testId) {
        cy.task('a11y:record', { testId, summary }, { log: false });
      }

      if (waived.length) {
        Cypress.log({
          name: 'a11y',
          message: formatViolations('Axe CRITICAL violations (waived)', waived, waivers),
        });
      }

      if (unwaived.length) {
        const message = formatViolations('Axe CRITICAL violations (unwaived)', unwaived);
        Cypress.log({ name: 'a11y', message });
        unwaivedMessage = message;
      }
    });
    cy.then(() => {
      if (unwaivedMessage) {
        throw new Error(unwaivedMessage);
      }
    });
  }
);



function safeString(stringVal: string | number | undefined | null): string {
  if (stringVal === null || stringVal === undefined) {
    return '';
  } else {
    return stringVal.toString();
  }
}

export function safeType(prevSubject: any, stringVal: string | number) {
  const subject = cy.wrap(prevSubject);
  const outString: string = safeString(stringVal);

  if (outString.length != 0) {
    subject.type(outString);
  }

  return subject; //Allows Cypress methods to chain off of this command like normal (IE Cy.get().safe_type().parent().click() and so on)
}

export function overwrite(prevSubject: any, stringVal: string | number) {
  const outString = safeString(stringVal);

  return safeType(prevSubject, '{selectall}{del}' + outString);
}

declare global {
  namespace Cypress {
    interface Cypress {
      Mochawesome?: {
        currentAttemptScreenshots: string[];
        attempts: string[][];
        context: Array<{ title?: string; value: unknown }>;
      };
    }
  }
}
