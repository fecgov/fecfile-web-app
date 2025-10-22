import { defineConfig } from 'cypress';

export default defineConfig({
  defaultCommandTimeout: 10000,
  projectId: '6um8hh',
  experimentalWebKitSupport: true,
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
  e2e: {
    baseUrl: 'http://localhost:4200',
    specPattern: ['cypress/e2e/**/*.cy.ts', 'cypress/nightly/**/*.cy.ts'],
    experimentalRunAllSpecs: true,
    experimentalPromptCommand: true,
  },
});