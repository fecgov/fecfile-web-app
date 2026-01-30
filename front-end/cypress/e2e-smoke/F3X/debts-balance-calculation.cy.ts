import { defaultDebtFormData } from '../models/TransactionFormModel';
import { Initialize } from '../pages/loginPage';
import { PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { DataSetup } from './setup';
import { StartTransaction } from './utils/start-transaction/start-transaction';
import { ContactLookup } from '../pages/contactLookup';
import { ReportListPage } from '../pages/reportListPage';

describe('Debt Balance at Close Calculation', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should calculate balance_at_close = beginning_balance + incurred_amount - payment_amount when creating a debt', () => {
    cy.wrap(DataSetup({ committee: true })).then((result: any) => {
      // Create a debt via the UI
      ReportListPage.goToReportList(result.report);
      StartTransaction.Debts().ByCommittee();

      PageUtils.urlCheck('DEBT_OWED_BY_COMMITTEE');
      ContactLookup.getCommittee(result.committee, [], [], '', 'Committee');
      TransactionDetailPage.enterLoanFormData({
        ...defaultDebtFormData,
        amount: 3000,
      });
      
      // Verify balance_at_close was calculated during form entry: 0 + 3000 - 0 = 3000
      cy.get('#balance_at_close').should('have.value', '$3,000.00');
      
      PageUtils.clickButton('Save');

      // Navigate back to verify the saved debt and then edit it
      ReportListPage.goToReportList(result.report);
      cy.contains('Debt Owed By Committee', { timeout: 10000 }).should('exist');
        cy.contains('Debt Owed By Committee').click();
        cy.wait(500);

      // Verify values from creation
      cy.get('#amount').should('have.value', '$3,000.00');
      cy.get('#balance').should('have.value', '$0.00');
      cy.get('#payment_amount').should('have.value', '$0.00');
      cy.get('#balance_at_close').should('have.value', '$3,000.00');
      
      // Now on edit, these fields should be editable
      // Change incurred_amount from 3000 to 5000
      cy.get('#amount').clear().safeType('5000');
      cy.get('#amount').blur();
      cy.wait(200);
      
      // Verify balance_at_close updates to: 0 + 5000 - 0 = 5000
      cy.get('#balance_at_close').should('have.value', '$5,000.00');
    });
  });

  it('should update balance_at_close when modifying incurred_amount', () => {
    cy.wrap(DataSetup({ committee: true })).then((result: any) => {
      // Create a debt via the UI
      ReportListPage.goToReportList(result.report);
      StartTransaction.Debts().ByCommittee();

      PageUtils.urlCheck('DEBT_OWED_BY_COMMITTEE');
      ContactLookup.getCommittee(result.committee, [], [], '', 'Committee');
      TransactionDetailPage.enterLoanFormData({
        ...defaultDebtFormData,
        amount: 5000,
      });
      
      // Verify initial balance_at_close = 0 + 5000 - 0 = 5000
      cy.get('#balance_at_close').should('have.value', '$5,000.00');
      
      PageUtils.clickButton('Save');

      // Navigate back and edit the debt
      ReportListPage.goToReportList(result.report);
      cy.contains('Debt Owed By Committee', { timeout: 10000 }).should('exist');
        cy.contains('Debt Owed By Committee').click();
        cy.wait(500);

      // Verify current values
      cy.get('#amount').should('have.value', '$5,000.00');
      cy.get('#balance').should('have.value', '$0.00');
      cy.get('#payment_amount').should('have.value', '$0.00');
      cy.get('#balance_at_close').should('have.value', '$5,000.00');

      // Modify incurred_amount from 5000 to 8000
      cy.get('#amount').clear().safeType('8000');
      cy.get('#amount').blur();
      cy.wait(200);

      // Verify balance_at_close updates to: 0 + 8000 - 0 = 8000
      cy.get('#balance_at_close').should('have.value', '$8,000.00');
    });
  });
});
