import { generateReportObject } from '../../support/generators/reports.spec';

describe('Sprint 9 QA Script 98', () => {
  before('Logs in and creates a dummy report', () => {
    cy.login();
  });

  for (let filing_frequency of ['QUARTERLY', 'MONTHLY']) {
    it(`Test that a ${filing_frequency} report is of type F3XT when it has a "TER" report code`, () => {
      cy.deleteAllReports();

      cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
      cy.shortWait();

      const reportObject1 = generateReportObject();
      const reportObject2 = generateReportObject();

      cy.enterReport(reportObject1);
      cy.enterReport(reportObject2);

      for (let i = 0; i < 2; i++) {
        cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
        cy.get('p-button[icon="pi pi-pencil"]')[i].click();
        cy.medWait();
        cy.progressReport();
      }
    });
  }
});
