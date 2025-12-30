import { defineConfig } from 'cypress';
import { setupA11yNodeEvents } from './cypress.a11y';

export default defineConfig({
  defaultCommandTimeout: 10000,
  projectId: 'x5egpz',
  video: false,
  videosFolder: 'cypress/videos',
  screenshotsFolder: 'cypress/screenshots',
  screenshotOnRunFailure: true,
  fixturesFolder: 'cypress/fixtures',
  trashAssetsBeforeRuns: false,
  viewportHeight: 768,
  viewportWidth: 1366,
  chromeWebSecurity: false,
  reporter: 'cypress-mochawesome-reporter',
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
    setupNodeEvents(on, config) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('cypress-mochawesome-reporter/plugin')(on);
      setupA11yNodeEvents(on);
      return config;
    },
  },
});
