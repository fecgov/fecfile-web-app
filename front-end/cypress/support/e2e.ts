/*

  The index file imports commands and adds them to Cypress

*/

import {
  safeType,
  overwrite,
  // dropdownSetValue,
  // calendarSetValue,
  // login,
  // logout,
  runLighthouse,
  // shortWait,
  // medWait,
  // longWait,
} from './commands';
Cypress.Commands.add('safeType', { prevSubject: true }, safeType);
Cypress.Commands.add('overwrite', { prevSubject: true }, overwrite);
// Cypress.Commands.add('dropdownSetValue', dropdownSetValue);
// Cypress.Commands.add('calendarSetValue', calendarSetValue);
// Cypress.Commands.add('login', login);
// Cypress.Commands.add('logout', logout);
Cypress.Commands.add('runLighthouse', runLighthouse);
// Cypress.Commands.add('shortWait', shortWait);
// Cypress.Commands.add('medWait', medWait);
// Cypress.Commands.add('longWait', longWait);

// import { createContact, deleteAllContacts } from './contacts.spec';
// Cypress.Commands.add('createContact', createContact);
// Cypress.Commands.add('deleteAllContacts', deleteAllContacts);

// import {
//   createReport,
//   enterConfirmationDetails,
//   enterFilingDetails,
//   navigateToTransactionManagement,
//   navigateReportSidebar,
//   deleteAllReports,
//   deleteReport,
// } from './reports.spec';
// Cypress.Commands.add('createReport', createReport);
// Cypress.Commands.add('enterConfirmationDetails', enterConfirmationDetails);
// Cypress.Commands.add('enterFilingDetails', enterFilingDetails);
// Cypress.Commands.add('navigateToTransactionManagement', navigateToTransactionManagement);
// Cypress.Commands.add('navigateReportSidebar', navigateReportSidebar);
// Cypress.Commands.add('deleteAllReports', deleteAllReports);
// Cypress.Commands.add('deleteReport', deleteReport);

// import { createTransactionSchA, navigateTransactionAccordion } from './transactions.spec';
// Cypress.Commands.add('createTransactionSchA', createTransactionSchA);
// Cypress.Commands.add('navigateTransactionAccordion', navigateTransactionAccordion);
