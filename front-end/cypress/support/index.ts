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
Cypress.Commands.add('safe_type', { prevSubject: true }, (subject, stringval) => {
  subject = cy.wrap(subject);

  if (!isString(stringval)) {
    stringval = stringval.toString();
  }

  if (stringval.length != 0) {
    subject.type(stringval);
  } else {
    console.log(`Skipped typing into ${subject.toString()}} because the string was empty`);
  }

  return subject; //Allows Cypress methods to chain off of this command like normal (IE Cy.get().safe_type().parent().click() and so on)
});

Cypress.Commands.add('dropdown_set_value', (dropdown, value) => {
  cy.get(dropdown).click();
  cy.wait(25);
  cy.get('p-dropdownitem').contains(value).should('exist').click({ force: true });
});

Cypress.Commands.add('calendar_set_value', (calendar, date = new Date()) => {
  var current_date = new Date();
  cy.get(calendar).click();
  cy.wait(25);

  //    Choose the year
  cy.get('.p-datepicker-year').click();
  cy.wait(25);

  const year = date.getFullYear();
  const current_year = current_date.getFullYear();
  const decade_start = current_year - (current_year % 10);
  const decade_end = decade_start + 9;
  if (year < decade_start) {
    for (var i = 0; i < decade_start - year; i += 10) {
      cy.get('.p-datepicker-prev').click();
      cy.wait(25);
    }
  }
  if (year > decade_end) {
    for (var i = 0; i < year - decade_end; i += 10) {
      cy.get('.p-datepicker-next').click();
      cy.wait(25);
    }
  }
  cy.get('.p-yearpicker-year').contains(year.toString()).click();
  cy.wait(25);

  //    Choose the month
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  cy.get('.p-monthpicker-month').contains(month).click();
  cy.wait(25);

  //    Choose the day
  const day = date.getDate().toString();
  cy.get('td').find('span').not('.p-disabled').parent().contains(day).click();
  cy.wait(25);
});

Cypress.Commands.add('login', () => {
  //Dummy login information
  const email = Cypress.env('EMAIL');
  const committeeID = Cypress.env('COMMITTEE_ID');
  const testPassword = Cypress.env('PASSWORD');
  const testPIN = Cypress.env('PIN');

  //login page form-fields' id's (or classes where elements have no id's)
  const fieldEmail = '#login-email-id';
  const fieldCommittee = '#login-committee-id';
  const fieldPassword = '#login-password';

  //two-factor authentication page form-fields' ids
  const fieldTwoFactorEmail = '#email';
  const fieldTwoFactorSubmit = '.action__btn.next';

  //security code page form-fields' ids
  const fieldSecurityCodeText = '.form-control';

  cy.visit('/');

  cy.get(fieldEmail).type(email);
  cy.get(fieldCommittee).type(committeeID);
  cy.get(fieldPassword).type(testPassword).type('{enter}');

  cy.get(fieldTwoFactorEmail).check();
  cy.get(fieldTwoFactorSubmit).click();

  cy.get(fieldSecurityCodeText).type(testPIN).type('{enter}');

  cy.wait(1000);
});

Cypress.Commands.add('logout', () => {
  cy.get('.p-menubar').find('.p-menuitem-link').contains('Profile').click();

  cy.get('.p-menuitem-text').contains('Logout').click();
});

import { isString } from 'lodash';

import { EnterContact } from './contacts.spec';
Cypress.Commands.add('EnterContact', EnterContact);

import { EnterReport } from './reports.spec';
Cypress.Commands.add('EnterReport', EnterReport);
