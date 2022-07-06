// @ts-check

import { generateContactObject } from '../../support/generators/contacts.spec';

const contacts: object = { Individual: {}, Candidate: {}, Committee: {}, Organization: {} };

function after(contact) {
  cy.get('p-table')
    .find('tr')
    .contains(contact['name']) //Finds out contact in the Manage Contacts table
    .parent() //Gets the row its in
    .find('p-button[icon="pi pi-trash"]') //Gets the trash button
    .click();

  cy.wait(100);
  cy.get('.p-confirm-dialog-accept').click();

  cy.wait(100);
  cy.logout();
}

describe('QA Test Scripts 184 through 187', () => {
  for (const contactType of Object.keys(contacts)) {
    contacts[contactType] = generateContactObject({ contact_type: contactType });

    context(`---> ${contactType}`, (cType = contactType) => {
      let contact: object = contacts[cType];

      it('Step 1: Navigate to contacts page', () => {
        cy.login();
        cy.visit('/dashboard');
        cy.url().should('contain', '/dashboard');
        cy.get('.p-menubar').find('.p-menuitem-link').contains('Contacts').click();
        cy.url().should('contain', '/contacts');
      });

      it(`Creates a ${cType} contact`, () => {
        cy.enterContact(contact);
        cy.wait(100);
      });

      it('Steps 2 & 3: Select a contact and open the edit menu', () => {
        cy.get('p-table')
          .find('tr')
          .contains(`${contact['name']}`) //Finds out contact in the Manage Contacts table
          .parent() //Gets the row its in
          .find('p-tablecheckbox')
          .click() //Check the checkbox for step 2
          .parent()
          .parent() //Get back to the row
          .find('p-button[icon="pi pi-pencil"]') //Gets the edit button
          .click();
      });

      it("Steps 4 & 5: No 'Save & Add More' button; Save and Cancel buttons exist", () => {
        cy.get("button[label='Save & Add More']").should('not.exist'); //Checks that the "Save & Add More button does not exist"
        cy.get("button[label='Save']").should('exist');
        cy.get("button[label='Cancel']").should('exist');
      });

      it("Step 6: Close the form with the 'X' button", () => {
        cy.get('.p-dialog-header-close-icon').click(); //Close the form with the 'X' button

        cy.wait(100);
        after(contact);
      });
    });
  }
});
