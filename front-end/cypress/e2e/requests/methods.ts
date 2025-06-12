export function makeRequestToAPI(
  method: string,
  url: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  callback = (response: Cypress.Response<any>) => {},
) {
  cy.getAllCookies().then((cookies: Cypress.ObjectLike[]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// EVERYTHING AFTER THIS POINT IS NON-FUNCTIONING PROTOTYPE

/*
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setupTestingData(report: any, contacts: any[], transactions: any[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const saved_contacts: any[] = [];

  makeRequestToAPI(
    'POST',
    'http://localhost:8080/api/v1/reports/form-3x/?fields_to_validate=filing_frequency',
    report,
    (response) => {
      const report_id: string = response.body.id;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        makeRequestToAPI('POST', 'http://localhost:8080/api/v1/contacts/', contact, (response) => {
          saved_contacts.push(response.body);
          console.log('PUSH', saved_contacts);
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transactions.forEach((transaction: any) => {
        const saved_contact = saved_contacts
          .filter((contact) => {
            return (
              contact.name == transaction.contact_1.name &&
              contact.first_name == transaction.contact_1.first_name &&
              contact.last_name == transaction.contact_1.last_name
            );
          })
          .pop();
        transaction.contact_1_id = saved_contact.id;
        transaction.report_ids = [report_id];

        makeRequestToAPI('POST', 'http://localhost:8080/api/v1/transactions/', transaction, (response) => {
          console.log(response);
        });
      });
    },
  );
}
*/
