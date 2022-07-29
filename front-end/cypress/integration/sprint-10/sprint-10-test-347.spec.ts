import { generateReportObject } from "../../support/generators/reports.spec";
import { generateTransactionObject } from "../../support/generators/transactions.spec";
import { createTransactionSchA } from "../../support/transactions.spec";


describe('QA Script 347 (Sprint 10)', () => {
  before('Logs in and creates a dummy report', () => {
    cy.login();
    const report = generateReportObject();
    cy.enterReport(report);
    cy.get('p-button[icon="pi pi-pencil"]')
      .click();
    cy.progressReport();
  });

  it(`Tests the summary page for a report`, ()=>{
    const transactionTree = generateTransactionObject({
      "TRANSFERS":{
        "JF Transfers":{}
      }
    });
    createTransactionSchA(transactionTree);
    cy.medWait();
    const parentTransaction = transactionTree["TRANSFERS"]["JF Transfers"];
    const childTransaction = parentTransaction["childTransactions"][0];
    const childName = childTransaction["contributorOrganizationName"];

    cy.contains("tr",parentTransaction["contributorOrganizationName"])
      .find(">td")
      .eq(6)
      .then(($td)=>{
        const parentId = $td.text();
        cy.contains("tr", childName).find("td").eq(7).should("have.text", parentId);
      });

  });

  it("Cleanup", ()=>{
    cy.deleteAllReports();
    cy.logout();
  });
});