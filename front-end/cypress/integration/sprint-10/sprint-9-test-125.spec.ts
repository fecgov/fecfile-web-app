import { generateReportObject } from '../../support/generators/reports.spec';
import { generateTransactionObject } from '../../support/generators/transactions.spec';

describe('Sprint 9 QA Script 98', () => {
  before('Logs in and creates a dummy report', () => {
    cy.login();
    cy.deleteAllReports();

    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.shortWait();

    const reportObject1 = generateReportObject();
    const reportObject2 = generateReportObject();

    cy.enterReport(reportObject1);
    cy.enterReport(reportObject2);
  });

  it('Enters transactions', () => {
    for (let i = 0; i < 2; i++) {
      cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
      cy.get('p-button[icon="pi pi-pencil"]')
        .click(); //prettier-ignore
      cy.medWait();
      cy.progressReport();

      const transaction = generateTransactionObject();
      cy.enterTransactionSchA(transaction);
    }
  });

  it(``, () => {
    cy.get('button');
  });
});
