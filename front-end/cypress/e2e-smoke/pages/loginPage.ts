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

function logLocationWithDebug(debugApi: boolean, label: string, prefix: string) {
  if (!debugApi) {
    return;
  }
  cy.location('href', { timeout: 20000 }).then((href) => {
    cy.task('debugApi', prefix + ' ' + label + ': ' + href);
  });
}

function loginDotGovLogin() {
  const alias = PageUtils.getAlias('');
  const debugApi = Boolean(Cypress.env('DEBUG_API'));
  const logLocation = (label: string) =>
    logLocationWithDebug(debugApi, label, '[api] location');
  if (debugApi) {
    cy.task('debugApi', '[api] DEBUG_API enabled');
    const attachLogger = (pattern: string) => {
      cy.intercept(pattern, (req) => {
        cy.task('debugApi', '[api] ' + req.method + ' ' + req.url);
        req.on('response', (res) => {
          cy.task('debugApi', '[api] ' + res.statusCode + ' ' + req.method + ' ' + req.url);
        });
      });
    };
    attachLogger('**/api/**');
    attachLogger('**/oidc/**');
    cy.intercept(
      { url: '**/api/v1/reports/**', middleware: true },
      (req) => {
        cy.task('debugApi', '[api][reports] ' + req.method + ' ' + req.url);
        req.on('response', (res) => {
          cy.task('debugApi', '[api][reports] ' + res.statusCode + ' ' + req.method + ' ' + req.url);
        });
        req.continue();
      },
    );
  }

  const isRequestFlowEnabled = () => {
    const value = Cypress.env('OIDC_REQUEST_FLOW');
    if (value === true) {
      return true;
    }
    if (value === false || value === undefined || value === null) {
      return false;
    }
    return String(value).toLowerCase() === 'true' || String(value) === '1';
  };
  const runOidcRequestFlow = () => {
    const apiBase =
      Cypress.env('OIDC_API_BASE') || Cypress.env('API_URL') || 'http://localhost:8080/api/v1';
    const authUrl = apiBase + '/oidc/authenticate';
    const logStep = (label: string, status: number, location?: string) => {
      if (!debugApi) {
        return;
      }
      const locationSuffix = location ? ' -> ' + location : '';
      cy.task('debugApi', '[api] oidc ' + label + ': ' + status + locationSuffix);
    };
    const getLocation = (headers: Record<string, string | string[] | undefined>) => {
      const location = headers['location'] || headers['Location'];
      if (typeof location !== 'string' || !location) {
        throw new Error('Missing OIDC redirect location');
      }
      return location;
    };
    return cy
      .request({ url: authUrl, followRedirect: false })
      .then((res) => {
        const location = getLocation(res.headers);
        logStep('authenticate', res.status, location);
        return cy.request({ url: location, followRedirect: false });
      })
      .then((res) => {
        const location = getLocation(res.headers);
        logStep('authorize', res.status, location);
        return cy.request({ url: location, followRedirect: false });
      })
      .then((res) => {
        const location = getLocation(res.headers);
        logStep('callback', res.status, location);
        return cy.request({ url: location, followRedirect: false });
      })
      .then((res) => {
        const location = getLocation(res.headers);
        logStep('login-redirect', res.status, location);
      });
  };

  cy.visit('/');
  logLocation('before login click');
  const baseOrigin = new URL(Cypress.config('baseUrl') || 'http://localhost:4200').origin;
  if (isRequestFlowEnabled()) {
    if (debugApi) {
      cy.task('debugApi', '[api] OIDC request flow enabled');
    }
    runOidcRequestFlow().then(() => {
      cy.visit('/');
    });
    cy.location('origin', { timeout: 20000 }).should('eq', baseOrigin);
  } else {
    cy.get('#loginButton').click();
    const oidcOrigin = Cypress.env('OIDC_ORIGIN') || 'http://localhost:8080';
    cy.origin(
      oidcOrigin,
      { args: { oidcOrigin } },
      ({ oidcOrigin }) => {
        const authorizePath = '/api/v1/mock_oidc_provider/authorize';
        const callbackPath = '/api/v1/oidc/callback';
        const debugApi = Boolean(Cypress.env('DEBUG_API'));
        const logHref = (label: string) => {
          if (!debugApi) {
            return;
          }
          cy.url({ timeout: 20000 }).then((href) => {
            cy.task('debugApi', '[api] location ' + label + ': ' + href);
          });
        };

        cy.location('origin', { timeout: 20000 }).should('eq', oidcOrigin);
        logHref('oidc origin');
        cy.location('pathname', { timeout: 20000 }).then((pathname) => {
          if (debugApi) {
            cy.task('debugApi', '[api] oidc pathname: ' + pathname);
          }
          if (pathname.includes(authorizePath)) {
            logHref('oidc authorize');
            cy.location('pathname', { timeout: 20000 }).should('include', callbackPath);
            logHref('oidc callback');
            return;
          }
          cy.location('pathname', { timeout: 20000 }).should('include', callbackPath);
          logHref('oidc callback');
        });
      },
    );
    cy.location('origin', { timeout: 20000 }).should('eq', baseOrigin);
  }
  logLocation('after oidc return');
  cy.wait('@GetCurrentUser', { timeout: 20000 });
  cy.window({ timeout: 20000 })
    .its('localStorage')
    .invoke('getItem', 'fecfile_online_userLoginData')
    .should('not.be.null');
  cy.visit('/login/security-notice');
  cy.get('#security-consent-annual').click();
  cy.get('[data-cy="consent-button"]').click();
  cy.wait('@GetCommitteeAccounts');
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
  attachTransactionDiagnostics();
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

function attachTransactionDiagnostics() {
  const debugApi = Boolean(Cypress.env('DEBUG_API'));
  if (!debugApi) {
    return;
  }

  const log = (message: string) => cy.task('debugApi', message);
  const normalizeValue = (value: unknown) => (Array.isArray(value) ? value[0] : value);
  const summarizeBody = (body: unknown) => {
    try {
      const text = JSON.stringify(body);
      return text.length > 1000 ? `${text.slice(0, 1000)}…` : text;
    } catch (error) {
      return '[unserializable]';
    }
  };

  const logFailure = (req: any, res: any) => {
    if (res.statusCode < 500) {
      return;
    }
    const reportId = normalizeValue((req.query || {}).report_id) ?? (req.body as any)?.report_id;
    const schedules = normalizeValue((req.query || {}).schedules);
    const endpoint = req.url.split('?')[0];
    log(
      `[api] transactions ${res.statusCode} ${req.method} ${endpoint} report_id=${reportId ?? 'n/a'} schedules=${schedules ?? 'n/a'}`,
    );
    if (req.method === 'POST') {
      log(`[api] transactions body ${summarizeBody(req.body)}`);
    }
  };

  const attach = (method: Cypress.HttpMethod) => {
    cy.intercept({ method, url: '**/api/v1/transactions/**' }, (req) => {
      req.continue((res) => logFailure(req, res));
    });
  };

  attach('GET');
  attach('POST');
}
