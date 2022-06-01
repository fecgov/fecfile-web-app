// @ts-check

import { randomDate, generateReportObject, deleteAllReports, enterReport } from '../support/reports.spec';
import { generateContactObject } from '../support/contacts.spec';

const contact = generateContactObject(); //Leveraging its address generator

describe('QA Test Script #133 (Sprint 8)', () => {
  const fromDate: Date = randomDate();
  const throughDate: Date = randomDate();

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
  });

  it('Step 3: Set the "Has your address changed" radio-button to "NO"', () => {
    cy.get("p-radiobutton[formControlName='change_of_address']").contains('NO').parent().find('.p-radiobutton').click();
  });

  it('Step 4: Click the "Save" button', () => {
    cy.get("button[label='Save']").click();
    cy.wait(250);
  });

  it('Step 5: Check for the "Success" toast', () => {
    cy.get('.p-toast-summary').should('contain', 'Success');
  });

  it('Step 6: Go back', () => {
    cy.get("button[label='Back']").click();
  });

  /*it('Cleanup between reports', ()=>{
    cy.deleteAllReports();
    let report: object = generateReportObject();
    cy.enterReport(report);
  });*/

  it('Step 7: Reopen the report', () => {
    cy.get("p-button[icon='pi pi-pencil']").first().click();
  });

  it('Step 8: Check that the "Has your address changed" radio-button defaults to "NO"', () => {
    cy.get("p-radiobutton[formControlName='change_of_address']")
      .contains('NO')
      .parent()
      .find('.p-radiobutton')
      .should('have.class', 'p-radiobutton-checked');
  });

  it('Step 9: Set the "Has your address changed" radio-button to "YES"', () => {
    cy.get("p-radiobutton[formControlName='change_of_address']")
      .contains('YES')
      .parent()
      .find('.p-radiobutton')
      .click();
  });

  it('Step 10: Verify that the "Address" fields are displayed', () => {
    cy.get("input[formControlName='street_1']").should('exist');
    cy.get("input[formControlName='street_2']").should('exist');
    cy.get("input[formControlName='city']").should('exist');
    cy.get("input[formControlName='zip']").should('exist');
    cy.get("p-dropdown[formControlName='state']").should('exist');
  });

  it('Step 11: Update the address', () => {
    cy.get("input[formControlName='street_1']").safeType('{selectAll}').safeType(contact['street']);
    cy.get("input[formControlName='street_2']").safeType('{selectAll}').safeType(contact['apartment']);
    cy.get("input[formControlName='city']").safeType('{selectAll}').safeType(contact['city']);
    cy.get("input[formControlName='zip']").safeType('{selectAll}').safeType(contact['zip']);
    cy.dropdownSetValue("p-dropdown[formControlName='state']", contact['state']);
  });

  it('Cleanup', () => {
    cy.deleteAllReports();
    cy.logout();
  });
});
