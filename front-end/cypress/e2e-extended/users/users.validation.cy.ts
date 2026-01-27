import { Initialize } from '../../e2e-smoke/pages/loginPage';
import { Roles, defaultFormData as userFormData } from '../../e2e-smoke/models/UserFormModel';
import { UsersPage } from '../../e2e-smoke/pages/usersPage';
import { PageUtils } from '../../e2e-smoke/pages/pageUtils';
import { UsersHelpers } from './users.helpers';
import { SharedHelpers } from '../utils/shared.helpers';

const ADD_MEMBER_POST = '**/committee-members/add-member/**';
const LIST_MEMBERS_GET = '**/committee-members/**';
const DIALOG = "#content-offset app-committee-member-dialog";

describe("Users: Validation and API failure states", () => {
  beforeEach(() => {
    Initialize();
    UsersPage.goToPage();
    UsersHelpers.aliasUsersTable();
  });

  it('shows required inline validation when email is empty', () => {
    UsersPage.goToPage();
    PageUtils.clickButton('Add user');
    cy.get(DIALOG).filter(':visible').first().as('dialog');
    UsersHelpers.emailInput().clear({ force: true }).should('have.value', '');
    UsersHelpers.submitBtn().click();
    UsersHelpers.submitBtn().should('be.visible');
    cy.get('body')
      .find('.p-error')
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
      cy.get('body')
        .find(".p-error")
        .first();

    UsersPage.goToPage();
    PageUtils.clickButton('Add user');
    cy.get(DIALOG).filter(':visible').first().as('dialog');

    for (const badEmail of invalidEmails) {
      UsersHelpers.emailInput().clear({ force: true }).type(badEmail, { delay: 0 });
      UsersHelpers.submitBtn().click();
      UsersHelpers.submitBtn().should('be.visible');
      findEmailError()
        .should('be.visible')
        .and('contain.text', 'This email is invalid');

      UsersHelpers.emailInput().clear({ force: true });
    }
    UsersHelpers.emailInput().should('have.value', '');
  });

  it('should verify results per page dropdown', () => {
    UsersPage.goToPage();
    SharedHelpers.chooseDefaultResultsPerPageOptions();
  });

  it('should verify that toast messages close correctly on all actions', () => {
    const newUser = { ...userFormData, email: 'toast_user@fec.gov', role: Roles.MANAGER };
    UsersPage.create(newUser);
    PageUtils.closeToast();
    PageUtils.findOnPage('table tbody', newUser.email);
    UsersPage.delete(newUser.email);
    PageUtils.closeToast();
  });

  it('should stub 500 on invite, keep submit enabled, then succeed on retry', () => {
    const adminUser = { ...userFormData, role: Roles.COMMITTEE_ADMINISTRATOR };
    UsersHelpers.stubOnce('POST', ADD_MEMBER_POST, { statusCode: 500, body: { message: 'Server error' } }, 'invite500');
    cy.intercept('GET', LIST_MEMBERS_GET).as('GetMembers');
    PageUtils.clickButton('Add user');
    cy.get(DIALOG).filter(':visible').first().as('dialog');
    UsersHelpers.emailInput().clear().type(adminUser.email).should('have.value', adminUser.email);
    UsersHelpers.submitBtn().should((membershipSubmitBtn) => UsersHelpers.assertEnabled(membershipSubmitBtn));
    UsersHelpers.submitBtn().click();
    cy.wait('@invite500').its('response.statusCode').should('eq', 500);
    UsersHelpers.submitBtn().should((membershipSubmitBtn) => UsersHelpers.assertEnabled(membershipSubmitBtn));
    cy.intercept('POST', ADD_MEMBER_POST).as('invite201'); // capture success (no stub)
    UsersHelpers.submitBtn().should((membershipSubmitBtn) => UsersHelpers.assertEnabled(membershipSubmitBtn));
    UsersHelpers.submitBtn().click();
    cy.wait('@invite201').its('response.statusCode').should('be.oneOf', [200, 201]);
    cy.wait('@GetMembers');
    PageUtils.closeToast();
    UsersPage.assertRow(adminUser, 'Pending');
  });


  it('should stub 500 on delete of user, keep row, then succeed on retry @allow-5xx', () => {
    const target = userFormData.email;
    UsersPage.assertRow({ ...userFormData, email: target }, 'Pending');
    cy.intercept(
      { method: 'DELETE', url: '**/committee-members/**', times: 1 },
      { statusCode: 500, body: { message: 'Server error during delete' } },
    ).as('Delete500');
    UsersPage.delete(target);
    cy.wait('@Delete500').its('response.statusCode').should('eq', 500);
    cy.intercept('DELETE', '**/committee-members/**').as('DeleteOK');
    UsersPage.delete(target);
    cy.wait('@DeleteOK').its('response.statusCode').should('be.oneOf', [200, 204]);
    PageUtils.closeToast();
    cy.get('table tbody tr').contains('td', target).should('not.exist');
  });
});
