import { UserFormData } from '../models/UserFormModel';
import { PageUtils } from './pageUtils';

export class UsersPage {
  static goToPage() {
    cy.visit('/dashboard');
    cy.get('.navbar-nav').find('#navbarProfileDropdownMenuLink').click();
    cy.get('.dropdown-menu', { timeout: 500 }).should('be.visible');
    cy.get('.dropdown-menu').contains('Users').click();
  }

  static enterFormData(formData: UserFormData, excludeContactType = false, alias = '') {
    alias = PageUtils.getAlias(alias);
    cy.get(alias).find('#email').safeType(formData['email']);
    PageUtils.dropdownSetValue("p-select[formcontrolname='role']", formData['role'], alias);
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
    cy.get('table tbody tr')
      .contains('td', fd.email)
      .parent()
      .find('button')
      .then((buttons) => {
        cy.wrap(buttons[0]).click(); // Click ellipsis button
        cy.wrap(buttons[1]).click(); // Click Edit Role button
      });

    PageUtils.dropdownSetValue("p-select[formcontrolname='role']", fd['role'], alias);
    cy.get('[data-cy="membership-submit"]').click();
  }

  static delete(email: string) {
    const alias = PageUtils.getAlias('');
    UsersPage.goToPage();

    cy.get('table tbody tr')
      .contains('td', email)
      .parent()
      .find('button')
      .then((buttons) => {
        cy.wrap(buttons[0]).click();
        cy.wrap(buttons[2]).click();
      });

    cy.get(alias).find('.p-confirmdialog-accept-button').click();
  }
}
