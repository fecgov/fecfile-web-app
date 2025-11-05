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
  if (minute !== 0) {
    return `${hour}:${minute}`;
  } else {
    return `${hour}:00`;
  }
}

function loginDotGovLogin() {
  const alias = PageUtils.getAlias('');

  // API intercepts used by guards/flows after login
  cy.intercept('GET', 'http://localhost:8080/api/v1/oidc/login-redirect').as('GetLoggedIn');
  cy.intercept('GET', 'http://localhost:8080/api/v1/committees/').as('GetCommitteeAccounts');
  cy.intercept('POST', 'http://localhost:8080/api/v1/committees/*/activate/').as('ActivateCommittee');
  cy.intercept('GET', 'http://localhost:8080/api/v1/committee-members/').as('GetCommitteeMembers');

  cy.visit('/');
  cy.get('#loginButton').click();

  // If the click navigates to login.gov (cross-origin), handle it inside cy.origin
  cy.location('host', { timeout: 30000 }).then((host) => {
    if (host.endsWith('login.gov') || host.endsWith('secure.login.gov')) {
      cy.origin('https://secure.login.gov', () => {
        // Be tolerant: consent may be present or not depending on env. Click if found.
        cy.document({ log: false }).then((doc) => {
          const consent = doc.querySelector('#security-consent-annual') as HTMLInputElement | null;
          if (consent) {
            cy.get('#security-consent-annual', { timeout: 30000 }).check({ force: true });
          }
        });

        // Try common “continue/accept” buttons; keep your app’s data-cy first if present.
        cy.get('body', { timeout: 30000 })
          .then(($body) => {
            const sel =
              '[data-cy="consent-button"]';
            if ($body.find(sel).length) {
              cy.contains(sel, /consent/i).click({ force: true });
            }
          });
      });
      
    } else {
      // Same-origin flow (Chrome/Firefox/Edge)
      cy.wait('@GetLoggedIn');
      cy.visit('/login/security-notice');
      cy.get('#security-consent-annual').click();
      cy.get('[data-cy="consent-button"]').click();
    }
  });

  // Select a committee and finish app-side onboarding
  cy.wait('@GetCommitteeAccounts');
  cy.get('.committee-list .committee-info').first().click();
  cy.wait('@ActivateCommittee');

  // Verify app landed
  cy.contains('Manage reports').should('exist');

  // Optional second admin creation flow (no-op if element absent)
  cy.wait('@GetCommitteeMembers');
  cy.get(alias)
    .find('[data-cy="second-committee-email"]')
    .should(Cypress._.noop)
    .then(($email) => {
      if ($email.length) {
        cy.contains('Welcome to FECfile+').should('exist').click(); // focus modal
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

export function setCommitteeToPTY() {
  const fecfile_online_committeeAccount = localStorage.getItem('fecfile_online_committeeAccount');
  if (!fecfile_online_committeeAccount) return;
  const json = JSON.parse(fecfile_online_committeeAccount);
  json.isPAC = false;
  json.isPTY = true;
  localStorage.setItem('fecfile_online_committeeAccount', JSON.stringify(json));
}
