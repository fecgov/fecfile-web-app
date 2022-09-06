// @ts-check

import { generateContactObject } from '../../support/generators/contacts.spec';

const contactTypes: Array<string> = ['Individual', 'Candidate', 'Committee', 'Organization'];

describe('QA Test Script #189, #245, #246, #247 (Sprint 7)', () => {
  function after() {
    cy.get('p-table')
      .contains('tr', 'First Last') //Finds out contact in the Manage Contacts table
      .find('p-button[icon="pi pi-trash"]') //Gets the edit button
      .click();

    cy.shortWait();
    cy.get('.p-confirm-dialog-accept').click();
  }

  for (const contactType of contactTypes) {
    context(`---> ${contactType}`, (cType = contactType) => {
      const contact: object = generateContactObject({
        contact_type: cType,
        first_name: 'Test',
        last_name: 'Edit',
        organization_name: 'Test Edit',
        committee_name: 'Test Edit',
      });

      it('', () => {
        //Step 1: Navigate to contacts page
        cy.login();
        cy.visit('/dashboard');

        cy.url().should('contain', '/dashboard');
        cy.get('.p-menubar').find('.p-menuitem-link').contains('Contacts').click();
        cy.url().should('contain', '/contacts');
        cy.createContact(contact);

        //Steps 2 & 3: Find the created contact, verify that it is an individual, and then select its edit checkbox
        cy.contains('tr', 'Test Edit') //Find the correct row; side effect: selects the element with the name
          .should('exist') //Double check that it exists
          .should('contain', cType)
          .find("div[role='checkbox']")
          .click()
          .find('.pi-check')
          .should('exist');

        //Step 4: Open the "Edit Contact" form
        cy.contains('tr', 'Test Edit').find("p-button[icon='pi pi-pencil']").click();
        cy.contains('div', 'Edit Contact').should('exist');

        //Steps 5 & 6: Set the contact\'s name to "First Last"
        if (cType == 'Individual' || cType == 'Candidate') {
          cy.get('#first_name').overwrite('First').should('have.value', 'First');
          cy.get('#last_name').overwrite('Last').should('have.value', 'Last');
        } else {
          cy.get('#name').overwrite('First Last').should('have.value', 'First Last');
        }

        //Steps 7 & 8: Save the contact and check for the popup
        cy.get("button[label='Save']").click();
        cy.medWait();
        cy.contains("div[role='alert']", 'Contact Updated').should('exist');

        //Step 9: Verify that the contact name is now "First Last"
        cy.contains('tr', 'First Last').should('exist');

        //Cleanup
        after();
      });
    });
  }
});
