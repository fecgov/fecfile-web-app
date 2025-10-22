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

  it('shows required inline validation when email is empty', () => {
    UsersPage.goToPage();

    // Open modal and set a valid role so only email validation triggers
    PageUtils.clickButton('Add user');
    cy.get('#email').clear({ force: true }).should('have.value', '');
    cy.get('[data-cy="membership-submit"]').click();
    cy.get('[data-cy="membership-submit"]').should('be.visible');

    // Inline error should be the required message
    cy.get('body')
      .find("[data-cy='email-error'], [aria-live='assertive'], [role='alert'], .p-message-error, .p-error, .p-inline-message-error")
      .first()
      .should('be.visible')
      .and('contain.text', 'This is a required field.');
  });

  it('shows inline validation message for invalid emails (multiple cases)', () => {
    const invalidEmails = [
      'foo',
      'foo@',
      '@example.com',
      'foo@example',
      'foo@.com',
      'foo@exa mple.com',
    ];
    // 'foo..bar@example.com' and 'foo@example..com' added back in once change to disallow double dots is implemented
    // '.foo@example.com' needed to be re-added once leading dot validation is implemented
    // 'foo@-example.com' and 'foo@example-.com' to be re-added once leading/trailing hyphen validation is implemented
    const findEmailError = () =>
      cy
        .get('body')
        .find(
          "[data-cy='email-error'], [aria-live='assertive'], [role='alert'], .p-message-error, .p-error, .p-inline-message-error"
        )
        .first();

    UsersPage.goToPage();
    PageUtils.clickButton('Add user');
    cy.wait(150);
    invalidEmails.forEach((badEmail) => {
      cy.get('#email').clear({ force: true }).type(badEmail, { delay: 0 });
      cy.get('[data-cy="membership-submit"]').click();
      cy.get('[data-cy="membership-submit"]').should('be.visible');
      findEmailError().should('be.visible').and('contain.text', 'This email is invalid');
      cy.get('#email').clear({ force: true });
    });
    cy.get('#email').should('have.value', '');
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

    users.forEach((user) => {
      UsersPage.create(user);
      PageUtils.closeToast();
      UsersPage.assertRow(user);
    });
  });

  it('should verify results per page dropdown', () => {
    UsersPage.goToPage();
    cy.get('#pn_id_8 > div').as('resultsPerPageDropdown');
    cy.get('@resultsPerPageDropdown').click();
    PageUtils.dropdownSetValue('#pn_id_8_0', '5');
    cy.get('@resultsPerPageDropdown').click();
    PageUtils.dropdownSetValue('#pn_id_8_1', '10');
    cy.get('@resultsPerPageDropdown').click();
    PageUtils.dropdownSetValue('#pn_id_8_2', '15');
    cy.get('@resultsPerPageDropdown').click();
    PageUtils.dropdownSetValue('#pn_id_8_3', '20');
  });

  it('should delete a user and verify removal from table', () => {
    const emailToDelete = [userFormData.email, 'batch_user1@fec.gov', 'batch_user2@fec.gov', 'manager_user@fec.gov', ];
    for (let i = 0; i < emailToDelete.length; i++) {
      cy.intercept('DELETE', '**/committee-members/**').as('DeleteMember');
      UsersPage.delete(emailToDelete[i]);
      cy.wait('@DeleteMember');
      cy.get('table tbody tr').contains('td', emailToDelete[i]).should('not.exist');
    }
  });

  it('should verify that toast messages close correctly on all actions', () => {
    const newUser = { ...userFormData, email: 'toast_user@fec.gov', role: Roles.MANAGER };

    UsersPage.create(newUser);
    PageUtils.closeToast();

    PageUtils.findOnPage('table tbody', newUser.email);
    UsersPage.delete(newUser.email);
    PageUtils.closeToast();
  });
});

