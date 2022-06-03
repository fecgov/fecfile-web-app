// @ts-check

import * as generator from '../support/generators/generators.spec';

const states: Array<string> = generator.states.concat(generator.territories);

describe('QA Test Script #182 (Sprint 6)', () => {
  it('Step 1: Navigate to contacts page', () => {
    cy.visit('/dashboard');
    cy.url().should('contain', '/dashboard');
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Contacts').click();
    cy.url().should('contain', '/contacts');
  });

  it('Step 2: Open the "Add Contact" form', () => {
    cy.get('#button-contacts-new').click();
    cy.wait(250);

    cy.get('.p-dialog-header').contains('Add Contact').should('contain', 'Add Contact');
  });

  it('Step 3: Select Contact Type - Candidate', () => {
    cy.get('p-dropdown[formControlName="type"]')
      .click()
      .find('p-dropdownitem')
      .contains('Candidate')
      .click({ force: true });
  });

  it("Step 4: The 'State' field should be empty", () => {
    cy.get("[formcontrolname='state']").should('have.value', '');
  });

  it("Steps 5-8: Open the 'State' dropdown, check for all the relevent states, check that it does not contain 'Armed Forces' entries, and select 'Virginia'", () => {
    cy.get("[formcontrolname='state']").click();

    for (let state of states) {
      cy.get("li[role='option']").contains(state).should('exist');
    }

    cy.get("li[role='option']").should('not.contain', 'Armed Forces').contains('Virginia').click({ force: true });

    cy.get("[formcontrolname='state']").should('contain', 'Virginia');
  });
});
