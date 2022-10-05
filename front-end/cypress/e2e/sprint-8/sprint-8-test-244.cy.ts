// @ts-check

import { generateReportObject } from '../../support/generators/reports.spec';

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
  after(() => {
    cy.login();
    cy.visit('/dashboard');
    cy.deleteAllReports();
  });

  it('', () => {
    //Step 1: Log in, navigate to the reports page, create a report, and set it up to be ready for transactions
    cy.login();
    cy.visit('/dashboard');
    cy.url().should('contain', '/dashboard');
    cy.medWait();
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.url().should('contain', '/reports');

    const report = generateReportObject();
    cy.createReport(report);

    //Step 2: Select the edit button for the created report
    cy.navigateToTransactionManagement();

    //Step 3: Verify that you are on the "Transactions" page
    cy.get("div[role='toolbar']").contains('Transactions').should('exist');

    //Step 4: Verify that the "Transactions during coverage dates" table is displayed
    cy.get('p-table').contains('Transactions during coverage dates').should('exist');

    //Step 5: Verify the column labels
    for (const column of columns) {
      cy.get('th').contains(column).should('exist');
    }
  });
});
