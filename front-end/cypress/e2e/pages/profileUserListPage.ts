export class ProfileUserListPage {
  static goToPage() {
    cy.visit('/dashboard');
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Profile').click();
    cy.get('[href="/committee/users"]').click();
  }

  static clickAddUserButton() {
    cy.get('button[label="Add User"]').click();
  }
}
