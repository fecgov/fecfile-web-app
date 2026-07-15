export class ProfileAccountPage {
  static goToPage() {
    cy.visit('/committee');
    cy.waitForNetworkIdle('GET', '*.js', 2000)
  }
}
