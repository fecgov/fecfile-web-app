import { generateContactObject } from '../../support/generators/contacts.spec';
// @ts-check

const contact: object = generateContactObject({ contact_type: 'Committee' });

describe('QA Test Script #205 (Sprint 8)', () => {
  after(() => {
    cy.login();
    cy.visit('/dashboard');
    cy.deleteAllContacts();
  });

  it('', () => {
    //Step 1: Navigate to the Contacts Page
    cy.login();
    cy.visit('/dashboard');
    cy.url().should('contain', '/dashboard');
    cy.medWait();
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Contacts').click();
    cy.url().should('contain', '/contacts');
    cy.medWait();

    //Steps 2-6: Create a "Committee" type Contact
    cy.createContact(contact);

    //Steps 7-9: Edit the created contact's Committee ID
    cy.contains('tr', contact['name']).find("p-button[icon='pi pi-pencil']").click();

    cy.medWait();
    cy.get("input[formControlName='committee_id']").overwrite('C12345678');
    cy.get("button[label='Save']").click();
    cy.longWait();

    //Step 10: Verify that the Committee ID changed
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Dashboard').click();
    cy.shortWait();
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Contacts').click();
    cy.shortWait();
    cy.then(() => {
      cy.contains('tr', contact['name']).find("p-button[icon='pi pi-pencil']").click();

      cy.shortWait();
      cy.get("input[formControlName='committee_id']").should('have.value', 'C12345678');
      cy.get("button[label='Cancel']").click();
      cy.shortWait();
    });
  });
});
