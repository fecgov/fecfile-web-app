export class ProfileUserListPage {
  static goToPage() {
    cy.visit('/dashboard');
    cy.get('#navbarProfileDropdownMenuLink').click();
    cy.get('[href="/committee/users"]').contains('Users').click();
    cy.location('pathname').should('include', '/users');
  }
}
