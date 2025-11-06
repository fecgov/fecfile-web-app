import { defineConfig } from 'cypress';
const browserstackPlugin = require('browserstack-cypress-cli/bin/testObservability/plugin');


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
    baseUrl: 'http://bs-local.com:4200',
    specPattern: 'cypress/nightly/**/*.cy.ts',
    setupNodeEvents(on, config) {
      browserstackPlugin(on, config);
      return config;
    },
  },
});
