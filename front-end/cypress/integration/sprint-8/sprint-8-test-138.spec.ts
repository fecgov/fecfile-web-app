// @ts-check
import { generateReportObject } from '../../support/generators/reports.spec';

describe('QA Test Script #138 (Sprint 8)', () => {
  it('Step 1: Navigate to reports page', () => {
    cy.login();
    cy.url().should('contain', '/dashboard');
    cy.medWait();
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.url().should('contain', '/reports');
  });

  it('Steps 2-8: Create a report with "Save" and check to see that it exists in the reports list', () => {
    const report: object = generateReportObject();
    cy.createReport(report);

    cy.contains('.p-menuitem-link', 'Dashboard').click();
    cy.shortWait();
    cy.contains('.p-menuitem-link', 'Reports').click();
    cy.shortWait();

    cy.contains('tr', report['report_code'])
      .contains('tr', report['coverage_from_date'])
      .contains('tr', report['coverage_through_date'])
      .should('exist');
  });

  it('Steps 9-12: Create a report with "Save & continue" and check to see that it exists in the reports list', () => {
    cy.deleteAllReports();
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Contacts').click();
    cy.shortWait();
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.shortWait();
    const report: object = generateReportObject();
    cy.createReport(report, false); //Enter a report without saving it
    cy.get("button[label='Save and continue']").click();
    cy.longWait();

    cy.contains('.p-menuitem-link', 'Dashboard').click();
    cy.shortWait();
    cy.contains('.p-menuitem-link', 'Reports').click();
    cy.shortWait();

    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.longWait();

    cy.contains('tr', report['report_code'])
      .contains('tr', report['coverage_from_date'])
      .contains('tr', report['coverage_through_date'])
      .should('exist');
  });

  it('Cleanup', () => {
    cy.shortWait();
    cy.deleteAllReports();
    cy.logout();
  });
});
