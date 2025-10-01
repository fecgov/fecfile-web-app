// cypress/e2e/pages/loginPage.ts
import { ContactListPage } from './contactListPage';
import { PageUtils } from './pageUtils';
import { ReportListPage } from './reportListPage';

const API_V1 = '**/api/v1';

// Stable, environment-scoped, versioned ID to prevent collisions across specs/runs
const SESSION_ID = `login:${Cypress.config('baseUrl')}:v2`;

export class LoginPage {
  static login() {
    cy.session(
      SESSION_ID,
      loginDotGovLogin,              // pass the function itself (no inline wrapper)
      {
        cacheAcrossSpecs: true,
        validate: validateAppSession // shared named function (no inline lambda)
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

// removed getLoginIntervalString + the time-bucket logic entirely

// Shared validate function so Cypress sees the *same* function reference/body
function validateAppSession() {
  return cy.getCookies().then((cookies) => {
    const hasSessionCookie = cookies.some((c) => /session/i.test(c.name));
    if (hasSessionCookie) return;

    return cy.window().then((win) => {
      const raw = win.localStorage.getItem('fecfile_online_userLoginData');
      expect(raw, 'userLoginData present').to.be.ok;

      let parsed: any = null;
      try {
        parsed = raw ? JSON.parse(raw) : null;
      } catch {
        parsed = null;
      }

      expect(parsed?.email, 'email in userLoginData').to.be.a('string').and.not.be.empty;
      if (typeof parsed?.token === 'string' && parsed.token) {
        Cypress.env('AUTH_TOKEN', `JWT ${parsed.token}`);
      }
    });
  });
}

function loginDotGovLogin() {
  const alias = PageUtils.getAlias('');

  cy.intercept('GET', `${API_V1}/committees/**`).as('GetCommitteeAccounts');
  cy.intercept('POST', `${API_V1}/committees/*/activate/**`).as('ActivateCommittee');
  cy.intercept('GET', `${API_V1}/committee-members/**`).as('GetCommitteeMembers');

  cy.visit('/');

  cy.get('#loginButton').click();

  cy.visit('/login/security-notice');
  cy.get('#security-consent-annual').click();
  cy.get('[data-cy="consent-button"]').click();

  cy.wait('@GetCommitteeAccounts', { timeout: 30000 });

  cy.get('.committee-list .committee-info').first().click();
  cy.wait('@ActivateCommittee', { timeout: 30000 });

  cy.contains('Manage reports', { timeout: 30000 }).should('exist');

  cy.wait('@GetCommitteeMembers', { timeout: 30000 });

  cy.get(alias)
    .find('[data-cy="second-committee-email"]')
    .should(Cypress._.noop)
    .then(($email) => {
      if ($email.length) {
        cy.contains('Welcome to FECfile+').should('exist').click();
        cy.wrap($email).should('have.value', '');
        cy.wrap($email).clear().type('admin@admin.com');
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
  LoginPage.login();                 // session is now stable across specs
  ReportListPage.deleteAllReports(); // keep cleanup *outside* the session body
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

export function authHeader(): Record<string, string> {
  const t = Cypress.env('AUTH_TOKEN') as string | undefined;
  return t ? { Authorization: t } : {};
}
