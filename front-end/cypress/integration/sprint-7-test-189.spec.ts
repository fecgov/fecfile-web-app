// @ts-check

import { GenerateContactObject } from '../support/contacts.spec';

const contact = GenerateContactObject({ contact_type: 'Individual', first_name: 'Test', last_name: 'Edit' });

describe('QA Test Script #119 (Sprint 7)', () => {
  function before() {
    cy.login();
    cy.EnterContact(contact);
  }

  function after() {
    cy.get('p-table')
      .find('tr')
      .contains('First Last') //Finds out contact in the Manage Contacts table
      .parent() //Gets the row its in
      .find('p-button[icon="pi pi-trash"]') //Gets the edit button
      .click();

    cy.wait(100);
    cy.get('.p-confirm-dialog-accept').click();

    cy.wait(100);
    cy.logout();
  }

  it('Step 1: Navigate to contacts page', () => {
    cy.visit('/dashboard');
    cy.url().should('contain', '/dashboard');
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Contacts').click();
    cy.url().should('contain', '/contacts');

    before();
  });

  it('Steps 2 & 3: Find the created contact, verify that it is an individual, and then select its edit checkbox', () => {
    cy.get('tr')
      .contains('Test Edit') //Find the correct row; side effect: selects the element with the name
      .should('exist') //Double check that it exists
      .parent() //Get back to the row itself
      .should('contain', 'Individual')
      .find("div[role='checkbox']")
      .click()
      .find('.pi-check')
      .should('exist');
  });

  it('Step 4: Open the "Edit Contact" form', () => {
    cy.get('tr').contains('Test Edit').parent().find("p-button[icon='pi pi-pencil']").click();
    cy.get('div').contains('Edit Contact').should('exist');
  });

  it('Steps 5 & 6: Set the contact\'s name to "First Last"', () => {
    cy.get('#first_name').type('{backspace}{backspace}{backspace}{backspace}First').should('have.value', 'First');
    cy.get('#last_name').type('{backspace}{backspace}{backspace}{backspace}Last').should('have.value', 'Last');
  });

  it('Step 7: Save the contact', () => {
    cy.get("button[label='Save']").click();
    cy.wait(50);
  });

  it("Step 8: Verify that the 'Contact Updated' alert is shown", () => {
    cy.get("div[role='alert']").contains('Contact Updated').should('exist');
  });

  it('Step 9: Verify that the contact name is now "First Last"', () => {
    cy.get('tr').contains('First Last').should('exist');
  });

  it('Cleanup', () => {
    after();
  });
});
