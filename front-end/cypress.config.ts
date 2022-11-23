import { defineConfig } from 'cypress'

export default defineConfig({
  defaultCommandTimeout: 10000,
  projectId: 'x5egpz',
  videosFolder: 'cypress/videos',
  screenshotsFolder: 'cypress/screenshots',
  screenshotOnRunFailure: true,
  fixturesFolder: 'cypress/fixtures',
  trashAssetsBeforeRuns: false,
  videoUploadOnPasses: false,
  chromeWebSecurity: false,
  retries: {
    "runMode":2,
    "openMode":2,
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.ts')(on, config)
    },
    baseUrl: 'http://localhost:4200',
    experimentalSessionAndOrigin: true,
  },
})
