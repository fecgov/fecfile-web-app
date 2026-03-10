import { UserFormData } from '../models/UserFormModel';
import { PageUtils } from './pageUtils';

export class UsersPage {
  private static readonly dialogSelector = 'committee-members-dialog';
  private static readonly roleSelectSelector = '[data-cy="committee-members-dialog-role-select"], app-select[inputid="role"] select';

  static goToPage(alias = '') {
    cy.intercept('GET', 'http://localhost:8080/api/v1/committee-members/?page=1**').as('GetMembers');
    cy.visit('/committee/members');
    cy.wait('@GetMembers');
  }

  static enterFormData(formData: UserFormData, excludeContactType = false, alias = '') {
    alias = PageUtils.getAlias(alias);
    cy.get(alias).find('[data-cy="committee-members-dialog-email-input"], #email').first().safeType(formData['email']);
    UsersPage.selectRole(formData['role'], alias);
  }

  static assertRow(formData: UserFormData, status = 'Pending') {
    cy.getByDataCy('committee-members-table')
      .find('tbody tr')
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
    cy.getByDataCy('committee-members-page-add-user-button').click();
    cy.getByDataCy(UsersPage.dialogSelector).as('dialog');

    UsersPage.enterFormData(fd, false, '@dialog');
    cy.getByDataCy('committee-members-dialog-submit-button').click();
  }


  static editRole(fd: UserFormData, alias = '') {
    UsersPage.goToPage();
    PageUtils.clickKababItem(fd.email, 'Edit Role');
    cy.getByDataCy(UsersPage.dialogSelector).as('dialog');

    UsersPage.selectRole(fd['role'], '@dialog');
    cy.getByDataCy('committee-members-dialog-submit-button').click();
  }

  static delete(email: string) {
    UsersPage.goToPage();
    PageUtils.clickKababItem(email, 'Delete');
    cy.getByDataCy('layout-confirm-dialog-submit-button').click();
  }

  private static selectRole(role: string, alias: string) {
    cy.get(alias)
      .find(UsersPage.roleSelectSelector)
      .first()
      .contains('option', role)
      .then((option) => {
        cy.get(alias).find(UsersPage.roleSelectSelector).first().select(option.val()!, { force: true });
      });
  }
}
