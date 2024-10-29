import { ContactListPage } from './contactListPage';
import { ReportListPage } from './reportListPage';

export class LoginPage {
  static login() {
    const sessionDuration = 10; //Login session duration in minutes
    const intervalString = getLoginIntervalString(sessionDuration);
    cy.session(
      `Login Through ${intervalString}`,
      () => {
        //apiLogin();
        //legacyLogin();
        loginDotGovLogin();
      },
      {
        cacheAcrossSpecs: true,
      },
    );

    //Retrieve the AUTH TOKEN from the created/restored session
    cy.then(() => {
      Cypress.env({ AUTH_TOKEN: retrieveAuthToken() });
    });
  }
}

/**
 * getLoginIntervalString
 *
 * Generates a string encoding the time in 24:00 format.
 * The time generated is the current time rounded up to
 * the nearest multiple of `sessionDur` minutes.
 *
 * This string is used when saving a login session so that
 * it can be retrieved later without accidentally retrieving
 * an expired session.
 *
 * @param sessionDur the length in minutes where a session
 *                   should be able to be retrieved.
 * @returns         `HH:MM` where the minute mark is a
 *                   multiple of sessionDur.
 */
function getLoginIntervalString(sessionDur: number): string {
  const datetime = new Date();
  let hour: number = datetime.getHours();
  let minute: number = sessionDur * (Math.floor(datetime.getMinutes() / sessionDur) + 1);
  if (minute >= 60) {
    minute = 0;
    hour += 1;
  }
  if (minute !== 0) {
    return `${hour}:${minute}`;
  } else {
    return `${hour}:00`;
  }
}

function loginDotGovLogin() {
  cy.intercept('GET', 'http://localhost:8080/api/v1/oidc/login-redirect').as('GetLoggedIn');
  cy.intercept('GET', 'http://localhost:8080/api/v1/committees/').as('GetCommitteeAccounts');
  cy.intercept('POST', 'http://localhost:8080/api/v1/committees/*/activate/').as('ActivateCommittee');

  cy.visit('/');
  cy.get('#dropdownMenuButton').click();
  cy.get('[data-test="login-dot-gov-login-button"]').click();
  cy.wait('@GetLoggedIn');
  cy.visit('/login/security-notice');
  cy.get('.p-checkbox-box').click();
  cy.get('[data-test="consent-button"]').click();
  cy.wait('@GetCommitteeAccounts');
  cy.get('.committee-list .committee-info').first().click();
  cy.wait('@ActivateCommittee');
  //cy.visit('/dashboard');
}

function retrieveAuthToken() {
  const storedData = localStorage.getItem('fecfile_online_userLoginData');
  const loginData = JSON.parse(storedData ?? '');
  return 'JWT ' + loginData.token;
}

export function Initialize() {
  LoginPage.login();
  ReportListPage.deleteAllReports();
  ContactListPage.deleteAllContacts();
}

export function setCommitteeType(committeeType = 'O') {
  const fecfile_online_committeeAccount = localStorage.getItem('fecfile_online_committeeAccount');
  if (!fecfile_online_committeeAccount) return;
  const json = JSON.parse(fecfile_online_committeeAccount);
  json.committee_type = committeeType;
  localStorage.setItem('fecfile_online_committeeAccount', JSON.stringify(json));
}
