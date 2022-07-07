// @ts-check

const interactionTree: object = {
  //Defines the structure of the Report Type radiobuttons and whether or not each button should be connected to the "State" dropdown and "Election On" date picker
  QUARTERLY: {
    'Election Year': {
      Q1: false,
      Q2: false,
      Q3: false,
      '12G': true,
      '30G': true,
      YE: false,
      '12P': true,
      '12R': true,
      '12S': true,
      '12C': true,
      '30R': true,
      '30S': true,
      TER: false,
    },
    'Non-Election Year': {
      MY: false,
      YE: false,
      '12P': true,
      '12R': true,
      '12S': true,
      '12C': true,
      '30R': true,
      '30S': true,
      TER: false,
    },
  },
  MONTHLY: {
    'Election Year': {
      M2: false,
      M3: false,
      M4: false,
      M5: false,
      M6: false,
      M7: false,
      M8: false,
      M9: false,
      M10: false,
      '12G': true,
      '30G': true,
      YE: false,
      TER: false,
    },
    'Non-Election Year': {
      M2: false,
      M3: false,
      M4: false,
      M5: false,
      M6: false,
      M7: false,
      M8: false,
      M9: false,
      M10: false,
      M11: false,
      M12: false,
      YE: false,
      TER: false,
    },
  },
};

describe('QA Test Scripts #257, 258, 260 & 261 (Sprint 7)', () => {
  const filingFrequencies: Array<string> = Object.keys(interactionTree);
  for (const filingFrequency of filingFrequencies) {
    context(`Testing interactivity under ${filingFrequency}`, () => {
      const timePeriods: Array<string> = Object.keys(interactionTree[filingFrequency]);
      for (const timePeriod of timePeriods) {
        context(`--->       ${timePeriod}`, () => {
          it('Step 1: Navigate to contacts page', () => {
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
            const reportTypes: Array<string> = Object.keys(interactionTree[filingFrequency][timePeriod]);
            for (const reportType of reportTypes) {
              cy.get('p-radiobutton[FormControlName="report_code"]')
                .contains(reportType)
                .parent()
                .click()
                .find('div')
                .should('have.class', 'p-radiobutton-checked');

              if (interactionTree[filingFrequency][timePeriod][reportType]) {
                cy.get("p-calendar[FormControlName='date_of_election']").should('exist');
                cy.get("p-dropdown[FormControlName='state_of_election']").should('exist');
              } else {
                cy.get("p-calendar[FormControlName='date_of_election']").should('not.exist');
                cy.get("p-dropdown[FormControlName='state_of_election']").should('not.exist');
              }
            }
          });
        });
      }
    });
  }
});
