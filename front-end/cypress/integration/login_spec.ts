// @ts-check

const email         = Cypress.env("EMAIL");
const committeeID   = Cypress.env("COMMITTEE_ID");
const testPassword  = Cypress.env("PASSWORD");

const fieldEmail      = ".login-email-id";
const fieldCommittee  = ".login-committee-id";
const fieldPassword   = ".login-password";

function fill_login_form(){
  cy.get(fieldEmail)
    .type(email);
  cy.get(fieldCommittee)
    .type(committeeID);
  cy.get(fieldPassword)
    .type(testPassword); 
}

describe('Testing login', () => {
    beforeEach(() => {
      cy.visit('/');
    });
    
  it('Accepts input', () => {
    fill_login_form();
    
    cy.get(fieldEmail)
      .should('have.value', email);
    cy.get(fieldCommittee)
      .should('have.value', committeeID);
    cy.get(fieldPassword)
      .should('have.value', testPassword);
  });

  it('Logs in', () => {
    fill_login_form();

    cy.get(fieldPassword)
      .type('{enter}');
    cy.url()
      .should('contain', "/twoFactLogin");
  });
});
