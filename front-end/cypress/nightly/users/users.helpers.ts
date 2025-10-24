export class UsersHelpers {
  // ===== Selectors / endpoints =====
  private static readonly INVITE_POST = '**/api/v1/committee-members/**';
  private static readonly DELETE_MEMBER = '**/api/v1/committee-members/**';
  private static readonly LIST_MEMBERS = '**/api/v1/committee-members**';

  // ===== Table helpers (from earlier) =====
  static aliasUsersTable() {
    cy.get('table').first().as('table');
  }

  static assertUsersTableColumns(expected: string[]) {
    cy.get('@table')
      // Use the last header row so multi-row headers don't pollute the list
      .find('thead tr:last-child > th, thead tr:last-child > td')
      .should(($cells) => {
        const actual = [...$cells].map((el) =>
          el.innerText.replaceAll(/\u00A0/g, ' ').replaceAll(/\s+/g, ' ').trim()
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

 
}
