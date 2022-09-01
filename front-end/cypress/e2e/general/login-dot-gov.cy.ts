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
    cy.contains('button', 'Login with login.gov').click();
    cy.shortWait();
    cy.origin('https://idp.int.identitysandbox.gov/', () => {
      cy.wait(50);
      cy.get('button[type="submit"]').click();
    });
  });
});
