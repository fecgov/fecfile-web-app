// @ts-check
import { generateReportObject } from '../../support/generators/reports.spec';

describe('QA Test Script #138 (Sprint 8)', () => {
  it('Step 1: Navigate to reports page', () => {
    cy.login();
    cy.url().should('contain', '/dashboard');
    cy.wait(250);
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.url().should('contain', '/reports');
  });

  it('Steps 2-8: Create a report with "Save" and check to see that it exists in the reports list', () => {
    const report: object = generateReportObject();
    cy.enterReport(report);
    cy.wait(250);

    cy.get('tr')
      .contains('tr', report['report_code'])
      .contains('tr', report['coverage_from_date'])
      .contains('tr', report['coverage_through_date'])
      .should('exist');
  });

  it('Steps 9-12: Create a report with "Save & continue" and check to see that it exists in the reports list', () => {
    const report: object = generateReportObject();
    cy.enterReport(report, false); //Enter a report without saving it
    cy.get("button[label='Save and continue']").click();
    cy.wait(50);
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.wait(250);

    cy.get('tr')
      .contains('tr', report['report_code'])
      .contains('tr', report['coverage_from_date'])
      .contains('tr', report['coverage_through_date'])
      .should('exist');
  });

  it('Cleanup', () => {
    cy.wait(250);
    cy.deleteAllReports();
    cy.logout();
  });
});
