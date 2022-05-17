// @ts-check

import { RandomDate, DateToString, GenerateReportObject, EnterReport } from '../support/reports.spec';

const InteractionTree: object = {
  //Defines the structure of the Report Type radiobuttons and whether or not each button should be connected to the "State" dropdown and "Election On" date picker
  QUARTERLY: {
    'Election Year': {
      Q1: false,
      Q2: false,
      Q3: false,
      '12G': true,
      '30G': true,
      YE: false,
      TER: false,
    },
    'Non-Election Year': {
      Q1: false,
      MY: false,
      Q2: false,
      YE: false,
      TER: false,
    },
    Special: {
      '12P': true,
      '12R': true,
      '12C': true,
      '12S': true,
      '30R': true,
      '30S': true,
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
  const FilingFrequencies: Array<string> = Object.keys(InteractionTree);
  for (let i: number = 0; i < FilingFrequencies.length; i++) {
    let FilingFrequency: string = FilingFrequencies[i];

    context(`Testing interactivity under ${FilingFrequency}`, () => {
      let TimePeriods: Array<string> = Object.keys(InteractionTree[FilingFrequency]);
      for (let j: number = 0; j < TimePeriods.length; j++) {
        let TimePeriod: string = TimePeriods[j];
        context(`--->       ${TimePeriod}`, () => {
          it('Step 1: Navigate to contacts page', () => {
            cy.visit('/dashboard');
            cy.url().should('contain', '/dashboard');
            cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
            cy.url().should('contain', '/reports');
          });

          it('Step 2: Open a New Report', () => {
            cy.get("button[label='Create a new report']").click();
            cy.wait(50);
            cy.get('app-create-f3x-step1').contains('FEC Form 3X').should('exist');
          });

          it(`Step 3: Select the Filing Frequency ${FilingFrequency}`, () => {
            cy.get('p-radiobutton[FormControlName="filing_frequency"]')
              .contains(FilingFrequency)
              .parent()
              .click()
              .find('div')
              .should('have.class', 'p-radiobutton-checked')
              .wait(50);
          });

          it(`Step 4: Select the Time Period button for ${TimePeriod}`, () => {
            cy.get('div[role="button"]')
              .contains(TimePeriod)
              .click()
              .parent()
              .should('have.class', 'p-highlight')
              .wait(50);
          });

          it(`Step 5: Check each Report Type radio button for interactivity and the presence of the "State" dropdown and the "Election On" date picker`, () => {
            let ReportTypes: Array<string> = Object.keys(InteractionTree[FilingFrequency][TimePeriod]);
            for (let i: number = 0; i < ReportTypes.length; i++) {
              let ReportType: string = ReportTypes[i];

              cy.get('p-radiobutton[FormControlName="report_code"]')
                .contains(ReportType)
                .parent()
                .click()
                .find('div')
                .should('have.class', 'p-radiobutton-checked');

              if (InteractionTree[FilingFrequency][TimePeriod][ReportType]) {
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
