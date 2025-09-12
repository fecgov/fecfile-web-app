import { UserFormData } from '../models/UserFormModel';
import { PageUtils } from './pageUtils';

export class UsersPage {
  static goToPage(alias = '') {
    cy.intercept('GET', 'http://localhost:8080/api/v1/committee-members/?page=1**').as('GetMembers');
    cy.visit('/committee/members');
    cy.wait('@GetMembers');
    cy.wait('@GetMembers');
  }

  static enterFormData(formData: UserFormData, excludeContactType = false, alias = '') {
    alias = PageUtils.getAlias(alias);
    cy.get(alias).find('#email').safeType(formData['email']);
    PageUtils.dropdownSetValue("p-select[ng-reflect-input-id='role']", formData['role'], alias);
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
    PageUtils.clickButton('Add user');
    cy.wait(150);
    UsersPage.enterFormData(fd);
    cy.get('[data-cy="membership-submit"]').click();
  }

  static editRole(fd: UserFormData, alias = '') {
    UsersPage.goToPage();
    PageUtils.clickKababItem(fd.email, 'Edit Role');
    PageUtils.dropdownSetValue("p-select[ng-reflect-input-id='role']", fd['role'], alias);
    cy.get('[data-cy="membership-submit"]').click();
  }

  static delete(email: string) {
    const alias = PageUtils.getAlias('');
    UsersPage.goToPage();
    PageUtils.clickKababItem(email, 'Delete');
    cy.get(alias).find('.p-confirmdialog-accept-button').click();
  }
}
