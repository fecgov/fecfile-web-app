type CommitteeMemberApiRow = {
  id?: string;
  email?: string;
};

export class UsersHelpers {
  static readonly emailInput = () => cy.get("@dialog").find("#email").first();
  static readonly submitBtn  = () => cy.get("@dialog").find("[data-cy='membership-submit']");

  private static apiRequest<T = unknown>(method: string, url: string, body?: unknown, failOnStatusCode = true) {
    return cy.getAllCookies().then((cookies) => {
      const cookieHeader = cookies.map((cookie) => `${cookie.name}=${cookie.value}`).join('; ');
      const csrfToken = cookies.find((cookie) => cookie.name === 'csrftoken')?.value ?? '';

      return cy.request<T>({
        method,
        url,
        body,
        failOnStatusCode,
        headers: {
          Cookie: cookieHeader,
          'x-csrftoken': csrfToken,
        },
      });
    });
  }

  static aliasUsersTable() {
    cy.get('table').first().as('table');
  }

  static deleteAllTestUsers() {
    const protectedEmails = new Set(['test@test.com', 'admin@admin.com', 'test333@test.com']);

    return UsersHelpers.apiRequest<CommitteeMemberApiRow[]>(
      'GET',
      'http://localhost:8080/api/v1/committee-members/',
    ).then((response) => {
      const members = Array.isArray(response.body) ? response.body : [];
      const generatedUsers = members.filter((member) => {
        const email = (member.email ?? '').toLowerCase();
        return (
          typeof member.id === 'string' &&
          /^user_.*@fec\.gov$/i.test(email) &&
          !protectedEmails.has(email)
        );
      });

      if (generatedUsers.length === 0) {
        return cy.wrap(null, { log: false });
      }

      return cy.wrap(generatedUsers, { log: false }).each((member) => {
        return UsersHelpers.apiRequest(
          'DELETE',
          `http://localhost:8080/api/v1/committee-members/${member.id}/remove-member/`,
        );
      });
    });
  }

  static assertUsersTableColumns(expected: string[]) {
    cy.get('@table')
      // Use the last header row so multi-row headers don't pollute the list
      .find('thead tr:last-child > th, thead tr:last-child > td')
      .should(($cells) => {
        const actual = [...$cells].map((el) =>
          el.innerText.replaceAll('\u00A0', ' ').replaceAll(/\s+/g, ' ').trim()
        );
  
        // Exact match: same count, same order, same text.
        expect(actual, 'table header columns').to.deep.equal(expected);
      });
  }

  static assertAtLeastOneUserRow() {
    cy.get('@table').find('tbody tr').its('length').should('be.greaterThan', 0);
  }

  static getRowByEmail(email: string) {
    const exactEmail = new RegExp(`^\\s*${Cypress._.escapeRegExp(email)}\\s*$`, 'i');
    return cy.get('@table').contains('tbody tr td', exactEmail).closest('tr');
  }

  static assertNoAddUserButton() {
    const selectors = [
      "[data-cy='membership-add']",
      "button:contains('Add user')",
      "button:contains('Invite')",
      "a:contains('Add user')",
      "a:contains('Invite')",
    ];
    cy.get('body').then(($b) => {
      const found = selectors.some((sel) => $b.find(sel).filter(':visible').length > 0);
      expect(found, 'Add/Invite affordance should NOT be visible').to.be.false;
    });
  }

  static assertNoRowKebabs() {
    cy.get('@table')
      .find('.pi.pi-ellipsis-v, [data-cy="row-kebab"]')
      .should('not.exist');
  }
  
  static readonly assertEnabled = ($el: JQuery<HTMLElement>) => {
      const isAriaDisabled = ($el.attr("aria-disabled") || "").toLowerCase() === "true";
      const isDisabled = $el.is(":disabled");
      const hasClass = $el.hasClass("p-disabled") || $el.hasClass("disabled");
      expect(!(isAriaDisabled || isDisabled || hasClass), "button is enabled").to.eq(true);
  };

  static stubOnce(method: string, url: string, response: Partial<Cypress.StaticResponse>, alias: string) {
      cy.intercept({ method, url, times: 1 }, response).as(alias);
  }
}
