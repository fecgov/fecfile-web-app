export class ProfileAccountPage {
  static goToPage() {
    cy.intercept('/profile').as('account');
    cy.visit('/dashboard');

    const committeeID = Cypress.env('COMMITTEE_ID');
    cy.intercept('GET', `http://localhost:8080/api/v1/openfec/${committeeID}/f1_filing`, {
      fixture: 'FEC_Get_F1_Filing.json',
    });

    cy.get('#navbarProfileDropdownMenuLink').click();
    cy.get('[href="/committee"]').contains('Account').click();
    cy.location('pathname').should('include', '/committee');
  }
}
