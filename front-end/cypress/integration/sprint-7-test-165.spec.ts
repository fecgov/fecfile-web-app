// @ts-check

import { generateReportObject } from '../support/reports.spec';

describe('QA Test Script #165 (Sprint 7)', () => {
  it('Step 1: Navigate to contacts page and populate it with one report', () => {
    cy.login();
    cy.url().should('contain', '/dashboard');
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.url().should('contain', '/reports');

    for (let i: number = 0; i < 3; i++) {
      let report = generateReportObject();
      cy.enterReport(report);
    }
  });

  it('Steps 2-13: Check for sortability on each column', () => {
    const columns: Array<string> = ['Form type', 'Type of report', 'Coverage dates', 'Status', 'Version', 'Date filed'];
    let column: string;
    for (column of columns) {
      cy.get('th')
        .contains(column)
        .should('contain', column)
        .find('p-sorticon')
        .should('exist')
        .click()
        .find('i')
        .should('have.class', 'pi-sort-amount-up-alt');
    }
    for (column of columns) {
      cy.get('th')
        .contains(column)
        .should('contain', column)
        .find('p-sorticon')
        .should('exist')
        .click()
        .click()
        .find('i')
        .should('have.class', 'pi-sort-amount-down');
    }
  });
});
