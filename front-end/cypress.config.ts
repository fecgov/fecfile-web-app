/// <reference types="node" />
import { defineConfig } from "cypress";
import installLogsPrinter from "cypress-terminal-report/src/installLogsPrinter";
import cmrPlugin from "cypress-mochawesome-reporter/plugin";
import cypressSplit from "cypress-split";

type BsObsFn = (
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions
) => void;

const useBrowserStack =
  process.env.BROWSERSTACK === "1" ||
  !!process.env.BROWSERSTACK_USERNAME ||
  process.env.BROWSERSTACK_OBSERVABILITY === "1";

export default defineConfig({
  projectId: "x5egpz",
  video: false,
  screenshotsFolder: "cypress/screenshots",
  screenshotOnRunFailure: true,
  fixturesFolder: "cypress/fixtures",
  trashAssetsBeforeRuns: false,
  chromeWebSecurity: false,

  // WebKit (Safari engine) is experimental; requires `playwright-webkit` installed.
  experimentalWebKitSupport: true,

  // Top-level retries (e2e overrides below)
  retries: { runMode: 1, openMode: 0 },

  // Pretty HTML + JSON reports
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    reportDir: "cypress/results",
    reportFilename: "[status]_[datetime]-[name]",
    overwrite: false,
    html: true,
    json: true,
  },

  e2e: {
    async setupNodeEvents(on, config) {
      // 1) Mochawesome reporter plugin
      cmrPlugin(on);
      cypressSplit(on, config);
      // 2) cypress-terminal-report: print to console + write artifacts
      installLogsPrinter(on, {
        printLogsToConsole: "onFail",   // 'always' | 'onFail' | 'never'
        printLogsToFile: "onFail",
        outputRoot: `${config.projectRoot}/logs`,
        specRoot: "cypress/e2e",
        outputTarget: {
          "cypress-logs|json": "json",  // per-spec JSON files
          "out.html": "html",           // one HTML summary
        },
      });

      // 3) BrowserStack Test Observability (only when enabled)
      if (useBrowserStack) {
        try {
          const mod = await import(
            "browserstack-cypress-cli/bin/testObservability/plugin"
          );
          const bsObs: BsObsFn =
            ((mod as unknown as { default?: BsObsFn }).default ||
              (mod as unknown as BsObsFn)) as BsObsFn;
          bsObs(on, config);
        } catch (err) {
          console.warn(
            "[BS Observability] plugin not found or failed to load. Skipping.",
            err
          );
        }
      }

      return config;
    },

    specPattern: "cypress/e2e/**/*.cy.ts",
    baseUrl: process.env.CYPRESS_BASE_URL,
    defaultCommandTimeout: 10_000,
    pageLoadTimeout: 120_000,
    retries: { runMode: 2, openMode: 0 }, // overrides top-level
    viewportHeight: 768,
    viewportWidth: 1366,
  },

  component: {
    devServer: { framework: "angular", bundler: "webpack" },
    specPattern: "cypress/component/**/*.cy.ts",
    setupNodeEvents(on, config) {
      cmrPlugin(on);
      installLogsPrinter(on, {
        printLogsToConsole: "onFail",
        outputRoot: `${config.projectRoot}/logs`,
        specRoot: "cypress/component",
        outputTarget: {
          "component-logs|json": "json",
          "component.html": "html",
        },
      });
      return config;
    },
  },
});
