export class LoginPage {
  static login() {
    const sessionDuration = 10; //Login session duration in minutes
    const intervalString = getLoginIntervalString(sessionDuration);
    cy.session(
      `Login Through ${intervalString}`,
      () => {
        //apiLogin();
        legacyLogin();
      },
      {
        cacheAcrossSpecs: true,
      }
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

function legacyLogin() {
  //Dummy login information
  const email = Cypress.env('EMAIL');
  const committeeID = Cypress.env('COMMITTEE_ID');
  const testPassword = Cypress.env('PASSWORD');

  //login page form-fields' id's (or classes where elements have no id's)
  const fieldEmail = '#login-email-id';
  const fieldCommittee = '#login-committee-id';
  const fieldPassword = '#login-password';

  cy.fixture('FEC_Get_Committee_Account').then((response_body) => {
    response_body.results[0].committee_id = committeeID; 
    const response = {
      body: response_body,
      statusCode: 200,
    };

    cy.intercept(
      'GET',
      `http://localhost:8080/api/v1/openfec/${response_body.results[0].committee_id}/committee/`,
      response
    ).as('GetCommitteeAccount');
  });

  cy.visit('/');
  cy.get(fieldEmail).type(email);
  cy.get(fieldCommittee).type(committeeID);
  cy.get(fieldPassword).type(testPassword).type('{enter}');
  cy.wait('@GetCommitteeAccount');
}

function retrieveAuthToken() {
  const storedData = localStorage.getItem('fecfile_online_userLoginData');
  const loginData = JSON.parse(storedData ?? '');
  return 'JWT ' + loginData.token;
}
