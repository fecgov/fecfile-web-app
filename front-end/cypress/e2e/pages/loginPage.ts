// cypress/e2e/pages/loginPage.ts
import { ContactListPage } from './contactListPage';
import { PageUtils } from './pageUtils';
import { ReportListPage } from './reportListPage';

const API_V1 = '**/api/v1';

export class LoginPage {
  static login() {
    const sessionDuration = 10; // minutes
    const intervalString = getLoginIntervalString(sessionDuration);

    cy.session(
      `Login Through ${intervalString}`,
      () => {
        loginDotGovLogin();
      },
      {
        cacheAcrossSpecs: true,
        // Accept cookie-based OR JWT-less profile-based sessions.
        validate: () => {
          cy.getCookies().then((cookies) => {
            const hasSessionCookie = cookies.some((c) => /session/i.test(c.name));
            if (hasSessionCookie) return; // ✅ cookie auth is fine

            // Fallback: profile object in localStorage
            cy.window().then((win) => {
              const raw = win.localStorage.getItem('fecfile_online_userLoginData');
              expect(raw, 'userLoginData present').to.be.ok; // just present
              let parsed: any = null;
              try {
                parsed = raw ? JSON.parse(raw) : null;
              } catch {
                parsed = null;
              }
              // Proof of app session even without a JWT:
              expect(parsed?.email, 'email in userLoginData').to.be.a('string').and.not.be.empty;

              // If a JWT exists, capture it for convenience:
              if (typeof parsed?.token === 'string' && parsed.token) {
                Cypress.env('AUTH_TOKEN', `JWT ${parsed.token}`);
              }
            });
          });
        },
      },
    );

    // After session creation/restoration, set AUTH_TOKEN only if it exists
    cy.then(() => {
      const token = retrieveAuthToken(); // '' if none
      if (token) {
        Cypress.env('AUTH_TOKEN', token);
      }
    });
  }
}

/**
 * Generates a string encoding the time in 24:00 format.
 * The time generated is the current time rounded up to the nearest
 * multiple of `sessionDur` minutes. Used to bucket cy.session keys.
 */
function getLoginIntervalString(sessionDur: number): string {
  const datetime = new Date();
  let hour: number = datetime.getHours();
  let minute: number = sessionDur * (Math.floor(datetime.getMinutes() / sessionDur) + 1);
  if (minute >= 60) {
    minute = 0;
    hour += 1;
  }
  return minute !== 0 ? `${hour}:${minute}` : `${hour}:00`;
}

function loginDotGovLogin() {
  const alias = PageUtils.getAlias('');

  // 🔧 Env-agnostic intercepts (work for http://localhost:8080 and https://stage.fecfile.fec.gov)
  cy.intercept('GET', `${API_V1}/committees/**`).as('GetCommitteeAccounts');
  cy.intercept('POST', `${API_V1}/committees/*/activate/**`).as('ActivateCommittee');
  cy.intercept('GET', `${API_V1}/committee-members/**`).as('GetCommitteeMembers');

  // Visit your app (baseUrl controls local vs stage)
  cy.visit('/');

  // Kick off login — typically a full page redirect (not an XHR), so don't wait on a nav alias
  cy.get('#loginButton').click();

  // Back on app: security notice + consent
  cy.visit('/login/security-notice');
  cy.get('#security-consent-annual').click();
  cy.get('[data-cy="consent-button"]').click();

  // Wait for real XHRs that indicate the app bootstrapped post-login
  cy.wait('@GetCommitteeAccounts', { timeout: 30000 });

  cy.get('.committee-list .committee-info').first().click();
  cy.wait('@ActivateCommittee', { timeout: 30000 });

  // Reports page should load
  cy.contains('Manage reports', { timeout: 30000 }).should('exist');

  // Members lookup can be slow; allow time
  cy.wait('@GetCommitteeMembers', { timeout: 30000 });

  // Creates a second create admin after logging in if necessary
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

function retrieveAuthToken(): string {
  try {
    const storedData = localStorage.getItem('fecfile_online_userLoginData');
    const loginData = storedData ? JSON.parse(storedData) : null;
    return loginData?.token ? `JWT ${loginData.token}` : '';
  } catch {
    return '';
  }
}

export function Initialize() {
  LoginPage.login();
  ReportListPage.deleteAllReports();
  ContactListPage.deleteAllContacts();
}

export function setCommitteeType(committeeType = 'O') {
  const k = 'fecfile_online_committeeAccount';
  const raw = localStorage.getItem(k);
  if (!raw) return;
  const json = JSON.parse(raw);
  json.committee_type = committeeType;
  localStorage.setItem(k, JSON.stringify(json));
}

export function setCommitteeToPTY() {
  const k = 'fecfile_online_committeeAccount';
  const raw = localStorage.getItem(k);
  if (!raw) return;
  const json = JSON.parse(raw);
  json.isPAC = false;
  json.isPTY = true;
  localStorage.setItem(k, JSON.stringify(json));
}

// Optional helper: use in cy.request() etc. to avoid bogus Authorization headers
export function authHeader(): Record<string, string> {
  const t = Cypress.env('AUTH_TOKEN') as string | undefined;
  return t ? { Authorization: t } : {};
}
