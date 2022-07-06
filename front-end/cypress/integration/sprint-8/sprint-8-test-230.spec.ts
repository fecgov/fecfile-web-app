// @ts-check

import { randomString, date as randomDate, state as randomState } from '../../support/generators/generators.spec';
import { generateReportObject } from '../../support/generators/reports.spec';

const contactFields: object = {
  //Contains the max allowable length for any given field
  Individual: {
    contributor_last_name: 30,
    contributor_first_name: 20,
    contributor_middle_name: 20,
    contributor_prefix: 10,
    contributor_suffix: 10,
    contributor_street_1: 34,
    contributor_street_2: 34,
    contributor_city: 30,
    contributor_zip: 9,
    memo_text_description: 100,
    contribution_amount: 12,
  },
  Organization: {
    contributor_street_1: 34,
    contributor_street_2: 34,
    contributor_city: 30,
    contributor_zip: 9,
    contributor_organization_name: 200,
    memo_text_description: 100,
    contribution_amount: 12,
  },
};

const fieldsRequired: Array<string> = [
  'contributor_street_1',
  'contributor_city',
  'contributor_zip',
  'contributor_organization_name',
  'contributor_first_name',
  'contributor_last_name',
  'contribution_amount',
];

let transactionType: string;
const transactions: object = { Individual: {}, Organization: {} };

describe('QA Test Scripts #230 (Sprint 8)', () => {
  before('Logs in and creates a dummy report', () => {
    cy.login();
    cy.wait(100);
    cy.deleteAllReports();
    cy.wait(100);
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.wait(100);

    const report = generateReportObject();
    cy.enterReport(report);

    cy.wait(250);
    cy.get('p-button[icon="pi pi-pencil"]').click();
    cy.wait(50);
    cy.progressReport();
    cy.wait(250);
  });

  for (transactionType of Object.keys(transactions)) {
    context(`---> ${transactionType}`, (cType = transactionType) => {
      it('Opens a new transaction', () => {
        cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
        cy.wait(100);
        cy.get('p-button[icon="pi pi-pencil"]').click();
        cy.wait(50);
        cy.get('button[label="Add new transaction"]').click();
        cy.wait(50);
        cy.get('p-accordiontab').contains('p-accordiontab', 'OTHER').click();
        cy.wait(50);
        cy.get('a').contains('Offsets to Operating Expenditures').click();
        cy.wait(50);
      });

      it('Checks every field for required/optional and maximum length', () => {
        cy.dropdownSetValue("p-dropdown[FormControlName='entity_type']", cType);
        cy.wait(50);
      });

      it('Checks non-text fields', () => {
        cy.calendarSetValue('p-calendar[formControlName="contribution_date"]', randomDate());
        cy.dropdownSetValue("p-dropdown[formControlName='contributor_state']", randomState());
        cy.get('.p-checkbox-box').click();
      });

      for (const field of Object.keys(contactFields[cType])) {
        const strLength: number = contactFields[cType][field];

        it(`Tests the "${field}" field for required/optional and max length`, () => {
          if (fieldsRequired.includes(field)) {
            cy.get(`[formControlName="${field}"]`).click();
            cy.get('h1').last().click();
            cy.get(`[formControlName="${field}"]`).parent().should('contain', 'This is a required field');
          }

          let randString = '';
          if (field == 'contribution_amount') {
            randString = randomString(strLength, 'numeric');
          } else {
            randString = randomString(strLength);
          }

          cy.get(`[formControlName='${field}']`).safeType(randString);
          cy.get('h1').last().click();
          cy.get(`[formControlName='${field}']`)
            .parent()
            .find('app-error-messages')
            .children()
            .should('have.length', 0);
          cy.get(`[formControlName='${field}']`).safeType('{home}1');
          cy.get('h1').last().click();
          cy.get(`[formControlName='${field}']`).parent().find('app-error-messages').should('have.length', 1);
        });
      }

      it('Closes out the form', () => {
        cy.get("button[label='Cancel']").click();
        cy.wait(50);
      });
    });
  }

  after('Cleanup', () => {
    cy.deleteAllReports();
    cy.logout();
  });
});
