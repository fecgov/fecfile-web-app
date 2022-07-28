// @ts-check

//Test login information retrieved from environment variables prefixed with "CYPRESS_"
const email: string = Cypress.env('EMAIL');
const committeeID: string = Cypress.env('COMMITTEE_ID');
const testPassword: string = Cypress.env('PASSWORD');
const testPIN: string = Cypress.env('PIN');

//login page form-fields' id's (or classes where elements have no id's)
const fieldEmail = '#login-email-id';
const fieldCommittee = '#login-committee-id';
const fieldPassword = '#login-password';
const fieldLoginButton = '.login__btn';
const errorEmail = '.error__email-id';
const errorCommitteeID = '.error__committee-id';
const errorPassword = '.error__password-error';

//two-factor authentication page form-fields' ids
const fieldTwoFactorEmail = '#email';
const fieldTwoFactorPhoneText = '#phone_number_text';
const fieldTwoFactorPhoneCall = '#phone_number_call';
const fieldTwoFactorSubmit = '.action__btn.next';

//security code page form-fields' ids
const fieldSecurityCodeText = '.form-control';
const fieldSecurityCodeNext = '.action__btn.next';

/*

    Supporting Functions

*/

//Fills the login form's fields with test data *without* submitting the form
function fillLoginForm() {
  cy.get(fieldEmail).safeType(email);
  cy.get(fieldCommittee).safeType(committeeID);
  cy.get(fieldPassword).safeType(testPassword);
}

//Logs in without entering anything for Two Factor Authentication
function loginNoTwoFactor() {
  fillLoginForm();
  cy.get(fieldPassword).safeType('{enter}');
}

//Logs in and requests Two Factor Authentication via Email
function loginRequestTwoFactorAuth() {
  loginNoTwoFactor();

  cy.get(fieldTwoFactorEmail).check();
  cy.get(fieldTwoFactorSubmit).click();
}

/*

    Cypress E2E Tests

*/

describe('Testing login', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Accepts input', () => {
    fillLoginForm();

    cy.get(fieldEmail).should('have.value', email);
    cy.get(fieldCommittee).should('have.value', committeeID);
    cy.get(fieldPassword).should('have.value', testPassword);
  });

  it('Submits Email/committee ID/password with {Enter}', () => {
    fillLoginForm();

    cy.get(fieldPassword).safeType('{enter}');
    cy.url().should('contain', '/twoFactLogin');
  });

  it('Submits Email/committee ID/password with a click', () => {
    fillLoginForm();

    cy.get(fieldLoginButton).click();
    cy.url().should('contain', '/twoFactLogin');
  });

  it('Submits Two Factor Auth via Email', () => {
    loginNoTwoFactor();

    cy.get(fieldTwoFactorEmail).check();
    cy.get(fieldTwoFactorSubmit).click();
    cy.url().should('contain', '/confirm-2f');
  });

  it('Submits Two Factor Auth via phone, text', () => {
    loginNoTwoFactor();

    cy.get(fieldTwoFactorPhoneText).check();
    cy.get(fieldTwoFactorSubmit).click();
    cy.url().should('contain', '/confirm-2f');
  });

  it('Submits Two Factor Auth via phone, call', () => {
    loginNoTwoFactor();

    cy.get(fieldTwoFactorPhoneCall).check();
    cy.get(fieldTwoFactorSubmit).click();
    cy.url().should('contain', '/confirm-2f');
  });

  it('Fully logs in through Two Factor Authentication with {enter}', () => {
    loginRequestTwoFactorAuth();

    cy.get(fieldSecurityCodeText).safeType(testPIN).safeType('{enter}');
    cy.url().should('contain', '/dashboard');
    cy.logout();
  });

  it('Fully logs in through Two Factor Authentication with a click', () => {
    loginRequestTwoFactorAuth();

    cy.get(fieldSecurityCodeText).safeType(testPIN);
    cy.get(fieldSecurityCodeNext).click();
    cy.url().should('contain', '/dashboard');
    cy.logout();
  });

  it('Logs in and checks for Committee Account Details', () => {
    loginRequestTwoFactorAuth();

    cy.get(fieldSecurityCodeText).safeType(testPIN);

    cy.intercept(
      "GET", "https://api.open.fec.gov/v1/committee/*/*"
    ).as("GetCommitteeAccount");

    cy.get(fieldSecurityCodeNext).click();

    cy.wait("@GetCommitteeAccount");
    cy.url().should('contain', '/dashboard');
    cy.get(".committee-banner").contains(committeeID).should("exist");

    cy.logout();
  });

  it('Fails to login with no included information', () => {
    cy.get(fieldEmail).safeType('{enter}'); //Submits an empty login form

    cy.url()
      .should('not.contain', '/twoFactLogin')
      .should('not.contain', '/confirm-f')
      .should('not.contain', '/dashboard');
    cy.get(errorEmail).should('contain', 'Please enter');
    cy.get(errorCommitteeID).should('contain', 'Please enter');
    cy.get(errorPassword).should('contain', 'Please enter');
  });
});
