/// <reference types="node" />
import { defineConfig } from 'cypress';
import fs from 'node:fs';
import { CypressConfigHelper } from './cypress/cypress.config.helpers.ts'

const videoSetting = CypressConfigHelper.resolveCypressVideo(process.env.CYPRESS_VIDEO);

export default defineConfig({
  defaultCommandTimeout: 10000,
  projectId: 'x5egpz',
  video: videoSetting,
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
      CypressConfigHelper.deleteVideoOnSuccess(on);
    },
  },
});
