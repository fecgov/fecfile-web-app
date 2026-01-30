type Backend5xxEvent = {
  timestamp: string; // ISO timestamp
  method: string;
  url: string;
  statusCode: number;
  resourceType?: string;

  correlationHeaders?: Record<string, string>;
};

type FailOn5xxConfig = {
  enabled: boolean;
  watch: string[];
  ignore: string[];
  artifactDir: string;
};

type InterceptedResponse = {
  statusCode?: number;
  headers?: Record<string, unknown>;
};

type InterceptedRequest = {
  url: string;
  method: string;
  headers?: Record<string, unknown>;
  on: (event: 'response', cb: (res: InterceptedResponse) => void) => void;
};

// This types the intercepted request to include resourceType
type InterceptedRequestWithResourceType = InterceptedRequest & {
  resourceType?: string;
};

type RunnableWithRetry = Mocha.Runnable & { currentRetry?: () => number; type?: string };

type RunnableWithIf5xxState = RunnableWithRetry & {
  __if5xxWrapped?: boolean;
  __if5xxArtifactAttempt?: number;
  __if5xxArtifactPath?: string;
};

type ArtifactPayload = {
  spec: string;
  test: string;
  attempt: number;
  failures: Backend5xxEvent[];
};

type CypressWithState = {
  state?: (key: string) => unknown;
};

const CORRELATION_HEADER_KEYS = [
  'x-request-id',
  'x-correlation-id',
  'traceparent',
  'tracestate',
  'x-amzn-trace-id',
];

// Fallbacks (you should still set defaults in cypress.config.ts,
// but these prevent "watch everything" if config ever changes/misloads)
const DEFAULT_WATCH = ['**/transactions/**', '**/api/**'];
const DEFAULT_IGNORE: string[] = [];
const DEFAULT_ARTIFACT_DIR = 'cypress/results/if-5xx';
const ALLOW_5XX_TAG = '@allow-5xx';

let registered = false;

function envBool(name: string, fallback: boolean): boolean {
  const v = Cypress.env(name);

  if (v == null) return fallback;
  if (typeof v === 'boolean') return v;

  const s = String(v).trim().toLowerCase();
  if (['1', 'true', 'yes', 'y', 'on'].includes(s)) return true;
  if (['0', 'false', 'no', 'n', 'off'].includes(s)) return false;

  return fallback;
}

function envString(name: string, fallback: string): string {
  const v = Cypress.env(name);
  if (v == null) return fallback;

  const s = String(v).trim();
  return s || fallback;
}

// Supports multiple ways to set the environment variable:
// - (default) array from config: ['**/api/**', '**/transactions/**']
// - CSV from CLI: "**/api/**,**/transactions/**"
// - JSON array string from CI: '["**/api/**","**/transactions/**"]'
// - single string: "**/api/**"
function envStringList(name: string, fallback: string[]): string[] {
  const v = Cypress.env(name);
  if (v == null) return fallback;

  if (Array.isArray(v)) {
    const cleaned = v.map(String).map((x) => x.trim()).filter(Boolean);
    return cleaned.length ? cleaned : fallback;
  }

  const s = String(v).trim();
  if (!s) return fallback;

  // JSON array string
  if (s.startsWith('[')) {
    try {
      const parsed = JSON.parse(s) as unknown;
      if (Array.isArray(parsed)) {
        const cleaned = parsed.map(String).map((x) => x.trim()).filter(Boolean);
        return cleaned.length ? cleaned : fallback;
      }
    } catch {
      // fall through to CSV parsing
    }
  }

  // CSV OR single glob
  const cleaned = s.split(',').map((x) => x.trim()).filter(Boolean);
  return cleaned.length ? cleaned : fallback;
}

function sanitizePathPart(s: string): string {
  const safe = s.replaceAll(/[^\w.-]+/g, '_');
  let start = 0;
  let end = safe.length;

  while (start < end && safe[start] === '_') start += 1;
  while (end > start && safe[end - 1] === '_') end -= 1;

  return safe.slice(start, end).slice(0, 140);
}

function matchesAny(url: string, patterns: string[]): boolean {
  return patterns.some((p) => Cypress.minimatch(url, p, { matchBase: true }));
}

function normalizeHeaders(
  headers: Record<string, unknown> | undefined
): Record<string, string> {
  const out: Record<string, string> = {};
  if (!headers) return out;

  const toHeaderValue = (value: unknown): string => {
    if (Array.isArray(value)) return value.map(String).join(',');
    if (value == null) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
      return String(value);
    }
    try {
      return JSON.stringify(value);
    } catch {
      return '[unserializable]';
    }
  };

  for (const [k, v] of Object.entries(headers)) {
    if (v == null) continue;
    out[k.toLowerCase()] = toHeaderValue(v);
  }

  return out;
}

