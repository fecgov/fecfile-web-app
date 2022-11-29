import { generateContactObject } from '../../support/generators/contacts.spec';
// @ts-check

const candidateTypes: string[] = ['Presidential', 'House', 'Senate'];

describe('Tests candidate ID field for different candidate types', () => {
  after(() => {
    cy.login();
    cy.visit('/dashboard');
    cy.deleteAllContacts();
  });

  for (const candidateType of candidateTypes) {
    it(`Tests the candidate ID for ${candidateType} candidates`, () => {
      const contact = generateContactObject({
        contact_type: 'Candidate',
        candidate_office: candidateType,
      });
      let c_id = '';
      if (candidateType[0] == 'P') {
        c_id = `${candidateType[0]}12345678`;
      } else if (candidateType[0] == 'H' || candidateType[0] == 'S') {
        c_id = `${candidateType[0]}0AA12345`;
      }

      //Step 1: Navigate to the Contacts Page
      cy.login();
      cy.visit('/dashboard');
      cy.url().should('contain', '/dashboard');
      cy.medWait();
      cy.get('.p-menubar').find('.p-menuitem-link').contains('Contacts').click();
      cy.url().should('contain', '/contacts');

      //Steps 2-6: Create a "Candidate" type Contact
      cy.createContact(contact);

      //Steps 7-9: Edit the created contact's Candidate ID
      cy.contains('tr', contact['name']).find("p-button[icon='pi pi-pencil']").click();

      cy.shortWait();
      cy.get("input[formControlName='candidate_id']").overwrite(c_id);

      cy.get("button[label='Save']").click();
      cy.longWait();

      //Step 10: Verify that the Committee ID changed
      cy.contains('.p-menuitem-link', 'Dashboard').click();
      cy.shortWait();
      cy.contains('.p-menuitem-link', 'Contacts').click();
      cy.shortWait();

      cy.contains('tr', contact['name']).find("p-button[icon='pi pi-pencil']").click();
      cy.shortWait();
      cy.get("input[formControlName='candidate_id']").should('have.value', c_id);
      cy.get("button[label='Cancel']").click();
      cy.medWait();
    });
  }
});
