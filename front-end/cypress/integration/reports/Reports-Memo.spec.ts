// @ts-check

import { randomString } from "../../support/generators/generators.spec";
import { generateConfirmationDetails, generateFilingDetails, generateReportObject } from "../../support/generators/reports.spec";
import { generateTransactionObject } from "../../support/generators/transactions.spec";


const report = generateReportObject();

describe('Test creating a report and adding a report-level memo', () => {
  before('Logs in and clears existing reports', () => {
    cy.login();
    cy.deleteAllReports();
  });

  it('Creates a report', ()=>{
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.shortWait();
    cy.createReport(report);
  });

  it('Progresses to the Transaction Management Page', ()=>{
    cy.navigateToTransactionManagement();
  });

  it('Submits a report level memo', ()=>{
    cy.navigateReportSidebar('Review', 'Add a report level memo');
    cy.shortWait();

    const text = randomString(4000, 'special', false);

    console.log(text.length);

    cy.get('textarea').overwrite(text).safeType("A");

    cy.get("app-error-messages")
      .should("contain",
        "This field cannot contain more than 4000 alphanumeric characters.");
    
    cy.get("textarea").safeType("{backspace}");
    cy.get("app-error-messages")
      .should("not.contain",
        "This field cannot contain more than 4000 alphanumeric characters.");

    cy.get('button[label="Save & continue"]').click();
    cy.medWait();

    cy.navigateReportSidebar('Review', 'Add a report level memo');
    cy.get('textarea').should('have.value', text);
 });

  after('Cleanup', () => {
    cy.deleteAllReports();
    cy.logout();
  });
});