import { generateReportObject } from '../../support/generators/reports.spec';
import { generateSchATransactionObject } from '../../support/generators/transactions.spec';
import { shortWait } from '../../support/commands';
//@ts-check

describe('Demos the automated creation of a SchA Transaction', () => {
  it('Logs in and creates a dummy report', () => {
    cy.login();
    cy.deleteAllReports();
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.shortWait();

    const report = generateReportObject();
    cy.enterReport(report);
  });

  it('Navigates to the create transaction page', () => {
    cy.get('p-button[icon="pi pi-pencil"]').click();
    cy.shortWait();
    cy.progressReport();
    cy.get('button[label="Add new transaction"]').click();
    cy.shortWait();
    cy.get('p-accordiontab').contains('p-accordiontab', 'OTHER').click();
    cy.shortWait();
    cy.get('a').contains('Offsets to Operating Expenditures').click();
    cy.shortWait();
  });

  it('Creates a transaction', () => {
    const transaction: object = generateSchATransactionObject({ contributor_type: 'Individual' });
    cy.enterTransactionSchA(transaction);
  });
});
