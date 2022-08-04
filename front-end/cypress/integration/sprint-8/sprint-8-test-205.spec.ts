import { generateContactObject } from '../../support/generators/contacts.spec';
// @ts-check

const contact: object = generateContactObject({ contact_type: 'Committee' });

describe('QA Test Script #205 (Sprint 8)', () => {
  it('Step 1: Navigate to the Contacts Page', () => {
    cy.login();
    cy.url().should('contain', '/dashboard');
    cy.medWait();
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Contacts').click();
    cy.url().should('contain', '/contacts');
    cy.medWait();
  });

  it('Steps 2-6: Create a "Committee" type Contact', () => {
    cy.enterContact(contact);
  });

  it("Steps 7-9: Edit the created contact's Committee ID", () => {
    cy.contains('tr', contact['name']).find("p-button[icon='pi pi-pencil']").click();

    cy.medWait();
    cy.get("input[formControlName='committee_id']").overwrite('C12345678');
    cy.get("button[label='Save']").click();
    cy.longWait();
  });

  it('Step 10: Verify that the Committee ID changed', () => {
    //The GET request that occurs *sometimes* comes in before the previous PUT request, so a long, long wait is needed
    cy.wait(1000).then(() => {
      cy.contains('tr', contact['name']).find("p-button[icon='pi pi-pencil']").click();

      cy.shortWait();
      cy.get("input[formControlName='committee_id']").should('have.value', 'C12345678');
      cy.get("button[label='Cancel']").click();
      cy.shortWait();
    });
  });

  it('Cleanup', () => {
    cy.contains('tr', contact['name']).find("p-button[icon='pi pi-trash']").click();

    cy.medWait();
    cy.contains('button', 'Yes').click();
    cy.shortWait();
    cy.logout();
  });
});
