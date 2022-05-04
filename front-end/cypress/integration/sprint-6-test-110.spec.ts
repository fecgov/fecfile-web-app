// @ts-check

describe('Testing login', () => {
  beforeEach(() => {
    cy.login();
  });

  it.only('Visit contacts page', () => {
      cy.url()
      .should("contain","/dashboard");
      cy.visit("/contacts");
  });

});