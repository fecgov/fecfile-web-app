export class ProfileAccountPage {
  static goToPage() {
    cy.intercept('/profile').as('account');
    cy.visit('/dashboard');
    cy.get('.p-menubar').find('.p-menuitem-link > span > .header-navbar-icon[alt="Profile"]').click();
    cy.get('[href="/profile/account"]').click();
    cy.location('pathname').should('include', '/account');
  }
}
