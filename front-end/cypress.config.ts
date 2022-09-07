import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: 'x5egpz',
  videosFolder: 'cypress/videos',
  screenshotsFolder: 'cypress/screenshots',
  fixturesFolder: 'cypress/fixtures',
  trashAssetsBeforeRuns: false,
  videoUploadOnPasses: false,
  chromeWebSecurity: false,
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
