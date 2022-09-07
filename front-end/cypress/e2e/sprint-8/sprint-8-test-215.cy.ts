// @ts-check

import { generateReportObject } from '../../support/generators/reports.spec';

describe('QA Test Script #215 (Sprint 8)', () => {
  after(() => {
    cy.login();
    cy.visit('/dashboard');
    cy.deleteAllReports();
  });

  it('', () => {
    //Step 1: Navigate to reports page and create a report
    cy.login();
    cy.visit('/dashboard');
    cy.url().should('contain', '/dashboard');
    cy.medWait();
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.url().should('contain', '/reports');

    const report = generateReportObject();
    cy.createReport(report);

    //Step 2: Edit a report
    cy.get("p-button[icon='pi pi-pencil']").first().click();
    cy.medWait();

    //Step 3: Set the "Has your address changed" radio-button to "YES"
    cy.get("p-radiobutton[formControlName='change_of_address']")
      .contains('YES')
      .parent()
      .find('.p-radiobutton')
      .click();
    cy.shortWait();

    //Step 4: The "Update your committee address" link should exist
    cy.get('a')
      .contains('Update your committee address')
      .should('exist')
      .parent()
      .contains(
        'Within 10 days of an address change you must notify the FEC by amending your Form 1, in addition to updating your address here.'
      )
      .should('exist');

    //Step 5: Verify that the link does not 404
    cy.get('a')
      .contains('a', 'Update your committee address')
      .then((jQueryObject) => {
        cy.request('GET', jQueryObject[0].href).its('status').should('not.eq', 404);
      });
  });
});
