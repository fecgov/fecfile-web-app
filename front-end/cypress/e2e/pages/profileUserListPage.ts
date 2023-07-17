export class ProfileUserListPage {
  static goToPage() {
    cy.visit('/dashboard');
    cy.get('.p-menubar').find('.p-menuitem-link > span > .header-navbar-icon[alt="Profile"]').click();
    cy.get('[href="/committee/users"]').click();
    cy.location('pathname').should('include', '/users');
  }
}
