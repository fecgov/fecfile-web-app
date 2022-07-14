import { after } from 'lodash';

describe('Sprint 9 QA Script 130', () => {
  before('Logs in and creates a dummy report', () => {
    cy.login();
  });

  it('Finds a valid link to fec.gov to edit their Form 1', () => {
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Profile').click();
    cy.get('.p-menuitem-text').contains('Account').click();
    cy.shortWait();
    cy.get('button[label="Update committee info using Form 1"').click();
    cy.url().should('have.value', 'https://webforms.fec.gov/webforms/form1/index.htm');
  });

  after('Logs out', () => {
    cy.go('back');
    cy.logout();
  });
});
