import { LoginPage } from '../../e2e-smoke/pages/loginPage';
import { Roles, defaultFormData as userFormData } from '../../e2e-smoke/models/UserFormModel';
import { UsersPage } from '../../e2e-smoke/pages/usersPage';
import { PageUtils } from '../../e2e-smoke/pages/pageUtils';
import { SmokeAliases } from '../../e2e-smoke/utils/aliases';

const USERS_MANAGE_ALIAS_SOURCE = 'extendedUsersManage';

const closeToastIfPresent = () => {
  cy.get('body').then(($body) => {
    if ($body.find('.p-toast-close-button:visible').length > 0) {
      cy.get('.p-toast-close-button:visible').first().click();
    }
  });
};

describe('Manage Users: Happy Paths', () => {
  beforeEach(() => {
    LoginPage.login();
  });

  it('should create a new user as COMMITTEE_ADMINISTRATOR and verify table row', () => {
    const adminUser = { ...userFormData, role: Roles.COMMITTEE_ADMINISTRATOR };
    const getMembersAlias = SmokeAliases.network.named('GetMembers', USERS_MANAGE_ALIAS_SOURCE);
    cy.intercept('GET', '**/committee-members/**').as(getMembersAlias);

    UsersPage.create(adminUser);
    cy.wait(`@${getMembersAlias}`);

    closeToastIfPresent();
    UsersPage.assertRow(adminUser, 'Pending');
  });

  it('should create another user as MANAGER and verify immediate visibility', () => {
    const managerUser = { ...userFormData, email: 'manager_user@fec.gov', role: Roles.MANAGER };

    UsersPage.create(managerUser);
    closeToastIfPresent();
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
      closeToastIfPresent();
      UsersPage.assertRow(user);
    }
  });

  it('should delete a user and verify removal from table', () => {
    const emailToDelete = [
      userFormData.email,
      'batch_user1@fec.gov',
      'batch_user2@fec.gov',
      'manager_user@fec.gov',
    ];
    const deleteMemberAlias = SmokeAliases.network.named('DeleteMember', USERS_MANAGE_ALIAS_SOURCE);
    cy.intercept({
      method: 'DELETE',
      url: '**/api/v1/committee-members/**/remove-member/',
      times: 5,
    }).as(deleteMemberAlias);

    for (const email of emailToDelete) {
      UsersPage.goToPage();
      cy.get('table tbody').then(($tbody) => {
        const emailLower = email.toLowerCase();
        const rowExists = [...$tbody.find('tr')].some((row) =>
          row.innerText.toLowerCase().includes(emailLower),
        );

        if (!rowExists) {
          cy.log(`Skipping delete for missing user: ${email}`);
          return;
        }

        PageUtils.clickKababItem(email, 'Delete');
        cy.get('app-confirm-dialog').contains('button', 'Confirm').click();
        cy.wait(`@${deleteMemberAlias}`);
        closeToastIfPresent();
        cy.get('table tbody').should('not.contain', email);
      });
    }
  });
});
