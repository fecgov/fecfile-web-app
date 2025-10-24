import { PageUtils } from '../../e2e/pages/pageUtils';
import { UsersPage } from '../../e2e/pages/usersPage';
import { Initialize } from '../../e2e/pages/loginPage';
import { UsersHelpers } from './users.helpers';

describe('Users Permissions via Committee Switch RBAC', () => {
  beforeEach(() => {
    Initialize();
    PageUtils.switchCommittee('c94c5d1a-9e73-464d-ad72-b73b5d8667a9');
    UsersPage.goToPage();
    UsersHelpers.aliasUsersTable();
  });

  it('switching to committee C99999997 (Manager) hides management actions', () => {
    PageUtils.switchCommittee('7c176dc0-7062-49b5-bc35-58b4ef050d09');
    UsersPage.goToPage();
    UsersHelpers.assertUsersTableColumns(['Name', 'Email', 'Role', 'Status']);
    UsersHelpers.assertNoAddUserButton();
    UsersHelpers.assertNoRowKebabs();
    cy.get('@table').should('be.visible');
    UsersHelpers.assertAtLeastOneUserRow();
  });

  it('Owner row has no action kebab (cannot be deleted)', () => {
    UsersHelpers.getRowByEmail('test@test.com').should('exist');
    UsersHelpers.getRowByEmail('test@test.com').within(() => {
      cy.get('.pi.pi-ellipsis-v, [data-cy="row-kebab"]').should('not.exist');
      cy.contains(/edit role|delete/i).should('not.exist');
    });
  });

  it('Protected user row has no action kebab (cannot be deleted)', () => {
    UsersHelpers.getRowByEmail('admin@admin.com').should('exist');
    UsersHelpers.getRowByEmail('admin@admin.com').within(() => {
      cy.get('.pi.pi-ellipsis-v, [data-cy="row-kebab"]').should('not.exist');
      cy.contains(/edit role|delete/i).should('not.exist');
    });
  });
});