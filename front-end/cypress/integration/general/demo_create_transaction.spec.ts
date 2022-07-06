import { generateReportObject } from '../../support/generators/reports.spec';
import { generateSchATransactionObject } from '../../support/generators/transactions.spec';
//@ts-check

describe('Demos the automated creation of a SchA Transaction', () => {
  it('Logs in and creates a dummy report', () => {
    cy.login();
    cy.wait(100);
    cy.deleteAllReports();
    cy.wait(100);
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.wait(100);

    const report = generateReportObject();
    cy.enterReport(report);
    cy.wait(250);
  });

  it('Navigates to the create transaction page', () => {
    cy.get('p-button[icon="pi pi-pencil"]').click();
    cy.wait(50);
    cy.progressReport();
    cy.get('button[label="Add new transaction"]').click();
    cy.wait(50);
    cy.get('p-accordiontab').contains('p-accordiontab', 'OTHER').click();
    cy.wait(50);
    cy.get('a').contains('Offsets to Operating Expenditures').click();
    cy.wait(50);
  });

  it('Creates a transaction', () => {
    const transaction: object = generateSchATransactionObject({ contributor_type: 'Individual' });
    cy.enterTransactionSchA(transaction);
  });
});
