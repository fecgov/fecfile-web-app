import { isString } from 'lodash';
import { EnterContact } from './contacts.spec';
Cypress.Commands.add('EnterContact', EnterContact);

import { EnterReport } from './reports.spec';
Cypress.Commands.add('EnterReport', EnterReport);

/*

    Custom Supporting Functions

*/
Cypress.Commands.add('SafeType', { prevSubject: true }, (Subject: any, StringVal: string | number) => {
  Subject = cy.wrap(Subject);

  if (!isString(StringVal)) {
    StringVal = StringVal.toString();
  }

  if (StringVal.length != 0) {
    Subject.type(StringVal);
  } else {
    console.log(`Skipped typing into ${Subject.toString()}} because the string was empty`);
  }

  return Subject; //Allows Cypress methods to chain off of this command like normal (IE Cy.get().safe_type().parent().click() and so on)
});

Cypress.Commands.add('DropdownSetValue', (Dropdown: string, Value: string) => {
  cy.get(Dropdown).click();
  cy.wait(25);
  cy.get('p-dropdownitem').contains(Value).should('exist').click({ force: true });
});

Cypress.Commands.add('CalendarSetValue', (Calendar: string, DateObj: Date = new Date()) => {
  let CurrentDate: Date = new Date();
  cy.get(Calendar).click();
  cy.wait(25);

  //    Choose the year
  cy.get('.p-datepicker-year').click();
  cy.wait(25);

  const Year: number = DateObj.getFullYear();
  const CurrentYear: number = CurrentDate.getFullYear();
  const DecadeStart: number = CurrentYear - (CurrentYear % 10);
  const DecadeEnd: number = DecadeStart + 9;
  if (Year < DecadeStart) {
    for (let i: number = 0; i < DecadeStart - Year; i += 10) {
      cy.get('.p-datepicker-prev').click();
      cy.wait(25);
    }
  }
  if (Year > DecadeEnd) {
    for (let i: number = 0; i < Year - DecadeEnd; i += 10) {
      cy.get('.p-datepicker-next').click();
      cy.wait(25);
    }
  }
  cy.get('.p-yearpicker-year').contains(Year.toString()).click();
  cy.wait(25);

  //    Choose the month
  const Months: Array<string> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const Month: string = Months[DateObj.getMonth()];
  cy.get('.p-monthpicker-month').contains(Month).click();
  cy.wait(25);

  //    Choose the day
  const Day: string = DateObj.getDate().toString();
  cy.get('td').find('span').not('.p-disabled').parent().contains(Day).click();
  cy.wait(25);
});

Cypress.Commands.add('Login', () => {
  //Dummy login information
  const Email = Cypress.env('EMAIL');
  const CommitteeID = Cypress.env('COMMITTEE_ID');
  const TestPassword = Cypress.env('PASSWORD');
  const TestPIN = Cypress.env('PIN');

  //login page form-fields' id's (or classes where elements have no id's)
  const FieldEmail = '#login-email-id';
  const FieldCommittee = '#login-committee-id';
  const FieldPassword = '#login-password';

  //two-factor authentication page form-fields' ids
  const FieldTwoFactorEmail = '#email';
  const FieldTwoFactorSubmit = '.action__btn.next';

  //security code page form-fields' ids
  const FieldSecurityCodeText = '.form-control';

  cy.visit('/');

  cy.get(FieldEmail).type(Email);
  cy.get(FieldCommittee).type(CommitteeID);
  cy.get(FieldPassword).type(TestPassword).type('{enter}');

  cy.get(FieldTwoFactorEmail).check();
  cy.get(FieldTwoFactorSubmit).click();

  cy.get(FieldSecurityCodeText).type(TestPIN).type('{enter}');

  cy.wait(1000);
});

Cypress.Commands.add('Logout', () => {
  cy.get('.p-menubar').find('.p-menuitem-link').contains('Profile').click();

  cy.get('.p-menuitem-text').contains('Logout').click();
});
