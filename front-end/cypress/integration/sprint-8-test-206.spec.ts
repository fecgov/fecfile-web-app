import { generateContactObject } from '../support/generators/contacts.spec';
// @ts-check

const candidateTypes: string[] = ['P', 'H', 'S'];

describe('QA Test Script #206 (Sprint 8)', () => {
  for (let candidateType of candidateTypes) {
    context(`${candidateType}-Type Candidate`, (cType = candidateType) => {
      let contact: object = generateContactObject({ contact_type: 'Candidate' });

      it('Step 1: Navigate to the Contacts Page', () => {
        cy.login();
        cy.url().should('contain', '/dashboard');
        cy.wait(250);
        cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
        cy.url().should('contain', '/reports');
      });

      it('Steps 2-6: Create a "Candidate" type Contact', () => {
        cy.enterContact(contact);
        cy.wait(250);
      });

      it("Steps 7-9: Edit the created contact's Candidate ID", () => {
        cy.get('tr').contains('tr', contact['name']).find("p-button[icon='pi pi-pencil']").click();

        cy.wait(50);
        cy.get("input[formControlName='candidate_id']").overwrite(`${cType}12345678`);

        cy.get("button[label='Save']").click();
        cy.wait(250);
      });

      it('Step 10: Verify that the Committee ID changed', () => {
        cy.get('tr').contains('tr', contact['name']).find("p-button[icon='pi pi-pencil']").click();

        cy.wait(50);
        cy.get("input[formControlName='candidate_id']").should('have.value', `${cType}12345678`);
        cy.get("button[label='Cancel']").click();
        cy.wait(50);
      });

      it('Cleanup', () => {
        cy.get('tr').contains('tr', contact['name']).find("p-button[icon='pi pi-trash']").click();

        cy.wait(50);
        cy.get('button').contains('button', 'Yes').click();
        cy.wait(50);
        cy.logout();
      });
    });
  }
});
