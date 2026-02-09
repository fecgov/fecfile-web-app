/* eslint-disable @typescript-eslint/no-explicit-any */
import { MockContact } from './library/contacts';
import { F3X, F24 } from './library/reports';
import { ApiUtils } from '../utils/api';

export function makeF3x(f3x: F3X, callback = (response: Cypress.Response<any>) => {}) {
  return makeRequestToAPI(
    'POST',
    ApiUtils.apiPath('/reports/form-3x/?fields_to_validate=filing_frequency'),
    f3x,
    callback,
  );
}

export function makeF24(f24: F24, callback = (response: Cypress.Response<any>) => {}) {
  return makeRequestToAPI(
    'POST',
    ApiUtils.apiPath('/reports/form-24/?fields_to_validate=report_type_24_48'),
    f24,
    callback,
  );
}

export function makeContact(contact: MockContact, callback = (response: Cypress.Response<any>) => {}) {
  return makeRequestToAPI('POST', ApiUtils.apiPath('/contacts/'), contact, callback);
}

export function makeTransaction(transaction: any, callback = (response: Cypress.Response<any>) => {}) {
  return makeRequestToAPI('POST', ApiUtils.apiPath('/transactions/'), transaction, callback);
}

function makeRequestToAPI(
  method: string,
  url: string,

  body: any,
  callback = (response: Cypress.Response<any>) => {},
) {
  return cy.apiRequestWithCookies({ method, url, body }).then(callback);
}
