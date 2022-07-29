import { generateReportObject } from '../../support/generators/reports.spec';
import { generateTransactionObject } from '../../support/generators/transactions.spec';

describe('QA Script 125 (Sprint 10)', () => {
  before('Logs in and creates a dummy report', () => {
    cy.login();

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
      cy.medWait();
      cy.contains("th", "Coverage dates").click();
      cy.medWait();
      cy.get('p-button[icon="pi pi-pencil"]').eq(i)
        .click(); //prettier-ignore
      cy.medWait();
      cy.progressReport();

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
      cy.get("tbody").find("tr").should("have.length", 1);
    }
  });

  it("Cleanup", ()=>{
    cy.deleteAllReports();
    cy.logout();
  });
});
