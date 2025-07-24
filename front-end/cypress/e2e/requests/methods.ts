/* eslint-disable @typescript-eslint/no-explicit-any */
import { MockContact } from './library/contacts';
import { F3X, F24 } from './library/reports';

export function makeF3x(f3x: F3X, callback = (response: Cypress.Response<any>) => {}) {
  makeRequestToAPI(
    'POST',
    'http://localhost:8080/api/v1/reports/form-3x/?fields_to_validate=filing_frequency',
    f3x,
    callback,
  );
}

export function makeF24(f24: F24, callback = (response: Cypress.Response<any>) => {}) {
  makeRequestToAPI(
    'POST',
    'http://localhost:8080/api/v1/reports/form-24/?fields_to_validate=report_type_24_48',
    f24,
    callback,
  );
}

export function makeContact(contact: MockContact, callback = (response: Cypress.Response<any>) => {}) {
  makeRequestToAPI('POST', 'http://localhost:8080/api/v1/contacts/', contact, callback);
}

export function makeTransaction(transaction: any, callback = (response: Cypress.Response<any>) => {}) {
  makeRequestToAPI('POST', 'http://localhost:8080/api/v1/transactions/', transaction, callback);
}

export function makeRequestToAPI(
  method: string,
  url: string,

  body: any,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  callback = (response: Cypress.Response<any>) => {},
) {
  cy.getAllCookies().then((cookies: Cypress.ObjectLike[]) => {
    let cookie_obj: any = {};
    cookies.forEach((cookie: Cypress.ObjectLike) => {
      const name = cookie['name'];
      const value = cookie['value'];
      cookie_obj = { ...cookie_obj, [name]: value };
    });

    cy.request({
      method: method,
      url: url,
      body: body,
      headers: {
        Cookie: cookie_obj,
        'x-csrftoken': cookie_obj.csrftoken,
      },
    }).then(callback);
  });
}
