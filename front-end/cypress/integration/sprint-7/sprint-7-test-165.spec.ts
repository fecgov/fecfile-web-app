// @ts-check

import { date } from '../../support/generators/generators.spec';
import { generateReportObject } from '../../support/generators/reports.spec';
import { dateToString } from '../../support/reports.spec';

describe('QA Test Script #165 (Sprint 7)', () => {
  it('Step 1: Navigate to the reports page and populate it with three reports', () => {
    cy.login();
    cy.url().should('contain', '/dashboard');
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.url().should('contain', '/reports');

    for (let i = 0; i < 3; i++) {
      let report_date: Date = date();
      report_date.setFullYear(2030 + i);
      const report = generateReportObject({ coverage_from_date: dateToString(report_date) });
      cy.createReport(report);
      if (i === 0){
        cy.navigateToTransactionManagement();
        cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
      }
    }
  });

  it('Steps 2-13: Check for sortability on each column', () => {
    const columns: Array<string> = ['Form type', 'Type of report', 'Coverage dates', 'Status', 'Version', 'Date filed'];
    let column: string;
    for (column of columns) {
      cy.contains('th', column)
        .should('contain', column)
        .find('p-sorticon')
        .should('exist')
        .click()
        .find('i')
        .should('have.class', 'pi-sort-amount-up-alt');
    }
    for (column of columns) {
      cy.contains('th', column)
        .should('contain', column)
        .find('p-sorticon')
        .should('exist')
        .click()
        .click()
        .find('i')
        .should('have.class', 'pi-sort-amount-down');
    }
  });

  it('Cleanup', () => {
    cy.deleteAllReports();
    cy.logout();
  });
});
