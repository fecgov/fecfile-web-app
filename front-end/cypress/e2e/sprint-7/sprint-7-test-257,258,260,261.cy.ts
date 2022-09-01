// @ts-check

import { FilingFrequency, filingFrequencyTree, FilingType } from "../../support/reports.spec"

function testRadioButtons(filingFrequency: "MONTHLY" | "QUARTERLY", timePeriod: "Election Year" | "Non-Election Year") {
  const reportTypes: Array<string> = Object.keys(filingFrequencyTree[filingFrequency][timePeriod]);
  for (const reportType of reportTypes) {
    cy.get('p-radiobutton[FormControlName="report_code"]')
      .contains(reportType)
      .parent()
      .click()
      .find('div')
      .should('have.class', 'p-radiobutton-checked');

    if (filingFrequencyTree[filingFrequency][timePeriod][reportType]) {
      cy.get("p-calendar[FormControlName='date_of_election']").should('exist');
      cy.get("p-dropdown[FormControlName='state_of_election']").should('exist');
    } else {
      cy.get("p-calendar[FormControlName='date_of_election']").should('not.exist');
      cy.get("p-dropdown[FormControlName='state_of_election']").should('not.exist');
    }
  }
}

describe('QA Test Scripts #257, 258, 260 & 261 (Sprint 7)', () => {
  const filingFrequencies = ["QUARTERLY","MONTHLY"];
  for (const filingFrequency of filingFrequencies) {
    context(`Testing interactivity under ${filingFrequency}`, () => {
      const timePeriods: Array<string> = Object.keys(filingFrequencyTree[filingFrequency as FilingFrequency]);
      for (const timePeriod of timePeriods) {
        context(`--->       ${timePeriod}`, () => {
          it('Step 1: Navigate to reports page', () => {
            cy.visit('/dashboard');
            cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
          });

          it('Step 2: Open a New Report', () => {
            cy.get("button[label='Create a new report']").click();
            cy.shortWait();
          });

          it(`Step 3: Select the Filing Frequency ${filingFrequency}`, () => {
            cy.get('p-radiobutton[FormControlName="filing_frequency"]')
              .contains(filingFrequency)
              .parent()
              .click()
              .find('div')
              .should('have.class', 'p-radiobutton-checked')
              .wait(50);
          });

          it(`Step 4: Select the Time Period button for ${timePeriod}`, () => {
            cy.get('div[role="button"]')
              .contains(timePeriod)
              .click()
              .parent()
              .should('have.class', 'p-highlight')
              .wait(50);
          });

          it(`Step 5: Check each Report Type radio button for interactivity and the presence of the "State" dropdown and the "Election On" date picker`, () => {
            testRadioButtons(filingFrequency as FilingFrequency, timePeriod as FilingType);
          });
        });
      }
    });
  }
});
