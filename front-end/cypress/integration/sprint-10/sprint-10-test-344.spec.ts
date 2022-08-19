import { generateReportObject } from "../../support/generators/reports.spec";
import { FilingFrequency, filingFrequencyTree, FilingType } from "../../support/reports.spec";

function testReportType(frequency: FilingFrequency, type: FilingType, reportCode: string){
  cy.deleteAllReports();
  cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
  cy.shortWait();

  const report = generateReportObject({
    filing_frequency: frequency,
    report_type_category: type,
    report_code: reportCode,
  });

  cy.createReport(report);

  cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
  cy.shortWait();
  cy.get('p-button[icon="pi pi-pencil"]')
    .click();
  cy.shortWait();
  cy.navigateToTransactionManagement();
  cy.navigateReportSidebar("Review", "View summary page");
  
  cy.get(".summary-header").contains(reportCode).should("exist");
  for (const header of ["LINE NUMBER", "LINE DESCRIPTION", "THIS PERIOD", "CALENDAR YEAR-TO-DATE"]){
    cy.contains("th",header).should("exist");
  }
}

describe('QA Script 344 (Sprint 10)', () => {
  before('Logs in and creates a dummy report', () => {
    cy.login();
  });

  let reportCodes: string[] = [];
  for (const filingFrequency of Object.keys(filingFrequencyTree)){
    const frequency = filingFrequency as FilingFrequency;
    for (const filingType of Object.keys(filingFrequencyTree[frequency])){
      const type = filingType as FilingType;
      for (const reportCode of Object.keys(filingFrequencyTree[frequency][type])){
        if (! reportCodes.includes(reportCode)){
          reportCodes = [reportCode, ...reportCodes];
          it(`Tests the summary page for a ${reportCode} report`, ()=>{
            testReportType(frequency, type, reportCode);
          });
        }
      }
    }
  }

  it("Cleanup", ()=>{
    cy.deleteAllReports();
    cy.logout();
  });
});
