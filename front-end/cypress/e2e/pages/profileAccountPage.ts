export class ProfileAccountPage {
  static goToPage() {
    cy.visit('/dashboard');
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Profile').click();
    cy.get('[href="/profile/account"]').click();
  }
}
