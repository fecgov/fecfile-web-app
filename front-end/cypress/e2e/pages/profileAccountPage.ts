export class ProfileAccountPage {
  static goToPage() {
    cy.intercept('/profile').as('account');
    cy.visit('/dashboard');
    cy.get('#navbarProfileDropdownMenuLink').click();
    cy.get('[href="/profile/account"]').contains('Account').click();
    cy.location('pathname').should('include', '/account');
  }
}
