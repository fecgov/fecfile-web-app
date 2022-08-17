import { generateReportObject } from '../../support/generators/reports.spec';
import { generateTransactionObject } from '../../support/generators/transactions.spec';

describe('QA Script 125 (Sprint 10)', () => {
  const reportObject1 = generateReportObject({
    coverage_from_date:"01/01/2010"
  });
  const reportObject2 = generateReportObject({
    coverage_from_date:"01/01/2011"
  });

  before('Logs in and creates a dummy report', () => {
    cy.login();

    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.shortWait();

    cy.createReport(reportObject1);
    cy.get('p-button[icon="pi pi-pencil"]').click();
    cy.progressReport();
    cy.get('.p-menubar').contains('.p-menuitem-link', 'Reports').click();
    cy.longWait();
    cy.createReport(reportObject2);
  });

  it('Enters transactions', () => {
    for (let i = 0; i < 2; i++) {
      cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
      cy.medWait();
      cy.contains("th", "Coverage dates").click();
      cy.medWait();
      cy.get('p-button[icon="pi pi-pencil"]').eq(i)
        .click(); //prettier-ignore
      cy.medWait();
      cy.navigateToTransactionManagement();

      const transaction = generateTransactionObject({
        "INDIVIDUALS/PERSONS":{
          "Individual Receipt":{}
        }
      });
      cy.createTransactionSchA(transaction);
      cy.medWait();
    }
  });

  it(`Should find only one transaction in each report`, () => {
    for (let i = 0; i < 2; i++) {
      cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
      cy.medWait();
      cy.contains("th", "Coverage dates").click();
      cy.shortWait();
      cy.get('p-button[icon="pi pi-pencil"]').eq(i)
        .click(); //prettier-ignore
      cy.medWait();
      cy.navigateToTransactionManagement();
      cy.get("tbody").find("tr").should("have.length", 1);
    }
  });

  it("Cleanup", ()=>{
    cy.deleteAllReports();
    cy.logout();
  });
});
