import { UserFormData } from '../models/UserFormModel';
import { PageUtils } from './pageUtils';

export class UsersPage {
  private static readonly dialogSelector = '#content-offset app-committee-member-dialog dialog[open]';

  static openAddUserDialog() {
    cy.contains('h1', 'Manage users').should('be.visible');
    cy.get(UsersPage.dialogSelector).should('have.length', 0);
    cy.contains('button.add-button:visible', /^Add user$/)
      .should('have.length', 1)
      .click();
    cy.get(UsersPage.dialogSelector)
      .should('have.length', 1)
      .first()
      .as('dialog');
  }

  static goToPage(alias = '') {
    cy.intercept('GET', '**/committee-members/?page=1**').as('GetMembers');
    cy.visit('/committee/members');
    cy.wait('@GetMembers');
  }

  static enterFormData(formData: UserFormData, excludeContactType = false, alias = '') {
    alias = PageUtils.getAlias(alias);
    cy.get(alias).find('#email').safeType(formData['email']);
    PageUtils.selectDropdownSetValue("app-select[inputid='role']", formData['role'], alias);
  }

  static assertRow(formData: UserFormData, status = 'Pending') {
    cy.get('table tbody tr')
      .contains('td', formData.email)
      .parent()
      .within(() => {
        cy.get('td').eq(1).should('have.text', formData.email);
        cy.get('td').eq(2).should('have.text', formData.role);
        cy.get('td').eq(3).should('have.text', status);
      });
  }

  static create(fd: UserFormData) {
    UsersPage.goToPage();
    cy.intercept('POST', '**/committee-members/add-member/**').as('AddMember');
    cy.intercept('GET', '**/committee-members/?page=1**').as('RefreshMembers');
    UsersPage.openAddUserDialog();
    UsersPage.enterFormData(fd, false, '@dialog');
    cy.get('@dialog').find('[data-cy="membership-submit"]').click();
    cy.wait('@AddMember');
    cy.wait('@RefreshMembers');
    cy.get(UsersPage.dialogSelector).should('have.length', 0);
  }


  static editRole(fd: UserFormData, alias = '') {
    UsersPage.goToPage();
    cy.intercept('PUT', '**/committee-members/**').as('UpdateMember');
    cy.intercept('GET', '**/committee-members/?page=1**').as('RefreshMembers');
    PageUtils.clickKababItem(fd.email, 'Edit Role');
    cy.get(UsersPage.dialogSelector)
      .should('have.length', 1)
      .first()
      .as('dialog');

    PageUtils.selectDropdownSetValue(
      "app-select[inputid='role']",
      fd['role'],
      '@dialog'
    );
    cy.get('@dialog').find('[data-cy="membership-submit"]').click();
    cy.wait('@UpdateMember');
    cy.wait('@RefreshMembers');
    cy.get(UsersPage.dialogSelector).should('have.length', 0);
  }

  static delete(email: string) {
    UsersPage.goToPage();
    PageUtils.clickKababItem(email, 'Delete');
    cy.get('app-confirm-dialog')
      .contains('button', 'Confirm')
      .click();
  }
}
