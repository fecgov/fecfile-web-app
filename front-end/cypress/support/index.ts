/*

  The index file imports commands and adds them to Cypress

*/

import { safeType, dropdownSetValue, calendarSetValue, login, logout } from './commands';
Cypress.Commands.add('safeType', { prevSubject: true }, safeType);
Cypress.Commands.add('dropdownSetValue', dropdownSetValue);
Cypress.Commands.add('calendarSetValue', calendarSetValue);
Cypress.Commands.add('login', login);
Cypress.Commands.add('logout', logout);

import { enterContact } from './contacts.spec';
Cypress.Commands.add('enterContact', enterContact);

import { enterReport, deleteAllReports, deleteReport } from './reports.spec';
Cypress.Commands.add('enterReport', enterReport);
Cypress.Commands.add('deleteAllReports', deleteAllReports);
Cypress.Commands.add('deleteReport', deleteReport);
