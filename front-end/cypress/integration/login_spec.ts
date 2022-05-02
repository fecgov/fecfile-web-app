// @ts-check

//Test login information retrieved from environment variables prefixed with "CYPRESS_"
const email         = Cypress.env("EMAIL");
const committeeID   = Cypress.env("COMMITTEE_ID");
const testPassword  = Cypress.env("PASSWORD")

//login page form-fields' id's
const fieldEmail      = "#login-email-id";
const fieldCommittee  = "#login-committee-id";
const fieldPassword   = "#login-password";
const fieldLoginButton= ".login__btn"; //The current login button has no id, so its class is used instead

//two-factor authentication page form-fields' ids
const fieldTwoFactorEmail     = "#email";
const fieldTwoFactorPhoneText = "#phone_number_text";
const fieldTwoFactorPhoneCall = "#phone_number_call";

/*

    Supporting Functions

*/

//Fills the login form's fields with test data *without* submitting the form
function fill_login_form(){
  cy.get(fieldEmail)
    .type(email);
  cy.get(fieldCommittee)
    .type(committeeID);
  cy.get(fieldPassword)
    .type(testPassword); 
}

//Logs in without entering anything for Two Factor Authentication
function login_no_two_factor(){
  fill_login_form();
  cy.get(fieldPassword)
    .type("{enter}");
}

/*

    Cypress E2E Tests

*/


describe('Testing login', () => {
    beforeEach(() => {
      cy.visit('/');
    });
    
  it.only('Accepts input', () => {
    fill_login_form();
    
    cy.get(fieldEmail)
      .should('have.value', email);
    cy.get(fieldCommittee)
      .should('have.value', committeeID);
    cy.get(fieldPassword)
      .should('have.value', testPassword);
  });

  it.only('Submits email/committee ID/password with {Enter}', () => {
    fill_login_form();

    cy.get(fieldPassword)
      .type('{enter}');
    cy.url()
      .should('contain', "/twoFactLogin");
  });

  it.only('Submits email/committee ID/password with a click', () => {
    fill_login_form();

    cy.get(fieldLoginButton)
      .click();
    cy.url()
      .should('contain',"/twoFactLogin");
  });

});
