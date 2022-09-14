export function login() {
  //Dummy login information
  const email = Cypress.env('EMAIL');
  const committeeID = Cypress.env('COMMITTEE_ID');
  const testPassword = Cypress.env('PASSWORD');
  const testPIN = Cypress.env('PIN');

  //login page form-fields' id's (or classes where elements have no id's)
  const fieldEmail = '#login-email-id';
  const fieldCommittee = '#login-committee-id';
  const fieldPassword = '#login-password';

  //two-factor authentication page form-fields' ids
  const fieldTwoFactorEmail = '#email';
  const fieldTwoFactorSubmit = '.action__btn.next';

  //security code page form-fields' ids
  const fieldSecurityCodeText = '.form-control';

  cy.fixture("FEC_Get_Committee_Account").then((response_body) => {
    response_body.results[0].committee_id = Cypress.env("COMMITTEE_ID");
    const response = {
      body: response_body,
      statusCode: 200,
    }

    cy.intercept(
      "GET", "https://api.open.fec.gov/v1/committee/*/*",
      response
    ).as("GetCommitteeAccount");
  });
 
  cy.visit('/');

  cy.get(fieldEmail).type(email);
  cy.get(fieldCommittee).type(committeeID);
  cy.get(fieldPassword).type(testPassword).type('{enter}');

  cy.get(fieldTwoFactorEmail).check();
  cy.get(fieldTwoFactorSubmit).click();

  cy.get(fieldSecurityCodeText).type(testPIN).type('{enter}');

  cy.wait('@GetCommitteeAccount');

  cy.wait(1000).then(() => {
    Cypress.env({ AUTH_TOKEN: retrieveAuthToken() });
  });
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
  cy.get('.p-datepicker-year').click();
  cy.shortWait();

  const year: number = dateObj.getFullYear();
  const currentYear: number = currentDate.getFullYear();
  const decadeStart: number = currentYear - (currentYear % 10);
  const decadeEnd: number = decadeStart + 9;
  if (year < decadeStart) {
    for (let i = 0; i < decadeStart - year; i += 10) {
      cy.get('.p-datepicker-prev').click();
      cy.shortWait();
    }
  }
  if (year > decadeEnd) {
    for (let i = 0; i < year - decadeEnd; i += 10) {
      cy.get('.p-datepicker-next').click();
      cy.shortWait();
    }
  }
  cy.get('.p-yearpicker-year').contains(year.toString()).click();
  cy.shortWait();

  //    Choose the month
  const Months: Array<string> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const Month: string = Months[dateObj.getMonth()];
  cy.get('.p-monthpicker-month').contains(Month).click();
  cy.shortWait();

  //    Choose the day
  const Day: string = dateObj.getDate().toString();
  cy.get('td').find('span').not('.p-disabled').parent().contains(Day).click();
  cy.shortWait();
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
