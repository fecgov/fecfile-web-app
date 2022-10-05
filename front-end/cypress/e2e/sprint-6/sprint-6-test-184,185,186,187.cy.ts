// @ts-check

import { generateContactObject } from '../../support/generators/contacts.spec';

const contacts: object = { Individual: {}, Candidate: {}, Committee: {}, Organization: {} };

describe('QA Test Scripts 184 through 187', () => {
  beforeEach('Logs in', () => {
    cy.login();
    cy.visit('/dashboard');
  });

  after(() => {
    cy.login();
    cy.visit('/dashboard');
    cy.deleteAllContacts();
  });

  let contact: object;
  for (const contactType of Object.keys(contacts)) {
    contact = generateContactObject({ contact_type: contactType });

    it(`---> ${contactType}`, () => {
      //Step 1: Navigate to contacts page
      cy.url().should('contain', '/dashboard');
      cy.get('.p-menubar').find('.p-menuitem-link').contains('Contacts').click();
      cy.url().should('contain', '/contacts');

      cy.createContact(contact);
      cy.longWait();

      //Steps 2 & 3: Select a contact and open the edit menu
      cy.contains('tr', `${contact['name']}`) //Finds out contact in the Manage Contacts table
        .find('p-tablecheckbox')
        .click() //Check the checkbox for step 2
        .parent()
        .parent() //Get back to the row
        .find('p-button[icon="pi pi-pencil"]') //Gets the edit button
        .click();

      //Steps 4 & 5: No 'Save & Add More' button; Save and Cancel buttons exist
      cy.get("button[label='Save & Add More']").should('not.exist'); //Checks that the "Save & Add More button does not exist"
      cy.get("button[label='Save']").should('exist');
      cy.get("button[label='Cancel']").should('exist');
    });
  }
});
