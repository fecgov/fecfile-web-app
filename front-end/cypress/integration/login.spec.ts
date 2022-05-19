// @ts-check

//Test login information retrieved from environment variables prefixed with "CYPRESS_"
const email: string = Cypress.env('EMAIL');
const committeeID: string = Cypress.env('COMMITTEE_ID');
const testPassword: string = Cypress.env('PASSWORD');
const testPIN: string = Cypress.env('PIN');

//login page form-fields' id's (or classes where elements have no id's)
const fieldEmail: string = '#login-email-id';
const fieldCommittee: string = '#login-committee-id';
const fieldPassword: string = '#login-password';
const fieldLoginButton: string = '.login__btn';
const errorEmail: string = '.error__email-id';
const errorCommitteeID: string = '.error__committee-id';
const errorPassword: string = '.error__password-error';

//two-factor authentication page form-fields' ids
const fieldTwoFactorEmail: string = '#email';
const fieldTwoFactorPhoneText: string = '#phone_number_text';
const fieldTwoFactorPhoneCall: string = '#phone_number_call';
const fieldTwoFactorSubmit: string = '.action__btn.next';
const fieldTwoFactorBack: string = '.action__btn.clear';

//security code page form-fields' ids
const fieldSecurityCodeText: string = '.form-control';
const fieldSecurityCodeNext: string = '.action__btn.next';

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
  });

  it('Fully logs in through Two Factor Authentication with a click', () => {
    loginRequestTwoFactorAuth();

    cy.get(fieldSecurityCodeText).safeType(testPIN);
    cy.get(fieldSecurityCodeNext).click();
    cy.url().should('contain', '/dashboard');
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
