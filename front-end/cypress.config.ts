import { defineConfig } from 'cypress';
import { lighthouse, prepareAudit } from '@cypress-audit/lighthouse';
import * as fs from 'fs';

export default defineConfig({
  defaultCommandTimeout: 10000,
  projectId: 'x5egpz',
  video: false,
  videosFolder: 'cypress/videos',
  screenshotsFolder: 'cypress/screenshots',
  screenshotOnRunFailure: false,
  fixturesFolder: 'cypress/fixtures',
  trashAssetsBeforeRuns: false,
  viewportHeight: 768,
  viewportWidth: 1366,
  videoUploadOnPasses: false,
  chromeWebSecurity: false,
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/results',
    reportFilename: '[status]_[datetime]-[name]',
    overwrite: false,
    html: true,
    json: false,
  },
  lighthouse: {
    options: ['--chrome-flags="--no-sandbox --headless --disable-gpu"'],
  },
  retries: {
    runMode: 1,
    openMode: 0,
  },
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser = {}, launchOptions) => {
        prepareAudit(launchOptions);
      });
      on('task', {
        lighthouse: lighthouse((lighthouseReport) => {
          console.log('---- Writing lighthouse report to disk ----');
          lighthouseReport.artifacts = undefined;
          fs.writeFile('lighthouse.html', lighthouseReport.report, (error: any) => {
            error ? console.log(error) : console.log('Report created successfully');
          });
        }),
      });
      return require('./cypress/plugins/index.ts')(on, config);
    },
    baseUrl: 'http://localhost:4200',
  },
});
