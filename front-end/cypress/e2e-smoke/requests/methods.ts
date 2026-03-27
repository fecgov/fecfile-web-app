/* eslint-disable @typescript-eslint/no-explicit-any */
import { MockContact } from './library/contacts';
import { F3X, F24 } from './library/reports';

function isReportCodeCollision(response: Cypress.Response<any>): boolean {
  const messages = response.body?.report_code;
  return (
    response.status === 400 &&
    Array.isArray(messages) &&
    messages.some((message: unknown) => String(message).includes('Collision with existing report_code and year'))
  );
}

export function makeF3x(
  f3x: F3X,
  callback: (response: Cypress.Response<any>) => void | Cypress.Chainable<any> = () => {},
) {
  const createEndpoint = 'http://localhost:8080/api/v1/reports/form-3x/?fields_to_validate=filing_frequency';
  const reportsListEndpoint = 'http://localhost:8080/api/v1/reports/?page=1&ordering=-coverage_through_date&page_size=100';

  const useExistingConflictingReport = (): Cypress.Chainable<Cypress.Response<any>> => {
    return makeRequestToAPI('GET', reportsListEndpoint, undefined, () => {}, false).then((listResponse) => {
      const reports = listResponse.body?.results ?? [];
      const conflictingReport = reports.find((report: any) => {
        const sameCode = report?.report_code === f3x.report_code;
        const sameYear = String(report?.coverage_through_date ?? '').startsWith(
          String(f3x.coverage_through_date ?? '').slice(0, 4),
        );
        return sameCode && sameYear;
      });

      if (!conflictingReport?.id) {
        throw new Error('makeF3x could not resolve report_code collision: conflicting report id not found');
      }

      return makeRequestToAPI(
        'GET',
        `http://localhost:8080/api/v1/reports/${conflictingReport.id}/`,
        undefined,
        () => {},
        false,
      ).then((existingReportResponse) => {
        if (existingReportResponse.status >= 200 && existingReportResponse.status < 300) {
          callback(existingReportResponse);
          return cy.wrap(existingReportResponse, { log: false });
        }

        throw new Error(
          `makeF3x collision fallback could not fetch existing report id ${conflictingReport.id}: ` +
            `status ${existingReportResponse.status} ${JSON.stringify(existingReportResponse.body)}`,
        );
      });
    });
  };

  const attemptCreate = (): Cypress.Chainable<Cypress.Response<any>> => {
    return makeRequestToAPI('POST', createEndpoint, f3x, () => {}, false).then((response) => {
      if (response.status >= 200 && response.status < 300) {
        callback(response);
        return cy.wrap(response, { log: false });
      }

      if (isReportCodeCollision(response)) {
        return useExistingConflictingReport();
      }

      throw new Error(`makeF3x failed with status ${response.status}: ${JSON.stringify(response.body)}`);
    });
  };

  return attemptCreate();
}

export function makeF24(
  f24: F24,
  callback: (response: Cypress.Response<any>) => void | Cypress.Chainable<any> = () => {},
) {
  return makeRequestToAPI(
    'POST',
    'http://localhost:8080/api/v1/reports/form-24/?fields_to_validate=report_type_24_48',
    f24,
    callback,
  );
}

export function makeContact(
  contact: MockContact,
  callback: (response: Cypress.Response<any>) => void | Cypress.Chainable<any> = () => {},
) {
  return makeRequestToAPI('POST', 'http://localhost:8080/api/v1/contacts/', contact, callback);
}

export function makeTransaction(
  transaction: any,
  callback: (response: Cypress.Response<any>) => void | Cypress.Chainable<any> = () => {},
) {
  return makeRequestToAPI('POST', 'http://localhost:8080/api/v1/transactions/', transaction, callback);
}

function makeRequestToAPI(
  method: string,
  url: string,

  body: any,
  callback: (response: Cypress.Response<any>) => void | Cypress.Chainable<any> = () => {},
  failOnStatusCode = true,
) : Cypress.Chainable<Cypress.Response<any>> {
  return cy.getAllCookies().then((cookies: Cypress.ObjectLike[]) => {
    let cookie_obj: any = {};
    const cookieHeader = cookies
      .map((cookie: Cypress.ObjectLike) => `${cookie['name']}=${cookie['value']}`)
      .join('; ');

    cookies.forEach((cookie: Cypress.ObjectLike) => {
      const name = cookie['name'];
      const value = cookie['value'];
      cookie_obj = { ...cookie_obj, [name]: value };
    });

    return cy.request({
      method: method,
      url: url,
      body: body,
      failOnStatusCode,
      headers: {
        Cookie: cookieHeader,
        'x-csrftoken': cookie_obj.csrftoken,
      },
    }).then((response) => {
      callback(response);
      return cy.wrap(response, { log: false });
    });
  });
}
