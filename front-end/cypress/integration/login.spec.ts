// @ts-check

//Test login information retrieved from environment variables prefixed with "CYPRESS_"
const email         = Cypress.env("EMAIL");
const committeeID   = Cypress.env("COMMITTEE_ID");
const testPassword  = Cypress.env("PASSWORD");
const testPIN       = Cypress.env("PIN");

//login page form-fields' id's (or classes where elements have no id's)
const fieldEmail      = "#login-email-id";
const fieldCommittee  = "#login-committee-id";
const fieldPassword   = "#login-password";
const fieldLoginButton= ".login__btn";
const errorEmail      = ".error__email-id";
const errorCommitteeID= ".error__committee-id"
const errorPassword   = ".error__password-error";

//two-factor authentication page form-fields' ids
const fieldTwoFactorEmail     = "#email";
const fieldTwoFactorPhoneText = "#phone_number_text";
const fieldTwoFactorPhoneCall = "#phone_number_call";
const fieldTwoFactorSubmit    = ".action__btn.next"; 
const fieldTwoFactorBack      = ".action__btn.clear";

//security code page form-fields' ids
const fieldSecurityCodeText = ".form-control"
const fieldSecurityCodeNext = ".action__btn.next"

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

//Logs in and requests Two Factor Authentication via Email
function login_request_two_factor_auth(){
  login_no_two_factor();

  cy.get(fieldTwoFactorEmail)
    .check();
  cy.get(fieldTwoFactorSubmit)
    .click();
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

  it.only("Submits Two Factor Auth via email", () => {
    login_no_two_factor();

    cy.get(fieldTwoFactorEmail)
      .check();
    cy.get(fieldTwoFactorSubmit)
      .click();
    cy.url()
      .should('contain',"/confirm-2f");
  });

  it.only("Submits Two Factor Auth via phone, text", () => {
    login_no_two_factor();

    cy.get(fieldTwoFactorPhoneText)
      .check();
    cy.get(fieldTwoFactorSubmit)
      .click();
    cy.url()
      .should('contain',"/confirm-2f");
  });

  it.only("Submits Two Factor Auth via phone, call", () => {
    login_no_two_factor();

    cy.get(fieldTwoFactorPhoneCall)
      .check();
    cy.get(fieldTwoFactorSubmit)
      .click();
    cy.url()
      .should('contain',"/confirm-2f");
  });

  it.only("Fully logs in through Two Factor Authentication with {enter}", () => {
    login_request_two_factor_auth();

    cy.get(fieldSecurityCodeText)
      .type(testPIN)
      .type("{enter}");
    cy.url()
      .should('contain',"/dashboard");
  });

  it.only("Fully logs in through Two Factor Authentication with a click", () => {
    login_request_two_factor_auth();

    cy.get(fieldSecurityCodeText)
      .type(testPIN)
    cy.get(fieldSecurityCodeNext)
      .click();
    cy.url()
      .should('contain',"/dashboard");
  });

  it.only("Fails to login with no included information", () => {
    cy.get(fieldEmail)
      .type("{enter}"); //Submits an empty login form

    cy.url()
      .should("not.contain", "/twoFactLogin")
      .should("not.contain", "/confirm-f")
      .should("not.contain", "/dashboard");
    cy.get(errorEmail)
      .should("contain","Please enter");
    cy.get(errorCommitteeID)
      .should("contain", "Please enter");
    cy.get(errorPassword)
      .should("contain", "Please enter");
  });
});
