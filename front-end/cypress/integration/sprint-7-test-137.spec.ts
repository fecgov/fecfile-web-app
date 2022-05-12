// @ts-check

describe('QA Test Script #137 (Sprint 7)', () => {
  it('Step 1: Navigate to contacts page', () => {
    cy.visit('/dashboard');
    cy.url().should('contain', '/dashboard');
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Contacts').click();
    cy.url().should('contain', '/contacts');
  });

  it('Step 2: Open a New Contact', () => {
    cy.get("button[label='New']").click();
    cy.wait(50);
    cy.get("div[role='dialog']").contains('Add Contact').should('exist');
  });
});
