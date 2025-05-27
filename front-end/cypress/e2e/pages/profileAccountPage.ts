import { PageUtils } from './pageUtils';

export class ProfileAccountPage {
  static goToPage() {
    const alias = PageUtils.getAlias('');
    cy.intercept('/profile').as('account');
    cy.visit('/reports');

    cy.get('#navbarProfileDropdownMenuLink').click({ force: true });
    cy.get(alias).find('.p-popover').contains('Account').click();
    cy.location('pathname').should('include', '/committee');
  }
}
