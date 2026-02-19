import { ContactListPage } from './contactListPage';
import { PageUtils } from './pageUtils';
import { ReportListPage } from './reportListPage';
import { SmokeAliases } from '../utils/aliases';

const LOGIN_PAGE_ALIAS_SOURCE = 'loginPage';
const LOGIN_DOT_GOV_ALIAS_SOURCE = 'loginPage.loginDotGovLogin';

export class LoginPage {
  static login() {
    cy.intercept('GET', '**/reports/form-3x/**').as(
      SmokeAliases.network.named('GetForm3X', LOGIN_PAGE_ALIAS_SOURCE),
    );
    cy.intercept('GET', '**/reports/form-1m/**').as(
      SmokeAliases.network.named('GetForm1M', LOGIN_PAGE_ALIAS_SOURCE),
    );
    cy.intercept('GET', '**/reports/form-24/**').as(
      SmokeAliases.network.named('GetForm24', LOGIN_PAGE_ALIAS_SOURCE),
    );
    cy.intercept('GET', '**/reports/form-99/**').as(
      SmokeAliases.network.named('GetForm99', LOGIN_PAGE_ALIAS_SOURCE),
    );

    const sessionDuration = 10; //Login session duration in minutes
    const intervalString = getLoginIntervalString(sessionDuration);
    cy.session(
      `Login Through ${intervalString}`,
      () => {
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

    cy.visit('/');
    cy.wait(`@${SmokeAliases.network.named('GetForm3X', LOGIN_PAGE_ALIAS_SOURCE)}`);
    cy.wait(`@${SmokeAliases.network.named('GetForm1M', LOGIN_PAGE_ALIAS_SOURCE)}`);
    cy.wait(`@${SmokeAliases.network.named('GetForm24', LOGIN_PAGE_ALIAS_SOURCE)}`);
    cy.wait(`@${SmokeAliases.network.named('GetForm99', LOGIN_PAGE_ALIAS_SOURCE)}`);
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
  if (minute === 0) {
    return `${hour}:00`;
  }
  return `${hour}:${minute}`;
}

function loginDotGovLogin() {
  const alias = PageUtils.getAlias('');

  // Intercepts for login
  cy.intercept('GET', 'http://localhost:8080/api/v1/oidc/login-redirect').as(
    SmokeAliases.network.named('GetLoggedIn', LOGIN_DOT_GOV_ALIAS_SOURCE),
  );
  cy.intercept('GET', 'http://localhost:8080/api/v1/committees/').as(
    SmokeAliases.network.named('GetCommitteeAccounts', LOGIN_DOT_GOV_ALIAS_SOURCE),
  );
  cy.intercept('POST', 'http://localhost:8080/api/v1/committees/*/activate/').as(
    SmokeAliases.network.named('ActivateCommittee', LOGIN_DOT_GOV_ALIAS_SOURCE),
  );
  cy.intercept('GET', 'http://localhost:8080/api/v1/committee-members/').as(
    SmokeAliases.network.named('GetCommitteeMembers', LOGIN_DOT_GOV_ALIAS_SOURCE),
  );

  cy.visit('/');
  cy.get('#loginButton').click();
  cy.wait(`@${SmokeAliases.network.named('GetLoggedIn', LOGIN_DOT_GOV_ALIAS_SOURCE)}`);
  cy.visit('/login/security-notice');
  cy.get('#security-consent-annual').click();
  cy.get('[data-cy="consent-button"]').click();
  cy.wait(`@${SmokeAliases.network.named('GetCommitteeAccounts', LOGIN_DOT_GOV_ALIAS_SOURCE)}`);
  cy.get('.committee-list .committee-info').first().click();
  cy.wait(`@${SmokeAliases.network.named('ActivateCommittee', LOGIN_DOT_GOV_ALIAS_SOURCE)}`);

  // Wait for the reports page to load
  cy.contains('Manage reports').should('exist');

  // Creates a second create admin after logging in if necessary
  cy.wait(`@${SmokeAliases.network.named('GetCommitteeMembers', LOGIN_DOT_GOV_ALIAS_SOURCE)}`); // Wait for the guard request to resolve
  cy.get(alias)
    .find('[data-cy="second-committee-email"]')
    .should(Cypress._.noop) // No-op to avoid failure if it doesn't exist
    .then(($email) => {
      if ($email.length) {
        cy.contains('Welcome to FECfile+').should('exist').click(); // Ensures that the modal is in focus
        cy.wrap($email).should('have.value', '');
        cy.wrap($email).clear().type('admin@admin.com'); // Clearing the field makes the typing behavior consistent
        cy.wrap($email).should('have.value', 'admin@admin.com');
        cy.wrap($email).click();
        PageUtils.clickButton('Save');

        cy.get(alias).find('.p-toast-close-button').click();
      }
    });
  cy.contains('Welcome to FECfile+').should('not.exist');
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

function setCommitteeType(committeeType = 'O') {
  const fecfile_online_committeeAccount = localStorage.getItem('fecfile_online_committeeAccount');
  if (!fecfile_online_committeeAccount) return;
  const json = JSON.parse(fecfile_online_committeeAccount);
  json.committee_type = committeeType;
  localStorage.setItem('fecfile_online_committeeAccount', JSON.stringify(json));
}

export function setCommitteeToPTY() {
  const fecfile_online_committeeAccount = localStorage.getItem('fecfile_online_committeeAccount');
  if (!fecfile_online_committeeAccount) return;
  const json = JSON.parse(fecfile_online_committeeAccount);
  json.isPAC = false;
  json.isPTY = true;
  localStorage.setItem('fecfile_online_committeeAccount', JSON.stringify(json));
}
