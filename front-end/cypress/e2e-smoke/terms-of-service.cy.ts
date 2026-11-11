import { LoginPage } from './pages/loginPage';

describe('Verify that the terms of service page is working', () => {
  beforeEach(() => {
    LoginPage.login();
  });

  it('The consent button be disabled without scrolling first', () => {
    cy.visit('/login/security-notice');

    cy.get('[data-cy="consent-button"]').get('button').should('be.disabled');
  });

  it('The consent button should work', () => {
    cy.visit('/login/security-notice');
    cy.intercept('**/api/v1/users/update_current/').as('update');

    cy.get('.notice-box-form').scrollTo('bottom');
    cy.get('[data-cy="consent-button"]').click();

    cy.wait('@update').then((request)=>{
      const requestBody = request.request.body;
      expect(requestBody.security_consented).to.equal(true);
    })
  });

  it('The one-year consent checkbox should work', () => {
    cy.visit('/login/security-notice');
    cy.intercept('**/api/v1/users/update_current/').as('update');

    cy.get('.notice-box-form').scrollTo('bottom');
    cy.get('#security-consent-annual').click();
    cy.get('[data-cy="consent-button"]').click();

    cy.wait('@update').then((request)=>{
      const requestBody = request.request.body;
      expect(requestBody.consent_for_one_year).to.equal(true);
    })
  });
});
