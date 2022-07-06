// @ts-check

import { generateReportObject } from '../../support/generators/reports.spec';

describe('QA Test Script #133 (Sprint 8)', () => {
  it('Step 1: Navigate to reports page and create a report', () => {
    cy.login();
    cy.url().should('contain', '/dashboard');
    cy.wait(250);
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.url().should('contain', '/reports');

    let report: object = generateReportObject();
    cy.enterReport(report);
    cy.wait(250);
  });

  it('Step 2: Edit a report', () => {
    cy.get("p-button[icon='pi pi-pencil']").first().click();
    cy.wait(250);
  });

  it('Step 3: Set the "Has your address changed" radio-button to "YES"', () => {
    cy.get("p-radiobutton[formControlName='change_of_address']")
      .contains('YES')
      .parent()
      .find('.p-radiobutton')
      .click();
    cy.wait(50);
  });

  it('Step 4: The "Update your committee address" link should exist', () => {
    cy.get('a')
      .contains('Update your committee address')
      .should('exist')
      .parent()
      .contains(
        'Within 10 days of an address change you must notify the FEC by amending your Form 1, in addition to updating your address here.'
      )
      .should('exist');
  });

  it('Step 5: Verify that the link does not 404', () => {
    cy.get('a')
      .contains('a', 'Update your committee address')
      .then((jQueryObject) => {
        console.log(jQueryObject[0]);
        cy.request('GET', jQueryObject[0].href).its('status').should('not.eq', 404);
      });
  });

  it('Cleanup', () => {
    cy.deleteAllReports();
    cy.logout();
  });
});
