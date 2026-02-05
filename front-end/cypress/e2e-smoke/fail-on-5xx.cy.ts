type FailOn5xxFailure = {
  timestamp: string;
  method: string;
  url: string;
  statusCode: number;
  resourceType?: string;
  correlationHeaders?: Record<string, string>;
};

type FailOn5xxArtifact = {
  spec: string;
  test: string;
  attempt: number;
  failures: FailOn5xxFailure[];
};

const SELF_TEST_ARTIFACT_DIR = 'cypress/results/if-5xx/_self-test';

// Use a URL that matches your default watch patterns (transactions + api).
const SENTINEL_PATH = '/api/transactions/__if5xx_self_test';
const SENTINEL_GLOB = `**${SENTINEL_PATH}`;
const REQUEST_ID = 'if5xx-self-test-req-123';

// A tiny page we control so we don’t depend on app auth/state and don’t create extra API noise.
const SELF_TEST_PAGE = '/__if5xx-self-test';

// Captured from the tripwire error message on the *failed attempt*.
let capturedArtifactPath = '';

function extractArtifactPathFromFailError(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);

  if (!message.includes('Backend 5xx detected')) return '';

  const line = message
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l.startsWith('Artifact:'));

  if (!line) return '';

  return line.replace(/^Artifact:\s*/, '').trim();
}

// IMPORTANT: sets the artifact dir override at spec-eval time,
// before any hooks run, so the support-level beforeEach reads it
const originalArtifactDir = Cypress.env('failOn5xxArtifactDir');
Cypress.env('failOn5xxArtifactDir', SELF_TEST_ARTIFACT_DIR);

describe('failOn5xx tripwire: nightly self-test', () => {
  after(() => {
    // restores support-level environment variable value for the retry and the next test
    Cypress.env('failOn5xxArtifactDir', originalArtifactDir);
  });

  it(
    'fails once on a watched 5xx (so Cypress captures failure screenshot), then passes on retry',
    { retries: 1 },
    function () {
      expect(Cypress.env('failOn5xx'), 'failOn5xx should be enabled').to.eq(true);

      const currentTest = this.currentTest as
        | (Mocha.Runnable & { currentRetry?: () => number })
        | undefined;
      const runnable = (Cypress as unknown as { state?: (key: string) => unknown }).state?.(
        'runnable'
      ) as
        | (Mocha.Runnable & { currentRetry?: () => number })
        | undefined;
      const retry =
        (typeof runnable?.currentRetry === 'function'
          ? runnable.currentRetry()
          : currentTest?.currentRetry?.()) ?? 0;

      // we want the path to persist into the retry and the next test
      if (retry === 0) capturedArtifactPath = '';

      // binds to the per-test fail event *only to capture the artifact path*,
      // but rethrows so that:
      // - the test still fails
      // - Cypress still takes the automatic failure screenshot
      // - retries still happen
      // both `Cypress` and `cy` are event emitters; events bound to `cy` are removed after the test ends
      cy.on('fail', (err) => {
        const maybePath = extractArtifactPathFromFailError(err);
        if (maybePath) capturedArtifactPath = maybePath;

        throw err; // keep the failure behavior, screenshot, and retry
      });

      // serves a wee page (very mindful, very demure)
      cy.intercept('GET', SELF_TEST_PAGE, {
        statusCode: 200,
        headers: { 'content-type': 'text/html; charset=utf-8' },
        body: '<!doctype html><html><body><h1>if-5xx self-test</h1></body></html>',
      });

      // attempt 1 => 500 (tripwire should fail the test)
      // retry attempt => 200 (test should pass, but'd still show the tripwire failure if a 2nd attempt 5xx happened)
      const statusCode = retry === 0 ? 500 : 200;

      cy.intercept('GET', SENTINEL_GLOB, {
        statusCode,
        headers: { 'x-request-id': REQUEST_ID },
        body: { ok: statusCode < 500, retry },
      }).as('sentinel');

      cy.visit(SELF_TEST_PAGE);

      cy.window().then((win) => win.fetch(SENTINEL_PATH));

      // this assertion passes both attempts (500 then 200)
      cy.wait('@sentinel').its('response.statusCode').should('eq', statusCode);
    }
  );

  it('writes a JSON artifact for the failed attempt (cypress/results/is-5xx/_self-test dir) with sentinel details', () => {
    expect(capturedArtifactPath, 'captured artifact path from failed attempt')
      .to.be.a('string')
      .and.not.be.empty;

    expect(
      capturedArtifactPath,
      'self-test artifact should be written under the _self-test dir'
    ).to.include(`${SELF_TEST_ARTIFACT_DIR}/`);

    cy.readFile(capturedArtifactPath, { timeout: 10_000 }).then((raw) => {
      const artifact = raw as FailOn5xxArtifact;

      expect(artifact).to.have.property('failures');
      expect(artifact.failures).to.be.an('array').and.have.length(1);

      const f = artifact.failures[0];

      // so it shows up in the HTML report
      cy.addTestContext({
        title: 'FailOn5xx artifact',
        value: {
          path: capturedArtifactPath,
          attempt: artifact.attempt,
          statusCode: f?.statusCode,
          method: f?.method,
          url: f?.url,
          correlationHeaders: f?.correlationHeaders,
          timestamp: f?.timestamp,
        },
      });

      expect(f.statusCode).to.eq(500);
      expect(f.method).to.eq('GET');
      expect(f.url).to.include(SENTINEL_PATH);

      // correlation header should be captured
      expect(f.correlationHeaders).to.have.property('x-request-id', REQUEST_ID);
    });
  });
});
