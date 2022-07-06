import { generateContactObject } from '../../support/generators/contacts.spec';
// @ts-check

const candidateTypes: string[] = ['P', 'H', 'S'];

describe('QA Test Script #206 (Sprint 8)', () => {
  for (const candidateType of candidateTypes) {
    context(`${candidateType}-Type Candidate`, (cType = candidateType) => {
      const contact = generateContactObject({ contact_type: 'Candidate' });
      let c_id: string = '';
      if (cType == 'P') {
        c_id = `${cType}12345678`;
      } else if (cType == 'H' || cType == 'S') {
        c_id = `${cType}0AA12345`;
      }

      it('Step 1: Navigate to the Contacts Page', () => {
        cy.login();
        cy.url().should('contain', '/dashboard');
        cy.medWait();
        cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
        cy.url().should('contain', '/reports');
      });

      it('Steps 2-6: Create a "Candidate" type Contact', () => {
        cy.enterContact(contact);
      });

      it("Steps 7-9: Edit the created contact's Candidate ID", () => {
        cy.get('tr').contains('tr', contact['name']).find("p-button[icon='pi pi-pencil']").click();

        cy.shortWait();
        cy.get("input[formControlName='candidate_id']").overwrite(c_id);

        cy.get("button[label='Save']").click();
        cy.longWait();
      });

      it('Step 10: Verify that the Committee ID changed', () => {
        cy.get('tr').contains('tr', contact['name']).find("p-button[icon='pi pi-pencil']").click();

        cy.shortWait();
        cy.get("input[formControlName='candidate_id']").should('have.value', c_id);
        cy.get("button[label='Cancel']").click();
        cy.medWait();
      });

      it('Cleanup', () => {
        cy.get('tr').contains('tr', contact['name']).find("p-button[icon='pi pi-trash']").click();

        cy.shortWait();
        cy.get('button').contains('button', 'Yes').click();
        cy.shortWait();
        cy.logout();
      });
    });
  }
});
