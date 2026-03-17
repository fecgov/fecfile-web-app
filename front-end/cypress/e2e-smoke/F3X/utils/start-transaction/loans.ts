import { PageUtils } from '../../../pages/pageUtils';

export class Loans {
  static FromBank() {
    PageUtils.clickLink('Loan Received from Bank');
    cy.get('.accordion-text').contains('STEP ONE').should('be.visible');
  }

  static ByCommittee() {
    PageUtils.clickLink('Loan By Committee');
    cy.get('.accordion-text').contains('STEP ONE').should('be.visible');
  }

  static Individual() {
    PageUtils.clickLink('Loan Received from Individual');
    cy.get('.accordion-text').contains('STEP ONE').should('be.visible');
  }
}
