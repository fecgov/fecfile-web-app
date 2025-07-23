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
  e2e: {
    baseUrl: 'http://localhost:4200',
  },
});
