// @ts-check

let contacts: object = { Individual: {}, Candidate: {}, Committee: {}, Organization: {} };

describe('QA Test Script #224 (Sprint 7)', () => {
  it('Step 1: Navigate to contacts page', () => {
    cy.login();
    cy.url().should('contain', '/dashboard');
  });

  for (let contactType of Object.keys(contacts)) {
    context(`---> ${contactType}`, (cType = contactType) => {
      it("Step 2: Open the 'Add Contact' form", () => {
        cy.get('.p-menubar').find('.p-menuitem-link').contains('Contacts').click();
        cy.url().should('contain', '/contacts');

        cy.get("button[label='New']").click();
        cy.wait(50);
        cy.get("div[role='dialog']").contains('Add Contact').should('exist');
      });

      it('Steps 3, 4, & 5: Checks that the "street_1" field is labeled "Street Address" instead of "Street"', () => {
        cy.dropdownSetValue("p-dropdown[FormControlName='type']", cType);

        cy.get('#street_1').parent().should('contain', 'STREET ADDRESS');
      });

      it('Closes the form', () => {
        cy.get("button[label='Cancel']").click();
        cy.wait(50);
      });
    });
  }

  it('Step 6: Navigate to Profile->Account', () => {
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Profile').click();

    cy.get('.p-menuitem-text').contains('Account').click();
    cy.get('h1').should('contain', 'Account Info'); //Verify we're on the right page
  });

  it('Step 7: Check that "Form 1" is read only and lists "Street Address" instead of "Street"', () => {
    cy.get('h4').contains('STREET ADDRESS').should('exist');
    cy.get('input').should('not.exist');
  });
});
