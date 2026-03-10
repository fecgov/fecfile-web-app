export class UsersHelpers {
  static readonly emailInput = () => cy.get('@dialog').find('[data-cy="committee-members-dialog-email-input"]').first();
  static readonly submitBtn = () => cy.getByDataCy('committee-members-dialog-submit-button');

  static aliasUsersTable() {
    cy.getByDataCy('committee-members-table').as('table');
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
    return cy.get('@table').find('tbody tr').filter((_, tr) => {
      const txt = tr.innerText.toLowerCase();
      return txt.includes(email.toLowerCase());
    });
  }

  static assertNoAddUserButton() {
    cy.get('body').find('[data-cy="committee-members-page-add-user-button"]').should('not.exist');
  }

  static assertNoRowKebabs() {
    cy.get('@table')
      .find('[data-cy$="-actions-button"]')
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
