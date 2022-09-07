// @ts-check

import * as generator from '../../support/generators/generators.spec';

const states: Array<string> = generator.states.concat(generator.territories);

describe('QA Test Script #182 (Sprint 6)', () => {
  it('Step 1: Navigate to contacts page', () => {
    cy.login();
    cy.visit('/dashboard');
    cy.url().should('contain', '/dashboard');
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Contacts').click();
    cy.url().should('contain', '/contacts');

    cy.get('#button-contacts-new').click();
    cy.shortWait();

    cy.get('.p-dialog-header').contains('Add Contact').should('contain', 'Add Contact');
    cy.get('p-dropdown[formControlName="type"]')
      .click()
      .find('p-dropdownitem')
      .contains('Candidate')
      .click({ force: true });

    cy.get("[formcontrolname='state']").should('have.value', '');
    cy.get("[formcontrolname='state']").click();
    for (const state of states) {
      cy.get("li[role='option']").contains(state).should('exist');
    }

    cy.get("li[role='option']").should('not.contain', 'Armed Forces').contains('Virginia').click({ force: true });
    cy.get("[formcontrolname='state']").should('contain', 'Virginia');
  });
});
