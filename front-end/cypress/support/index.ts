/*

  The index file imports commands and adds them to Cypress

*/

import {
  safeType,
  overwrite,
  dropdownSetValue,
  calendarSetValue,
  login,
  logout,
  shortWait,
  medWait,
  longWait,
} from './commands';
Cypress.Commands.add('safeType', { prevSubject: true }, safeType);
Cypress.Commands.add('overwrite', { prevSubject: true }, overwrite);
Cypress.Commands.add('dropdownSetValue', dropdownSetValue);
Cypress.Commands.add('calendarSetValue', calendarSetValue);
Cypress.Commands.add('login', login);
Cypress.Commands.add('logout', logout);
Cypress.Commands.add('shortWait', shortWait);
Cypress.Commands.add('medWait', medWait);
Cypress.Commands.add('longWait', longWait);

import { enterContact } from './contacts.spec';
Cypress.Commands.add('enterContact', enterContact);

import { enterReport, progressReport, navigateReportSidebar, deleteAllReports, deleteReport } from './reports.spec';
Cypress.Commands.add('enterReport', enterReport);
Cypress.Commands.add('progressReport', progressReport);
Cypress.Commands.add("navigateReportSidebar", navigateReportSidebar);
Cypress.Commands.add('deleteAllReports', deleteAllReports);
Cypress.Commands.add('deleteReport', deleteReport);

import { createTransactionSchA } from './transactions.spec';
Cypress.Commands.add('createTransactionSchA', createTransactionSchA);
