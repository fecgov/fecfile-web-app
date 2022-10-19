import { defineConfig } from 'cypress'
import { lighthouse, prepareAudit } from '@cypress-audit/lighthouse'
import * as fs from 'fs';

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
      on("before:browser:launch", (browser = {}, launchOptions) => {
        prepareAudit(launchOptions);
      });
      on("task", {
        lighthouse: lighthouse((lighthouseReport) => {
          console.log("---- Writing lighthouse report to disk ----");
          lighthouseReport.artifacts = undefined;
          fs.writeFile("lighthouse.html", lighthouseReport.report, (error: any) => {
            error ? console.log(error) : console.log("Report created successfully");
          });
        }),
      });
      return require('./cypress/plugins/index.ts')(on, config)
    },
    baseUrl: 'http://localhost:4200',
    experimentalSessionAndOrigin: true,
  },
})
