/* eslint-disable @typescript-eslint/no-explicit-any */
import { MockContact } from './library/contacts';
import { F3X, F24 } from './library/reports';

export function makeF3x(
  f3x: F3X,
  callback?: (response: Cypress.Response<any>) => void
) {
  return makeRequestToAPI(
    'POST',
    'http://localhost:8080/api/v1/reports/form-3x/?fields_to_validate=filing_frequency',
    f3x,
    callback
  );
}

export function makeF24(
  f24: F24,
  callback?: (response: Cypress.Response<any>) => void
) {
  return makeRequestToAPI(
    'POST',
    'http://localhost:8080/api/v1/reports/form-24/?fields_to_validate=report_type_24_48',
    f24,
    callback
  );
}

export function makeContact(
  contact: MockContact,
  callback?: (response: Cypress.Response<any>) => void
) {
  return makeRequestToAPI('POST', 'http://localhost:8080/api/v1/contacts/', contact, callback);
}

export function makeTransaction(
  transaction: any,
  callback?: (response: Cypress.Response<any>) => void
) {
  return makeRequestToAPI('POST', 'http://localhost:8080/api/v1/transactions/', transaction, callback);
}

function makeRequestToAPI(
  method: string,
  url: string,
  body: any,
  callback?: (response: Cypress.Response<any>) => void
) {
  return cy.getAllCookies().then((cookies: Cypress.Cookie[]) => {
    const cookieMap = Object.fromEntries(cookies.map(c => [c.name, c.value])) as Record<string, string>;
    const cookieHeader = Object.entries(cookieMap).map(([k, v]) => `${k}=${v}`).join('; ');

    return cy.request({
      method,
      url,
      body,
      headers: {
        Cookie: cookieHeader,
        'x-csrftoken': cookieMap.csrftoken,
      },
    })
    .then((response) => {
      // Fire-and-forget: allow the callback to enqueue cy.* but ignore any return value.
      callback?.(response);

      // IMPORTANT: return a Cypress chainable, not a plain value.
      return cy.wrap(response);
    });
  });
}
