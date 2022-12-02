// @ts-check
import { generateReportObject } from '../../support/generators/reports.spec';

describe('Tests that reports are visible within the report management table', () => {
  after(() => {
    cy.login();
    cy.visit('/dashboard');
    cy.deleteAllReports();
  });

  it('Tests that reports are visible within the report management table', () => {
    //Step 1: Navigate to reports page
    cy.login();
    cy.visit('/dashboard');
    cy.url().should('contain', '/dashboard');
    cy.medWait();
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.url().should('contain', '/reports');

    //Steps 2-8: Create a report with "Save" and check to see that it exists in the reports list
    const report_1 = generateReportObject();
    cy.createReport(report_1);

    cy.contains('.p-menuitem-link', 'Dashboard').click();
    cy.shortWait();
    cy.contains('.p-menuitem-link', 'Reports').click();
    cy.shortWait();

    cy.contains('tr', report_1['report_code'])
      .contains('tr', report_1['coverage_from_date'])
      .contains('tr', report_1['coverage_through_date'])
      .should('exist');

    //Clear out the existing report so that we can make a new one
    cy.deleteAllReports();
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Contacts').click();
    cy.shortWait();
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.shortWait();

    //Steps 9-12: Create a report with "Save & continue" and check to see that it exists in the reports list
    const report_2 = generateReportObject();
    cy.createReport(report_2, false); //Enter a report without saving it
    cy.get("button[label='Save and continue']").click();
    cy.longWait();

    cy.contains('.p-menuitem-link', 'Dashboard').click();
    cy.shortWait();
    cy.contains('.p-menuitem-link', 'Reports').click();
    cy.shortWait();

    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.longWait();

    cy.contains('tr', report_2['report_code'])
      .contains('tr', report_2['coverage_from_date'])
      .contains('tr', report_2['coverage_through_date'])
      .should('exist');
  });
});
