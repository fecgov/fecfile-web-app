// @ts-check

import { generateReportObject } from '../support/reports.spec';

const columns = [
  'Transaction type',
  'Contribution name',
  'Contribution date',
  'Memo code',
  'Contribution amount',
  'Contribution aggregate',
  'Actions',
];

describe('QA Script 244 (Sprint 8)', () => {
  it('Step 1: Log in, navigate to the reports page, create a report, and set it up to be ready for transactions', () => {
    cy.login();
    cy.url().should('contain', '/dashboard');
    cy.wait(250);
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.url().should('contain', '/reports');

    let report: object = generateReportObject();
    cy.enterReport(report);
    cy.wait(250);

    cy.get("p-button[icon='pi pi-pencil']").first().click();
    cy.wait(50);
    cy.get("p-radiobutton[formControlName='change_of_address']")
      .contains('YES')
      .parent()
      .find('.p-radiobutton')
      .click();

    cy.get("button[label='Save']").click();
    cy.get("button[label='Back']").click();
    cy.wait(250);
  });

  it('Step 2: Select the edit button for the created report', () => {
    cy.get("p-button[icon='pi pi-pencil']").first().click();
    cy.wait(50);
  });

  it('Step 3: Verify that you are on the "Transactions" page', () => {
    cy.get("div[role='toolbar']").contains('Transactions').should('exist');
  });

  it('Step 4: Verify that the "Transactions during coverage dates" table is displayed', () => {
    cy.get('p-table').contains('Transactions during coverage dates').should('exist');
  });

  it('Step 5: Verify the column labels', () => {
    for (let column of columns) {
      cy.get('th').contains(column).should('exist');
    }
  });

  it('Cleanup', () => {
    cy.deleteAllReports();
    cy.logout();
  });
});
