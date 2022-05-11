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

import {$} from 'jquery'


Cypress.Commands.add("safe_type", {prevSubject:true}, (subject, stringval) => {
  subject = cy.wrap(subject);
  
  if (! isString(stringval)){
    stringval = stringval.toString();
  }

  if (stringval.length != 0) {
    subject.type(stringval);
  }
  else{
    console.log(`Skipped typing into ${subject.toString()}} because the string was empty`);
  }

  return subject; //Allows Cypress methods to chain off of this command like normal (IE Cy.get().safe_type().parent().click() and so on)
});

Cypress.Commands.add("dropdown_set_value", (dropdown, target) => {
  cy.get(dropdown).click();
  cy.get("p-dropdownitem").contains(target).should("exist").click({force:true});
});

Cypress.Commands.add("login", () => {

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

  cy.wait(1000);
});

Cypress.Commands.add("logout", ()=>{
  cy.get(".p-menubar")
    .find(".p-menuitem-link")
    .contains("Profile")
    .click();

  cy.get(".p-menuitem-text")
    .contains("Logout")
    .click();
});


import { watchFile } from "fs";
import { isString } from "lodash";
import { CreateContactIndividual } from "./contacts.spec";
Cypress.Commands.add("CreateContactIndividual", CreateContactIndividual);