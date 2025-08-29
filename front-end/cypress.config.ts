
/// <reference types="node" />
import { defineConfig } from 'cypress';

type BsObsFn = (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => void;

export default defineConfig({
  projectId: 'x5egpz',
  video: false,
  videosFolder: 'cypress/videos',
  screenshotsFolder: 'cypress/screenshots',
  screenshotOnRunFailure: true,
  fixturesFolder: 'cypress/fixtures',
  trashAssetsBeforeRuns: false,
  chromeWebSecurity: false,
  experimentalWebKitSupport: true,
  retries: { runMode: 1, openMode: 0 },

  e2e: {
   async setupNodeEvents(on, config) {
      const mod = await import('browserstack-cypress-cli/bin/testObservability/plugin');
      const bsObs: BsObsFn =
        // Handle both CJS and ESM default interop
        ((mod as unknown as { default?: BsObsFn }).default || (mod as unknown as BsObsFn)) as BsObsFn;
      
      bsObs(on, config);
      return config;
    },

    specPattern: 'cypress/e2e/**/*.cy.ts',
    
    baseUrl: process.env.BASE_URL || 'http://localhost:4200',
    defaultCommandTimeout: 10_000,
    viewportHeight: 768,
    viewportWidth: 1366,
  },
});
