// cypress/e2e/helpers/users.helpers.ts

import { PageUtils } from '../../e2e/pages/pageUtils';
import { UsersPage } from '../../e2e/pages/usersPage';

export class UsersHelpers {
  // ===== Selectors / endpoints =====
  private static readonly INVITE_POST = '**/api/v1/committee-members/**';
  private static readonly DELETE_MEMBER = '**/api/v1/committee-members/**';
  private static readonly LIST_MEMBERS = '**/api/v1/committee-members**';

  // ===== Table helpers (from earlier) =====
  static aliasUsersTable() {
    cy.get('table').first().as('table');
  }

  static assertUsersTableColumns(cols: string[]) {
    UsersHelpers.aliasUsersTable();
    cy.get('@table')
      .find('thead tr th, thead tr td')
      .then(($ths) => {
        const headers = [...$ths].map((el) => (el as HTMLElement).innerText.trim());
        cols.forEach((c) =>
          expect(headers.join(' | ')).to.match(new RegExp(`\\b${c}\\b`, 'i')),
        );
      });
  }

  static assertAtLeastOneUserRow() {
    UsersHelpers.aliasUsersTable();
    cy.get('@table').find('tbody tr').its('length').should('be.greaterThan', 0);
  }

  static getRowByEmail(email: string) {
    return cy.get('@table').find('tbody tr').filter((_, tr) => {
      const txt = (tr as HTMLElement).innerText.toLowerCase();
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
    UsersHelpers.aliasUsersTable();
    cy.get('@table')
      .find('.pi.pi-ellipsis-v, [data-cy="row-kebab"]')
      .should('not.exist');
  }

 
}
