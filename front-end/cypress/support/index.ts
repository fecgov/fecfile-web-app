// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// When a command from ./commands is ready to use, import with `import './commands'` syntax
// import './commands';

/*

    Supporting Functions

*/

function support_login(){

  //Dummy login information
  const email         = Cypress.env("EMAIL");
  const committeeID   = Cypress.env("COMMITTEE_ID");
  const testPassword  = Cypress.env("PASSWORD");
  const testPIN       = Cypress.env("PIN");

  //login page form-fields' id's (or classes where elements have no id's)
  const fieldEmail      = "#login-email-id";
  const fieldCommittee  = "#login-committee-id";
  const fieldPassword   = "#login-password";

  //two-factor authentication page form-fields' ids
  const fieldTwoFactorEmail     = "#email";
  const fieldTwoFactorSubmit    = ".action__btn.next"; 

  //security code page form-fields' ids
  const fieldSecurityCodeText = ".form-control"

  cy.visit("/");
  
  cy.get(fieldEmail)
  .type(email);
  cy.get(fieldCommittee)
  .type(committeeID);
  cy.get(fieldPassword)
  .type(testPassword)
  .type("{enter}");

  cy.get(fieldTwoFactorEmail)
  .check();
  cy.get(fieldTwoFactorSubmit)
  .click();

  cy.get(fieldSecurityCodeText)
  .type(testPIN)
  .type("{enter}");
}

Cypress.Commands.add("login",support_login);