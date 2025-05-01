import { PageUtils } from './pageUtils';

export class ProfileUserListPage {
  static goToPage() {
    const alias = PageUtils.getAlias('');
    cy.visit('/reports');
    cy.get('#navbarProfileDropdownMenuLink').click();
    cy.get(alias).find('.p-popover').contains('Users').click();
    cy.location('pathname').should('include', '/members');
  }
}
