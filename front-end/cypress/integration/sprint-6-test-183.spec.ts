// @ts-check

import { GenerateContactObject } from '../support/contacts.spec';

const Contact: Object = GenerateContactObject({ contact_type: 'Individual', state: 'Virginia' });

describe('QA Test Script #183 (Sprint 6)', () => {
  function before() {
    cy.Login();
    cy.EnterContact(Contact);
  }

  function after() {
    cy.get('p-table')
      .find('tr')
      .contains(`${Contact['first_name']} ${Contact['last_name']}`) //Finds out contact in the Manage Contacts table
      .parent() //Gets the row its in
      .find('p-button[icon="pi pi-trash"]') //Gets the edit button
      .click();

    cy.wait(100);
    cy.get('.p-confirm-dialog-accept').click();

    cy.wait(100);
    cy.Logout();
  }

  it('Step 1: Navigate to contacts page', () => {
    before();

    cy.visit('/dashboard');
    cy.url().should('contain', '/dashboard');
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Contacts').click();
    cy.url().should('contain', '/contacts');
  });

  it("Steps 2-8: Select a contact, edit that contact's state, verify that it saved", () => {
    cy.get('p-table')
      .find('tr')
      .contains(`${Contact['first_name']} ${Contact['last_name']}`) //Finds out contact in the Manage Contacts table
      .parent() //Gets the row its in
      .find('p-tablecheckbox')
      .click() //Check the checkbox for step 2
      .parent()
      .parent() //Get back to the row
      .find('p-button[icon="pi pi-pencil"]') //Gets the edit button
      .click();

    cy.get("p-dropdown[formcontrolname='state']").should('contain', 'Virginia').should('not.contain', 'Texas'); //Demonstrates that it's not just finding a value within the dropdown options

    cy.DropdownSetValue("p-dropdown[formcontrolname='state']", 'West Virginia');

    cy.get("button[label='Save']").click();

    cy.wait(100); //Wait for the form to close itself
    cy.get('p-table')
      .find('tr')
      .contains(`${Contact['first_name']} ${Contact['last_name']}`) //Finds out contact in the Manage Contacts table
      .parent() //Gets the row its in
      .find('p-button[icon="pi pi-pencil"]') //Gets the edit button
      .click();

    cy.get("p-dropdown[formcontrolname='state']").should('contain', 'West Virginia');
    cy.get("button[label='Cancel']").click();
  });

  it('Cleanup', () => {
    cy.wait(100);
    after();
  });
});
