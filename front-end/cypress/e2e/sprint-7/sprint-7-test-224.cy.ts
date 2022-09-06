// @ts-check

const contacts: object = { Individual: {}, Candidate: {}, Committee: {}, Organization: {} };

describe('QA Test Script #224 (Sprint 7)', () => {
  for (const contactType of Object.keys(contacts)) {
    context(`---> ${contactType}`, (cType = contactType) => {
      it(`Checks that the ${contactType} form is formatted correctly`, () => {
        //Step 1: Navigate to contacts page
        cy.login();
        cy.visit('/dashboard');
        cy.get('.p-menubar').find('.p-menuitem-link').contains('Contacts').click();
        cy.url().should('contain', '/contacts');

        //Step 2: Open the 'Add Contact' form
        cy.get("button[label='New']").click();
        cy.shortWait();
        cy.get("div[role='dialog']").contains('Add Contact').should('exist');

        //Steps 3, 4, & 5: Checks that the "street_1" field is labeled "Street Address" instead of "Street"
        cy.dropdownSetValue("p-dropdown[FormControlName='type']", cType);

        cy.get('#street_1').parent().should('contain', 'STREET ADDRESS');

        //Closes the form
        cy.get("button[label='Cancel']").click();
        cy.shortWait();
      });
    });
  }

  it('Checks that the Account Page has the correct formatting', () => {
    cy.login();
    cy.visit('/dashboard');

    //Step 6: Navigate to Profile->Account
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Profile').click();

    cy.get('.p-menuitem-text').contains('Account').click();
    cy.get('h1').should('contain', 'Account Info'); //Verify we're on the right page

    //Step 7: Check that "Form 1" is read only and lists "Street Address" instead of "Street"
    cy.get('h4').contains('STREET ADDRESS').should('exist');
    cy.get('input').should('not.exist');
  });
});
