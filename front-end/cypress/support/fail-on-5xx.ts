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

  for (const [k, v] of Object.entries(headers)) {
    if (v == null) continue;
    out[k.toLowerCase()] = Array.isArray(v) ? v.map(String).join(',') : String(v);
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

export function registerFailOn5xx(): void {
  if (registered) return;
  registered = true;

  let seen: Backend5xxEvent[] = [];

  beforeEach(() => {
    const cfg = getCfg();
    seen = [];

    if (!cfg.enabled) return;

    registerBackendObserver(cfg, seen);
  });

  afterEach(function () {
    const cfg = getCfg();
    if (!cfg.enabled || !seen.length) return;

    const spec = getSpecName();

    const testTitle =
      this.currentTest?.fullTitle?.() ?? this.currentTest?.title ?? 'unknown-test';

    const currentTest = this.currentTest as
      | (Mocha.Runnable & { currentRetry?: () => number })
      | undefined;

    const attempt =
      (typeof currentTest?.currentRetry === 'function' ? currentTest.currentRetry() : 0) + 1;

    const ts = new Date().toISOString().replaceAll(/[:.]/g, '-');

    const artifactPath = [
      cfg.artifactDir,
      sanitizePathPart(spec),
      `${ts}--${sanitizePathPart(testTitle)}--attempt-${attempt}.json`,
    ].join('/');

    const artifact = {
      spec,
      test: testTitle,
      attempt,
      failures: seen,
    };

    cy.writeFile(artifactPath, artifact, { log: false }).then(() => {
      // Don’t override a “real” test failure.
      if (this.currentTest?.state !== 'passed') return;

      const lines = [
        `Backend 5xx detected (${seen.length}).`,
        `Artifact: ${artifactPath}`,
        '',
        ...seen.map((f) => {
          const corr = f.correlationHeaders ? ` corr=${JSON.stringify(f.correlationHeaders)}` : '';
          return `- ${f.statusCode} ${f.method} ${f.url} @ ${f.timestamp}${corr}`;
        }),
      ];

      throw new Error(lines.join('\n'));
    });
  });
}
