import fs from 'node:fs';
import { defineConfig } from 'cypress';

export default defineConfig({
  defaultCommandTimeout: 10000,
  projectId: 'x5egpz',
  video: true,
  videosFolder: 'cypress/videos',
  screenshotsFolder: 'cypress/screenshots',
  screenshotOnRunFailure: true,
  fixturesFolder: 'cypress/fixtures',
  trashAssetsBeforeRuns: false,
  viewportHeight: 768,
  viewportWidth: 1366,
  chromeWebSecurity: false,
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/results',
    reportFilename: '[status]_[datetime]-[name]',
    overwrite: false,
    html: true,
    json: false,
  },
  retries: {
    runMode: 1,
    openMode: 0,
  },
  experimentalWebKitSupport: true,
  e2e: {
    baseUrl: 'http://localhost:4200',
    specPattern: ['cypress/e2e-smoke/**/*.cy.ts', 'cypress/e2e-extended/**/*.cy.ts'],
    setupNodeEvents(on) {
      on('after:spec', (_spec, results) => {
        if (!results?.video) {
          return;
        }

        const hasFailedAttempt = results.tests?.some((test) =>
          test.attempts?.some((attempt) => attempt.state === 'failed'),
        );

        if (hasFailedAttempt) {
          return;
        }

        try {
          fs.rmSync(results.video, { force: true });
        } catch {
          // Ignore cleanup failures to avoid masking test results.
        }
      });
    },
  },
});
