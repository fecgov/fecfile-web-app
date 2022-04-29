// @ts-check

describe('Testing login', () => {
  
  it('Logs in', () => {
    const email = "rlanz@fec.gov";
    const committeeID = "C00601211";
    const testPwd = "test";

    cy.visit('/');
    cy.get('.login-email-id')
      .type(email)
      .should('have.value', email);
    cy.get('.login-committee-id')
      .type(committeeID)
      .should('have.value', committeeID);
    cy.get('.login-password')
      .type(testPwd)
      .should('have.value', testPwd);
  });
});