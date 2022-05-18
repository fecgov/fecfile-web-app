import { isString } from 'lodash';
import { enterContact } from './contacts.spec';
Cypress.Commands.add('enterContact', enterContact);

import { enterReport } from './reports.spec';
Cypress.Commands.add('enterReport', enterReport);

/*

    Custom Supporting Functions

*/
Cypress.Commands.add('safeType', { prevSubject: true }, (subject: any, stringVal: string | number) => {
  subject = cy.wrap(subject);

  if (!isString(stringVal)) {
    stringVal = stringVal.toString();
  }

  if (stringVal.length != 0) {
    subject.type(stringVal);
  } else {
    console.log(`Skipped typing into ${subject.toString()}} because the string was empty`);
  }

  return subject; //Allows Cypress methods to chain off of this command like normal (IE Cy.get().safe_type().parent().click() and so on)
});

Cypress.Commands.add('dropdownSetValue', (dropdown: string, value: string) => {
  cy.get(dropdown).click();
  cy.wait(25);
  cy.get('p-dropdownitem').contains(value).should('exist').click({ force: true });
});

Cypress.Commands.add('calendarSetValue', (calendar: string, dateObj: Date = new Date()) => {
  let currentDate: Date = new Date();
  cy.get(calendar).click();
  cy.wait(25);

  //    Choose the year
  cy.get('.p-datepicker-year').click();
  cy.wait(25);

  const year: number = dateObj.getFullYear();
  const currentYear: number = currentDate.getFullYear();
  const decadeStart: number = currentYear - (currentYear % 10);
  const decadeEnd: number = decadeStart + 9;
  if (year < decadeStart) {
    for (let i: number = 0; i < decadeStart - year; i += 10) {
      cy.get('.p-datepicker-prev').click();
      cy.wait(25);
    }
  }
  if (year > decadeEnd) {
    for (let i: number = 0; i < year - decadeEnd; i += 10) {
      cy.get('.p-datepicker-next').click();
      cy.wait(25);
    }
  }
  cy.get('.p-yearpicker-year').contains(year.toString()).click();
  cy.wait(25);

  //    Choose the month
  const Months: Array<string> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const Month: string = Months[dateObj.getMonth()];
  cy.get('.p-monthpicker-month').contains(Month).click();
  cy.wait(25);

  //    Choose the day
  const Day: string = dateObj.getDate().toString();
  cy.get('td').find('span').not('.p-disabled').parent().contains(Day).click();
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
