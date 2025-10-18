import { defineConfig } from "cypress";
import installLogsPrinter from "cypress-terminal-report/src/installLogsPrinter";
import cmrPlugin from "cypress-mochawesome-reporter/plugin";
import cypressSplit from "cypress-split";

export default defineConfig({
  projectId: "6um8hh",
  video: false,
  screenshotsFolder: "cypress/screenshots",
  screenshotOnRunFailure: true,
  fixturesFolder: "cypress/fixtures",
  trashAssetsBeforeRuns: false,
  chromeWebSecurity: false,
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
      // Reporter + split + terminal logs
      cmrPlugin(on);
      cypressSplit(on, config);
      installLogsPrinter(on, {
        printLogsToConsole: "onFail",
        printLogsToFile: "onFail",
        outputRoot: `${config.projectRoot}/logs`,
        specRoot: "cypress/e2e",
        outputTarget: {
          "cypress-logs|json": "json",
          "out.html": "html",
        },
      });

      // Cucumber preprocessor (feature files) with esbuild bundler
      const { addCucumberPreprocessorPlugin } =
        await import("@badeball/cypress-cucumber-preprocessor");
      const createBundler =
        (await import("@bahmutov/cypress-esbuild-preprocessor")).default;
      const { createEsbuildPlugin } =
        await import("@badeball/cypress-cucumber-preprocessor/esbuild");

      await addCucumberPreprocessorPlugin(on, config);

      // Tell the preprocessor where the shared step files live
      config.env = {
        ...config.env,
        stepDefinitions: "cypress/e2e/steps/**/*.ts",
      };

      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );
      return config;
    },

    // Support BOTH .feature and .cy.ts specs
    specPattern: ["cypress/e2e/features/**/*.feature", "cypress/e2e/**/*.cy.ts"],
    supportFile: 'cypress/support/e2e.ts',
    experimentalRunAllSpecs: true,
    experimentalPromptCommand: true,
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:4200",
    env: {
      API_ORIGIN: 'http://localhost:8080',
    },
    defaultCommandTimeout: 10_000,
    pageLoadTimeout: 120_000,
    retries: { runMode: 2, openMode: 0 }, // overrides top-level
    viewportHeight: 768,
    viewportWidth: 1366,
  },
});