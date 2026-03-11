import { defaultDebtFormData } from '../models/TransactionFormModel';
import { Initialize } from '../pages/loginPage';
import { PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { DataSetup } from './setup';
import { StartTransaction } from './utils/start-transaction/start-transaction';
import { ContactLookup } from '../pages/contactLookup';
import { ReportTransactionListPage } from '../pages/reportTransactionListPage';
import { assertDebtFieldValues } from './utils/debt-assertions';

function createDebtOwedByCommittee(result: any, amount: number) {
  // cy.wait because the DataSetup above is a loose cannon,
  // causing navigations to occur in the middle of the following
  // script. To be addressed in FECFILE-2842
  cy.wait(500);
  ReportTransactionListPage.goToReportTransactionListPage(result.report);
  StartTransaction.Debts().ByCommittee();

  PageUtils.urlCheck('DEBT_OWED_BY_COMMITTEE');
  ContactLookup.getCommittee(result.committee, [], [], '', 'Committee');
  TransactionDetailPage.enterLoanFormData(
    {
      ...defaultDebtFormData,
      amount,
    },
    false,
    '',
    '#amount',
  );
}

function reopenDebtOwedByCommittee(reportId: string) {
  ReportTransactionListPage.goToReportTransactionListPage(reportId);
  cy.contains('Debt Owed By Committee').should('be.visible').click();
  cy.wait(500);
}

function updateDebtAmount(amount: number) {
  cy.get('#amount:visible').clear().safeType(String(amount));
  cy.get('#amount:visible').blur();
  cy.wait(200);
}

describe('Debt Balance at Close Calculation', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should calculate balance_at_close = beginning_balance + incurred_amount - payment_amount when creating a debt', () => {
    cy.wrap(DataSetup({ committee: true })).then((result: any) => {
      createDebtOwedByCommittee(result, 3000);

      // Verify balance_at_close was calculated during form entry: 0 + 3000 - 0 = 3000
      cy.get('#balance_at_close:visible').should('have.value', '$3,000.00');
      PageUtils.clickButton('Save');

      // Navigate back to verify the saved debt and then edit it
      reopenDebtOwedByCommittee(result.report);

      // Verify values from creation
      assertDebtFieldValues({
        amount: '$3,000.00',
        balance: '$0.00',
        paymentAmount: '$0.00',
        balanceAtClose: '$3,000.00',
      });

      // Now on edit, these fields should be editable
      // Change incurred_amount from 3000 to 5000
      updateDebtAmount(5000);

      // Verify balance_at_close updates to: 0 + 5000 - 0 = 5000
      cy.get('#balance_at_close:visible').should('have.value', '$5,000.00');
    });
  });

  it('should update balance_at_close when modifying incurred_amount', () => {
    cy.wrap(DataSetup({ committee: true })).then((result: any) => {
      createDebtOwedByCommittee(result, 5000);

      // Verify initial balance_at_close = 0 + 5000 - 0 = 5000
      cy.get('#balance_at_close:visible').should('have.value', '$5,000.00');
      PageUtils.clickButton('Save');

      // Navigate back and edit the debt
      reopenDebtOwedByCommittee(result.report);

      // Verify current values
      assertDebtFieldValues({
        amount: '$5,000.00',
        balance: '$0.00',
        paymentAmount: '$0.00',
        balanceAtClose: '$5,000.00',
      });

      // Modify incurred_amount from 5000 to 8000
      updateDebtAmount(8000);

      // Verify balance_at_close updates to: 0 + 8000 - 0 = 8000
      cy.get('#balance_at_close:visible').should('have.value', '$8,000.00');
    });
  });
});
