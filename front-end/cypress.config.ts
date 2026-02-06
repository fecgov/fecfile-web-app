/// <reference types="node" />
import { defineConfig } from 'cypress';
import { setupA11yNodeEvents } from './cypress.a11y';
import { CypressConfigHelper } from './cypress/cypress.config.helpers.ts';

const videoSetting = CypressConfigHelper.resolveCypressVideo(process.env.CYPRESS_VIDEO);

export default defineConfig({
  env: {
    ...CypressConfigHelper.failOn5xxDefaults,
  },
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
  reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
    charts: true,
    reportPageTitle: `FECFile+ E2E Test Report`,
    reportFilename: '[status]_[datetime]-[name]',
    reportDir: 'cypress/results',
    embeddedScreenshots: true,
    inlineAssets: true,
    videoOnFailOnly: true,
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
      setupA11yNodeEvents(on);
      // @ts-ignore - cypress-mochawesome-reporter/plugin is not typed
      require('cypress-mochawesome-reporter/plugin')(on);
      CypressConfigHelper.deleteVideoOnSuccess(on);
      return config;
    },
  },
});
