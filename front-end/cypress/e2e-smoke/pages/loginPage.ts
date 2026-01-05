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

const API_BASE_URL = 'http://localhost:8080';

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

function loginViaApi() {
  const requestRedirect = (url: string) =>
    cy.request({
      method: 'GET',
      url,
      followRedirect: false,
    });

  const resolveUrl = (urlOrPath?: string) => {
    if (!urlOrPath) throw new Error('Missing redirect location during API login');
    if (urlOrPath.startsWith('http')) return urlOrPath;
    return `${API_BASE_URL}${urlOrPath.startsWith('/') ? '' : '/'}${urlOrPath}`;
  };

  const cookies: string[] = [];
  const collectCookies = (response: Cypress.Response<any>) => {
    const raw = response.headers['set-cookie'];
    if (Array.isArray(raw)) cookies.push(...raw);
    else if (typeof raw === 'string') cookies.push(raw);
    return response;
  };

  const setCookieFromHeader = (cookieHeader: string) => {
    const parts = cookieHeader.split(';').map((part) => part.trim());
    const [nameValue, ...attrs] = parts;
    const [name, ...valueParts] = nameValue.split('=');
    const value = valueParts.join('=');
    if (!name) return;
    const options: Partial<Cypress.SetCookieOptions> = { path: '/', domain: 'localhost' };
    for (const attr of attrs) {
      const [rawKey, rawVal] = attr.split('=');
      const key = rawKey.toLowerCase();
      if (key === 'path' && rawVal) options.path = rawVal;
      if (key === 'domain' && rawVal) options.domain = rawVal;
      if (key === 'secure') options.secure = false;
      if (key === 'httponly') options.httpOnly = true;
      if (key === 'samesite' && rawVal) options.sameSite = rawVal as Cypress.SameSiteOptions;
    }
    cy.setCookie(name, value, options);
  };

  return requestRedirect(`${API_BASE_URL}/api/v1/oidc/authenticate`)
    .then((response) => requestRedirect(resolveUrl(collectCookies(response).headers['location'] as string)))
    .then((response) => requestRedirect(resolveUrl(collectCookies(response).headers['location'] as string)))
    .then((response) => {
      collectCookies(response);
      return cy.wrap(cookies, { log: false }).each((cookie) => {
        setCookieFromHeader(String(cookie));
      });
    });
}

function loginDotGovLogin() {
  const alias = PageUtils.getAlias('');
  cy.intercept('GET', '**/api/v1/committees/**').as('GetCommitteeAccounts');
  cy.intercept('POST', '**/api/v1/committees/*/activate/**').as('ActivateCommittee');
  cy.intercept('GET', '**/api/v1/committee-members/**').as('GetCommitteeMembers');
  cy.intercept('GET', '**/api/v1/users/get_current/**').as('GetCurrentUser');

  loginViaApi();
  cy.visit('/');
  cy.wait('@GetCurrentUser', { timeout: 20000 });
  cy.window({ timeout: 20000 })
    .its('localStorage')
    .invoke('getItem', 'fecfile_online_userLoginData')
    .should('not.be.null');
  cy.visit('/login/security-notice');
  cy.get('#security-consent-annual').click();
  cy.get('[data-cy="consent-button"]').click();
  cy.wait('@GetCommitteeAccounts', { timeout: 20000 });
  cy.get('.committee-list .committee-info').first().click();
  cy.wait('@ActivateCommittee');

  // Wait for the reports page to load
  cy.contains('Manage reports').should('exist');

  // Creates a second create admin after logging in if necessary
  cy.wait('@GetCommitteeMembers'); // Wait for the guard request to resolve
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
