/* eslint-disable @typescript-eslint/no-explicit-any */
import { Initialize } from '../../e2e-smoke/pages/loginPage';
import { currentYear, PageUtils } from '../../e2e-smoke/pages/pageUtils';
import { DataSetup } from '../../e2e-smoke/F3X/setup';
import { F3XAggregationHelpers } from '../reports/f3x/f3x-aggregation.helpers';
import { TransactionDetailPage } from '../../e2e-smoke/pages/transactionDetailPage';
import { ContactLookup } from '../../e2e-smoke/pages/contactLookup';

describe('Tests the contact update modal', () => {
  beforeEach(() => {
    Initialize();
  });

  it('Should allow you to update a contact in the body of a transaction', () => {
    cy.wrap(DataSetup({ individual: true })).then((result: any) => {
      F3XAggregationHelpers.goToReport(result.report);
      PageUtils.clickSidebarItem("Add a receipt");
      PageUtils.clickAccordion('CONTRIBUTIONS FROM INDIVIDUALS/PERSONS');
      PageUtils.clickLink('Individual Receipt');
      ContactLookup.getContact(result.individual.last_name);
      cy.get('#prefix').should('exist').type('Esq.').blur();
      cy.get('#suffix').type('III').blur();
      TransactionDetailPage.enterDate('[data-cy="contribution_date"]', new Date(currentYear, 5, 7), '');
      cy.get('#amount').type("300").blur();

      TransactionDetailPage.clickSave();
      cy.contains("Confirm").should('exist');
      cy.press(Cypress.Keyboard.Keys.ESC); // Pressing escape should not close the modal
      cy.blurActiveField();
      cy.contains("Confirm").should('exist');

      cy.contains("Updated prefix to Esq.").should('exist');
      cy.contains("Updated suffix to III").should('exist');
      TransactionDetailPage.clickConfirmContactUpdate();

      cy.contains("Transactions in this report").should('exist');
    });
  });
});
