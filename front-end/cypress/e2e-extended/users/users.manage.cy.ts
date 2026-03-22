import { LoginPage } from '../../e2e-smoke/pages/loginPage';
import { Roles, defaultFormData as userFormData } from '../../e2e-smoke/models/UserFormModel';
import { UsersPage } from '../../e2e-smoke/pages/usersPage';
import { PageUtils } from '../../e2e-smoke/pages/pageUtils';
import { UsersHelpers } from './users.helpers';

const uniqueUser = (overrides: Partial<typeof userFormData> = {}) => ({
  ...userFormData,
  email: `user_${Date.now()}_${Cypress._.random(1000, 9999)}@fec.gov`,
  ...overrides,
});

describe('Manage Users: Happy Paths', () => {
  beforeEach(() => {
    LoginPage.login();
    UsersHelpers.deleteAllTestUsers();
  });

  it('should create a new user as COMMITTEE_ADMINISTRATOR and verify table row', () => {
    const adminUser = uniqueUser({ role: Roles.COMMITTEE_ADMINISTRATOR });
    UsersPage.create(adminUser);
    PageUtils.closeToast();
    UsersPage.assertRow(adminUser, 'Pending');
  });

  it('should create another user as MANAGER and verify immediate visibility', () => {
    const managerUser = uniqueUser({ role: Roles.MANAGER });

    UsersPage.create(managerUser);
    PageUtils.closeToast();
    UsersPage.assertRow(managerUser, 'Pending');
  });

  it('should edit role to both MANAGER and COMMITTEE_ADMINISTRATOR and verify each change', () => {
    const createdUser = uniqueUser();
    UsersPage.create(createdUser);
    PageUtils.closeToast();
    const formDataMgr = { ...createdUser, role: Roles.MANAGER };
    UsersPage.editRole(formDataMgr);
    cy.get('[data-cy="membership-submit"]').should('not.be.visible');
    UsersPage.assertRow(formDataMgr);
    const formDataAdm = { ...createdUser, role: Roles.COMMITTEE_ADMINISTRATOR };
    UsersPage.editRole(formDataAdm);
    cy.get('[data-cy="membership-submit"]').should('not.be.visible');
    UsersPage.assertRow(formDataAdm);
  });

  it('should switch committee and validate user persistence', () => {
    const persistedUser = uniqueUser();
    UsersPage.create(persistedUser);
    PageUtils.closeToast();
    PageUtils.switchCommittee('c94c5d1a-9e73-464d-ad72-b73b5d8667a9');
    UsersPage.goToPage();
    PageUtils.urlCheck('/committee/members');
    PageUtils.findOnPage('table tbody', persistedUser.email);
  });

  it('should handle multiple user creation in sequence without overlap', () => {
    const users = [
      uniqueUser({ role: Roles.MANAGER }),
      uniqueUser({ role: Roles.COMMITTEE_ADMINISTRATOR }),
    ];

    for (const user of users) {
      UsersPage.create(user);
      PageUtils.closeToast();
      UsersPage.assertRow(user);
    }
  });

  it('should delete a user and verify removal from table', () => {
    const usersToDelete = [
      uniqueUser(),
      uniqueUser({ role: Roles.MANAGER }),
      uniqueUser({ role: Roles.COMMITTEE_ADMINISTRATOR }),
      uniqueUser({ role: Roles.MANAGER }),
    ];
    cy.intercept('DELETE', '**/committee-members/**').as('DeleteMember');

    for (const user of usersToDelete) {
      UsersPage.create(user);
      PageUtils.closeToast();
    }

    for (const user of usersToDelete) {
      UsersPage.delete(user.email);
      cy.wait('@DeleteMember');
      UsersPage.goToPage();
      cy.get('table tbody tr').contains('td', user.email).should('not.exist');
    }
  });
});
