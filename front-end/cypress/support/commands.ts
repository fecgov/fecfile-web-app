import '@cypress-audit/lighthouse/commands';

/**
 * login()
 *
 * The public-facing login method, accessible using
 * cy.login().  This logs the running e2e test in
 * either creating a new session or retrieving an
 * existing one and saves the authentication token
 * for use in later API calls.
 */
export function login() {
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

function apiLogin() {
  const email = Cypress.env('EMAIL');
  const committeeID = Cypress.env('COMMITTEE_ID');
  const testPassword = Cypress.env('PASSWORD');

  cy.request({
    method: 'POST',
    url: 'http://localhost:8080/api/v1/user/login/authenticate',
    body: {
      password: testPassword,
      username: committeeID + email,
    },
  }).then((resp) => {
    if (resp.body.token) {
      cy.setCookie('user', `%22${resp.body.token}%22`);
      Cypress.env({ AUTH_TOKEN: 'JWT ' + resp.body.token });
      const loginData =
        `{"is_allowed":true,"committee_id":"${committeeID}",` + `"email":"${email}","token":"${resp.body.token}"}`;
      localStorage.setItem('fecfile_online_userLoginData', loginData);
    }
  });
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
    response_body.results[0].committee_id = Cypress.env('COMMITTEE_ID');
    const response = {
      body: response_body,
      statusCode: 200,
    };

    cy.intercept('GET', 'https://api.open.fec.gov/v1/committee/*/*', response).as('GetCommitteeAccount');
  });

  cy.visit('/');
  cy.longWait();

  cy.get(fieldEmail).type(email);
  cy.get(fieldCommittee).type(committeeID);
  cy.get(fieldPassword).type(testPassword).type('{enter}');

  cy.wait('@GetCommitteeAccount');
  cy.longWait();
}

export function logout() {
  cy.get('.p-menubar').find('.p-menuitem-link').contains('Profile').click();
  cy.get('.p-menuitem-text').contains('Logout').click();
}

function retrieveAuthToken() {
  const storedData = localStorage.getItem('fecfile_online_userLoginData');
  const loginData: JSON = JSON.parse(storedData);
  return 'JWT ' + loginData.token;
}

export function getAuthToken() {
  return Cypress.env('AUTH_TOKEN');
}

function safeString(stringVal: string | number | undefined | null): string {
  if (stringVal === null || stringVal === undefined) {
    return '';
  } else {
    return stringVal.toString();
  }
}

export function safeType(prevSubject: any, stringVal: string | number) {
  const subject = cy.wrap(prevSubject);
  const outString: string = safeString(stringVal);

  if (outString.length != 0) {
    subject.type(outString);
  } else {
    console.log(`Skipped typing into ${subject.toString()}} because the string was empty`);
  }

  return subject; //Allows Cypress methods to chain off of this command like normal (IE Cy.get().safe_type().parent().click() and so on)
}

export function overwrite(prevSubject: any, stringVal: string | number) {
  const outString = safeString(stringVal);

  return safeType(prevSubject, '{selectall}{del}' + outString);
}

export function dropdownSetValue(dropdown: string, value: string, wait: boolean = true) {
  cy.get(dropdown).click();
  cy.shortWait();
  cy.get('p-dropdownitem').contains(value).should('exist').click({ force: true });
  if (wait) {
    cy.shortWait();
  }
}

export function calendarSetValue(calendar: string, dateObj: Date = new Date()) {
  const currentDate: Date = new Date();
  cy.get(calendar).click();
  cy.shortWait();

  //    Choose the year
  cy.get('.p-datepicker-year').click({ force: true });
  cy.shortWait();

  const year: number = dateObj.getFullYear();
  const currentYear: number = currentDate.getFullYear();
  const decadeStart: number = currentYear - (currentYear % 10);
  const decadeEnd: number = decadeStart + 9;
  if (year < decadeStart) {
    for (let i = 0; i < decadeStart - year; i += 10) {
      cy.get('.p-datepicker-prev').click({ force: true });
      cy.shortWait();
    }
  }
  if (year > decadeEnd) {
    for (let i = 0; i < year - decadeEnd; i += 10) {
      cy.get('.p-datepicker-next').click({ force: true });
      cy.shortWait();
    }
  }
  cy.get('.p-yearpicker-year').contains(year.toString()).click({ force: true });
  cy.shortWait();

  //    Choose the month
  const Months: Array<string> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const Month: string = Months[dateObj.getMonth()];
  cy.get('.p-monthpicker-month').contains(Month).click({ force: true });
  cy.shortWait();

  //    Choose the day
  const Day: string = dateObj.getDate().toString();
  cy.get('td').find('span').not('.p-disabled').parent().contains(Day).click({ force: true });
  cy.shortWait();
}

export function runLighthouse(directory: string, filename: string) {
  cy.lighthouse(
    {
      performance: 0,
      accessibility: 90,
      'best-practices': 0,
      seo: 0,
      pwa: 0,
    },
    {
      output: 'html',
    }
  ).then(() => {
    cy.exec(`mv lighthouse.html cypress/lighthouse/${directory}/${filename}.html`);
  });
}

// shortWait() is appropriate for waiting for the UI to update after changing a field
export function shortWait(): void {
  cy.wait(100);
}

// medWait() is appropriate for waiting for loading a page or a table
export function medWait(): void {
  cy.wait(250);
}

// longWait() is appropriate for waiting on a database call such as saving a form
export function longWait(): void {
  cy.wait(400);
}
