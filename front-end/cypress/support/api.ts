// cypress/support/api.ts (or wherever your helpers live)
const apiBase = () => Cypress.env('API_ORIGIN') || 'http://localhost:8080';

export class Api {
  static getCsrf() {
    return cy.getCookie('csrftoken').its('value');
  }

  static deleteAllReports() {
    return this.getCsrf().then((csrf) =>
      cy.request({
        method: 'POST',
        url: `${apiBase()}/api/v1/reports/e2e-delete-all-reports/`,
        headers: { 'x-csrftoken': csrf ?? '' },
      }).its('status').should('be.within', 200, 299)
    );
  }

  static deleteAllContacts() {
    return this.getCsrf().then((csrf) =>
      cy.request({
        method: 'POST',
        url: `${apiBase()}/api/v1/contacts/e2e-delete-all-contacts/`,
        headers: { 'x-csrftoken': csrf ?? '' },
      }).its('status').should('be.within', 200, 299)
    );
  }


  // Optional: poll until no contacts are left (guards against async deletes/caching)
  static waitForNoContacts(timeoutMs = 6000, intervalMs = 200) {
    const end = Date.now() + timeoutMs;
    const check = () =>
      cy.request({
        method: 'GET',
        url: `${apiBase()}/api/v1/contacts/?page=1&page_size=1`,
        headers: { 'Cache-Control': 'no-cache' },
      }).then(({ status, body }) => {
        expect(status).to.be.within(200, 299);
        const empty =
          (Array.isArray(body?.results) && body.results.length === 0) ||
          (typeof body?.count === 'number' && body.count === 0);
        if (!empty && Date.now() < end) return cy.wait(intervalMs).then(check);
        expect(empty, 'contacts still present after polling').to.be.true;
      });
    return check();
  }
}