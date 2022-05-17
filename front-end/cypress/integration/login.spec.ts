// @ts-check

//Test login information retrieved from environment variables prefixed with "CYPRESS_"
const Email: string = Cypress.env('EMAIL');
const CommitteeID: string = Cypress.env('COMMITTEE_ID');
const TestPassword: string = Cypress.env('PASSWORD');
const TestPIN: string = Cypress.env('PIN');

//login page form-fields' id's (or classes where elements have no id's)
const FieldEmail: string = '#login-email-id';
const FieldCommittee: string = '#login-committee-id';
const FieldPassword: string = '#login-password';
const FieldLoginButton: string = '.login__btn';
const errorEmail: string = '.error__email-id';
const errorCommitteeID: string = '.error__committee-id';
const errorPassword: string = '.error__password-error';

//two-factor authentication page form-fields' ids
const FieldTwoFactorEmail: string = '#email';
const FieldTwoFactorPhoneText: string = '#phone_number_text';
const FieldTwoFactorPhoneCall: string = '#phone_number_call';
const FieldTwoFactorSubmit: string = '.action__btn.next';
const FieldTwoFactorBack: string = '.action__btn.clear';

//security code page form-fields' ids
const FieldSecurityCodeText: string = '.form-control';
const FieldSecurityCodeNext: string = '.action__btn.next';

/*

    Supporting Functions

*/

//Fills the login form's fields with test data *without* submitting the form
function fill_login_form() {
  cy.get(FieldEmail).type(Email);
  cy.get(FieldCommittee).type(CommitteeID);
  cy.get(FieldPassword).type(TestPassword);
}

//Logs in without entering anything for Two Factor Authentication
function login_no_two_factor() {
  fill_login_form();
  cy.get(FieldPassword).type('{enter}');
}

//Logs in and requests Two Factor Authentication via Email
function login_request_two_factor_auth() {
  login_no_two_factor();

  cy.get(FieldTwoFactorEmail).check();
  cy.get(FieldTwoFactorSubmit).click();
}

/*

    Cypress E2E Tests

*/

describe('Testing login', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Accepts input', () => {
    fill_login_form();

    cy.get(FieldEmail).should('have.value', Email);
    cy.get(FieldCommittee).should('have.value', CommitteeID);
    cy.get(FieldPassword).should('have.value', TestPassword);
  });

  it('Submits Email/committee ID/password with {Enter}', () => {
    fill_login_form();

    cy.get(FieldPassword).type('{enter}');
    cy.url().should('contain', '/twoFactLogin');
  });

  it('Submits Email/committee ID/password with a click', () => {
    fill_login_form();

    cy.get(FieldLoginButton).click();
    cy.url().should('contain', '/twoFactLogin');
  });

  it('Submits Two Factor Auth via Email', () => {
    login_no_two_factor();

    cy.get(FieldTwoFactorEmail).check();
    cy.get(FieldTwoFactorSubmit).click();
    cy.url().should('contain', '/confirm-2f');
  });

  it('Submits Two Factor Auth via phone, text', () => {
    login_no_two_factor();

    cy.get(FieldTwoFactorPhoneText).check();
    cy.get(FieldTwoFactorSubmit).click();
    cy.url().should('contain', '/confirm-2f');
  });

  it('Submits Two Factor Auth via phone, call', () => {
    login_no_two_factor();

    cy.get(FieldTwoFactorPhoneCall).check();
    cy.get(FieldTwoFactorSubmit).click();
    cy.url().should('contain', '/confirm-2f');
  });

  it('Fully logs in through Two Factor Authentication with {enter}', () => {
    login_request_two_factor_auth();

    cy.get(FieldSecurityCodeText).type(TestPIN).type('{enter}');
    cy.url().should('contain', '/dashboard');
  });

  it('Fully logs in through Two Factor Authentication with a click', () => {
    login_request_two_factor_auth();

    cy.get(FieldSecurityCodeText).type(TestPIN);
    cy.get(FieldSecurityCodeNext).click();
    cy.url().should('contain', '/dashboard');
  });

  it('Fails to login with no included information', () => {
    cy.get(FieldEmail).type('{enter}'); //Submits an empty login form

    cy.url()
      .should('not.contain', '/twoFactLogin')
      .should('not.contain', '/confirm-f')
      .should('not.contain', '/dashboard');
    cy.get(errorEmail).should('contain', 'Please enter');
    cy.get(errorCommitteeID).should('contain', 'Please enter');
    cy.get(errorPassword).should('contain', 'Please enter');
  });
});
