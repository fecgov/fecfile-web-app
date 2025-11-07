import { LoginPage } from '../../e2e/pages/loginPage';
import { Roles, defaultFormData as userFormData } from '../../e2e/models/UserFormModel';
import { UsersPage } from '../../e2e/pages/usersPage';
import { PageUtils } from '../../e2e/pages/pageUtils';

describe('Manage Users: Happy Paths', () => {
  beforeEach(() => {
    LoginPage.login();
  });

  it('should create a new user as COMMITTEE_ADMINISTRATOR and verify table row', () => {
    const adminUser = { ...userFormData, role: Roles.COMMITTEE_ADMINISTRATOR };
    cy.intercept('GET', '**/committee-members/**').as('GetMembers');

    UsersPage.create(adminUser);
    cy.wait('@GetMembers');

    PageUtils.closeToast();
    UsersPage.assertRow(adminUser, 'Pending');
  });

  it('should create another user as MANAGER and verify immediate visibility', () => {
    const managerUser = { ...userFormData, email: 'manager_user@fec.gov', role: Roles.MANAGER };

    UsersPage.create(managerUser);
    PageUtils.closeToast();
    UsersPage.assertRow(managerUser, 'Pending');
  });

  it('should edit role to both MANAGER and COMMITTEE_ADMINISTRATOR and verify each change', () => {
    const formDataMgr = { ...userFormData, role: Roles.MANAGER };
    UsersPage.editRole(formDataMgr);
    cy.get('[data-cy="membership-submit"]').should('not.be.visible');
    UsersPage.assertRow(formDataMgr);
    const formDataAdm = { ...userFormData, role: Roles.COMMITTEE_ADMINISTRATOR };
    UsersPage.editRole(formDataAdm);
    cy.get('[data-cy="membership-submit"]').should('not.be.visible');
    UsersPage.assertRow(formDataAdm);
  });

  it('should switch committee and validate user persistence', () => {
    PageUtils.switchCommittee('c94c5d1a-9e73-464d-ad72-b73b5d8667a9');
    UsersPage.goToPage();
    PageUtils.urlCheck('/committee/members');
    PageUtils.findOnPage('table tbody', userFormData.email);
  });

  it('should handle multiple user creation in sequence without overlap', () => {
    const users = [
      { ...userFormData, email: 'batch_user1@fec.gov', role: Roles.MANAGER },
      { ...userFormData, email: 'batch_user2@fec.gov', role: Roles.COMMITTEE_ADMINISTRATOR },
    ];

    for (const user of users) {
      UsersPage.create(user);
      PageUtils.closeToast();
      UsersPage.assertRow(user);
    }
  });

  it('should delete a user and verify removal from table', () => {
    const emailToDelete = [userFormData.email, 'batch_user1@fec.gov', 'batch_user2@fec.gov', 'manager_user@fec.gov', ];
    cy.intercept('DELETE', '**/committee-members/**').as('DeleteMember');

    for (const email of emailToDelete) {
      UsersPage.delete(email);
      cy.wait('@DeleteMember');
      cy.get('table tbody tr').contains('td', email).should('not.exist');
    }
  });
});