function pickCorrelationHeaders(
  resHeaders: Record<string, unknown> | undefined,
  reqHeaders: Record<string, unknown> | undefined
): Record<string, string> | undefined {
  const res = normalizeHeaders(resHeaders);
  const req = normalizeHeaders(reqHeaders);

  const out: Record<string, string> = {};
  for (const key of CORRELATION_HEADER_KEYS) {
    const v = res[key] ?? req[key];
    if (v) out[key] = v;
  }

  return Object.keys(out).length ? out : undefined;
}

function getCfg(): FailOn5xxConfig {
  return {
    enabled: envBool('failOn5xx', false),
    watch: envStringList('failOn5xxWatch', DEFAULT_WATCH),
    ignore: envStringList('failOn5xxIgnore', DEFAULT_IGNORE),
    artifactDir: envString('failOn5xxArtifactDir', DEFAULT_ARTIFACT_DIR),
  };
}

function shouldTrackRequest(
  req: InterceptedRequest,
  resourceType: string | undefined,
  cfg: FailOn5xxConfig
): boolean {
  if (resourceType !== 'xhr' && resourceType !== 'fetch') return false;
  if (cfg.watch.length && !matchesAny(req.url, cfg.watch)) return false;
  if (cfg.ignore.length && matchesAny(req.url, cfg.ignore)) return false;
  return true;
}

function recordBackend5xx(
  req: InterceptedRequest,
  res: InterceptedResponse | undefined,
  resourceType: string | undefined,
  seen: Backend5xxEvent[]
): void {
  const status = res?.statusCode;
  if (typeof status !== 'number' || status < 500 || status > 599) return;

  const evt: Backend5xxEvent = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    statusCode: status,
    resourceType,
    correlationHeaders: pickCorrelationHeaders(res?.headers, req.headers),
  };

  seen.push(evt);

  Cypress.log({
    name: 'backend 5xx',
    message: `${status} ${req.method} ${req.url}`,
    consoleProps: () => evt,
  });
}

function getSpecName(): string {
  // Cypress.spec is present at runtime; typings can vary by version.
  // This avoids `(Cypress as any)` while still preferring `relative` if available.
  const spec = Cypress.spec as unknown;

  if (spec && typeof spec === 'object') {
    const maybe = spec as { relative?: unknown; name?: unknown };
    if (typeof maybe.relative === 'string' && maybe.relative) return maybe.relative;
    if (typeof maybe.name === 'string' && maybe.name) return maybe.name;
  }

  return 'unknown-spec';
}

function isAllowlistedTest(title: string): boolean {
  return title.includes(ALLOW_5XX_TAG);
}

function registerBackendObserver(cfg: FailOn5xxConfig, seen: Backend5xxEvent[]): void {
  // Global observer intercept (does not stub anything)
  // middleware:true ensures this runs early in the intercept chain.
  cy.intercept({ url: '**', middleware: true }, (req: InterceptedRequestWithResourceType) => {
    const rt = req.resourceType;
    if (!shouldTrackRequest(req, rt, cfg)) return;

    req.on('response', (res) => {
      recordBackend5xx(req, res, rt, seen);
    });

    // IMPORTANT:
    // We do NOT call req.continue() / req.reply() here.
    // That keeps this intercept as a passive observer and avoids
    // interfering with test-level intercepts/stubs.
  });
}

function getStateRunnable(): RunnableWithRetry | undefined {
  // Cypress.state exists at runtime but isn't always in the type defs.
  const stateFn = (Cypress as unknown as CypressWithState).state;
  if (typeof stateFn !== 'function') return undefined;
  return stateFn('runnable') as RunnableWithRetry | undefined;
}

function getAttemptNumber(test: RunnableWithRetry | undefined): number {
  const stateRunnable = getStateRunnable();

  // In Cypress command chains, Cypress.state('runnable') is reliably the *test*.
  // In Mocha hooks it’s often the hook runnable, so only trust it for type === 'test'.
  if (stateRunnable?.type === 'test' && typeof stateRunnable.currentRetry === 'function') {
    return stateRunnable.currentRetry() + 1;
  }

  if (typeof test?.currentRetry === 'function') {
    return test.currentRetry() + 1;
  }

  return 1;
}

function buildArtifactPath(
  cfg: FailOn5xxConfig,
  spec: string,
  testTitle: string,
  attempt: number
): string {
  const ts = new Date().toISOString().replaceAll(/[:.]/g, '-');
  return [
    cfg.artifactDir,
    sanitizePathPart(spec),
    `${ts}--${sanitizePathPart(testTitle)}--attempt-${attempt}.json`,
  ].join('/');
}

function buildTripwireError(failures: Backend5xxEvent[], artifactPath: string): string {
  const lines = [
    `Backend 5xx detected (${failures.length}).`,
    `Artifact: ${artifactPath}`,
    '',
    ...failures.map((f) => {
      const corr = f.correlationHeaders ? ` corr=${JSON.stringify(f.correlationHeaders)}` : '';
      return `- ${f.statusCode} ${f.method} ${f.url} @ ${f.timestamp}${corr}`;
    }),
  ];

  return lines.join('\n');
}

