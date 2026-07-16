export class ProfileUserListPage {
  static goToPage() {
    cy.visit('/committee/members');
    cy.waitForNetworkIdle('GET', '*.js', 2000)
  }
}
