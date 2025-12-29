import { ContactListPage } from './contactListPage';
import { PageUtils } from './pageUtils';
import { ReportListPage } from './reportListPage';

export class LoginPage {
  static login() {
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
  cy.intercept('GET', '**/api/v1/committees*').as('GetCommitteeAccounts');
  cy.intercept('POST', '**/api/v1/committees/*/activate*').as('ActivateCommittee');
  cy.intercept('GET', '**/api/v1/committee-members*').as('GetCommitteeMembers');

  const debugApi =
    Cypress.env('DEBUG_API') === true || Cypress.env('DEBUG_API') === 'true' || Cypress.env('DEBUG_API') === '1';
  const apiLogKey = 'API_LOG_QUEUE';
  const queueApiLog = (message: string) => {
    if (!debugApi) return;
    const logs = (Cypress.env(apiLogKey) as string[] | undefined) ?? [];
    logs.push(message);
    Cypress.env(apiLogKey, logs);
    Cypress.log({ name: 'api', message });
  };
  const flushApiLogs = () => {
    if (!debugApi) return;
    cy.then(() => {
      const logs = (Cypress.env(apiLogKey) as string[] | undefined) ?? [];
      Cypress.env(apiLogKey, []);
      return logs;
    }).then((logs) => {
      let chain = cy.wrap(null, { log: false });
      logs.forEach((message) => {
        chain = chain.then(() => cy.task('api:log', message, { log: false }));
      });
      return chain;
    });
  };

  queueApiLog('[api] DEBUG_API enabled');
  cy.location('href').then((href) => queueApiLog(`[api] location before login click: ${href}`));

  const oidcRoutes = [
    { label: 'authenticate', url: '**/api/v1/oidc/authenticate*' },
    { label: 'authorize', url: '**/api/v1/mock_oidc_provider/authorize*' },
    { label: 'callback', url: '**/api/v1/oidc/callback*' },
    { label: 'login-redirect', url: '**/api/v1/oidc/login-redirect*' },
  ];

  oidcRoutes.forEach(({ label, url }) => {
    cy.intercept('GET', url, (req) => {
      req.on('response', (res) => {
        queueApiLog(
          `[api] oidc ${label}: ${res.statusCode} -> ${res.headers?.['location'] ?? 'n/a'}`,
        );
      });
    });
  });

  cy.visit('/');
  cy.get('#loginButton').click();

  queueApiLog('[api] OIDC request flow enabled');
  cy.origin(
    'http://localhost:8080',
    { args: { debugApi } },
    ({ debugApi }) => {
      cy.location('href', { timeout: 15000 }).then((href) => {
        if (debugApi) {
          Cypress.log({ name: 'api', message: `[api] location during oidc flow: ${href}` });
        }
      });
    },
  );

  cy.location('href', { timeout: 15000 }).should('include', 'localhost:4200');
  cy.location('href').then((href) => queueApiLog(`[api] location after oidc return: ${href}`));
  flushApiLogs();
  cy.visit('/login/security-notice');
  cy.get('#security-consent-annual').click();
  cy.get('[data-cy="consent-button"]').click();
  cy.wait('@GetCommitteeAccounts', { timeout: 15000 });
  cy.get('.committee-list .committee-info').first().click();
  cy.wait('@ActivateCommittee', { timeout: 15000 });

  // Wait for the reports page to load
  cy.contains('Manage reports').should('exist');

  // Creates a second create admin after logging in if necessary
  cy.wait('@GetCommitteeMembers', { timeout: 15000 }); // Wait for the guard request to resolve
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