function getTestTitle(currentTest: RunnableWithIf5xxState | undefined): string {
  return currentTest?.fullTitle?.() ?? currentTest?.title ?? 'unknown-test';
}

function buildArtifactPayload(
  spec: string,
  testTitle: string,
  attempt: number,
  failures: Backend5xxEvent[]
): ArtifactPayload {
  return {
    spec,
    test: testTitle,
    attempt,
    failures,
  };
}

function updateArtifactMetadata(
  currentTest: RunnableWithIf5xxState | undefined,
  attempt: number,
  artifactPath: string
): void {
  if (!currentTest) return;
  currentTest.__if5xxArtifactAttempt = attempt;
  currentTest.__if5xxArtifactPath = artifactPath;
}

function resetAttemptMetadata(currentTest: RunnableWithIf5xxState | undefined): void {
  if (!currentTest) return;
  currentTest.__if5xxArtifactAttempt = undefined;
  currentTest.__if5xxArtifactPath = undefined;
}

function finalizeTripwire(
  currentTest: RunnableWithIf5xxState,
  attempt: number,
  artifactPath: string,
  failures: Backend5xxEvent[],
  allow5xx: boolean
): void {
  updateArtifactMetadata(currentTest, attempt, artifactPath);

  if (allow5xx) return;

  // FAIL HERE (in the test body), so only this `it` fails and Cypress continues
  throw new Error(buildTripwireError(failures, artifactPath));
}

function afterTestTripwire(
  currentTest: RunnableWithIf5xxState,
  failures: Backend5xxEvent[]
): Cypress.Chainable | void {
  const cfgNow = getCfg();
  if (!cfgNow.enabled || !failures.length) return;

  const spec = getSpecName();
  const testTitle = getTestTitle(currentTest);
  const allow5xx = isAllowlistedTest(testTitle);
  const attempt = getAttemptNumber(currentTest);

  const artifactPath = buildArtifactPath(cfgNow, spec, testTitle, attempt);
  const artifact = buildArtifactPayload(spec, testTitle, attempt, failures);

  return cy
    .writeFile(artifactPath, artifact, { log: false })
    .then(finalizeTripwire.bind(null, currentTest, attempt, artifactPath, failures, allow5xx));
}

function enqueueAfterTestTripwire(
  currentTest: RunnableWithIf5xxState,
  failures: Backend5xxEvent[]
): void {
  // Run after all test commands have completed.
  // If the test failed earlier, Cypress will not execute this.
  cy.then(afterTestTripwire.bind(null, currentTest, failures));
}

function createWrappedTestFn(
  originalFn: (...args: unknown[]) => unknown,
  currentTest: RunnableWithIf5xxState,
  failures: Backend5xxEvent[]
): (this: Mocha.Context, ...args: unknown[]) => unknown {
  return function (this: Mocha.Context, ...args: unknown[]) {
    const result = originalFn.apply(this, args);

    enqueueAfterTestTripwire(currentTest, failures);

    return result;
  };
}

function wrapTestFnIfNeeded(
  currentTest: RunnableWithIf5xxState | undefined,
  failures: Backend5xxEvent[]
): void {
  if (!currentTest || currentTest.__if5xxWrapped || typeof currentTest.fn !== 'function') return;

  currentTest.__if5xxWrapped = true;

  const originalFn = currentTest.fn as unknown as (...args: unknown[]) => unknown;
  currentTest.fn = createWrappedTestFn(originalFn, currentTest, failures);
}

export function registerFailOn5xx(): void {
  if (registered) return;
  registered = true;

  const seen: Backend5xxEvent[] = [];

  beforeEach(function () {
    const cfg = getCfg();
    seen.length = 0;
    const currentTest = this.currentTest as RunnableWithIf5xxState | undefined;
    resetAttemptMetadata(currentTest);

    if (!cfg.enabled) return;

    wrapTestFnIfNeeded(currentTest, seen);
    registerBackendObserver(cfg, seen);
  });

  afterEach(function () {
    const cfg = getCfg();
    if (!cfg.enabled || !seen.length) return;

    const spec = getSpecName();
    const currentTest = this.currentTest as RunnableWithIf5xxState | undefined;
    const testTitle = getTestTitle(currentTest);
    const attempt = getAttemptNumber(currentTest);

    if (currentTest?.__if5xxArtifactAttempt === attempt) return;

    const artifactPath = buildArtifactPath(cfg, spec, testTitle, attempt);
    const artifact = buildArtifactPayload(spec, testTitle, attempt, seen);

    cy.writeFile(artifactPath, artifact, { log: false }).then(
      updateArtifactMetadata.bind(null, currentTest, attempt, artifactPath)
    );
  });
}
