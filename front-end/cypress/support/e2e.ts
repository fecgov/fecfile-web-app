// front-end/cypress/support/e2e.ts
/// <reference types="cypress" />
/// <reference types="cypress-mochawesome-reporter" />
/// <reference types="cypress-terminal-report" />
/// <reference types="@badeball/cypress-cucumber-preprocessor" />
/// <reference types="@testing-library/cypress" />

import "@testing-library/cypress/add-commands";
import "cypress-mochawesome-reporter/register";
import installLogsCollector from "cypress-terminal-report/src/installLogsCollector";
import "./commands";


installLogsCollector({
  collectTypes: [
    "cons:log","cons:info","cons:warn","cons:error",
    "cy:command","cy:intercept","cy:xhr","cy:request","cy:log",
  ],
  xhr: { printBody: true, printHeaderData: false, printRequestData: false },
});

// Attach terminal logs to the Mochawesome report for each finished test
afterEach(function () {
  const getLogs =
    (globalThis as any)?.Cypress?.TerminalReport?.getLogs as
      | ((fmt?: "txt" | "json" | "html") => string | null)
      | undefined;

  const logs = getLogs?.("txt") ?? null;
  if (!logs) return;

  // Dynamically import to avoid type requirements
  // (no cy.* commands here—test already ended)
  import("mochawesome/addContext")
    .then(({ default: addContext }: any) => {
      addContext({ test: this.currentTest }, { title: "Terminal logs", value: logs });
    })
    .catch(() => {
      // If addContext isn't available, just skip
    });
});
