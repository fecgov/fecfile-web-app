import { defaultDebtFormData } from '../models/TransactionFormModel';
import { Initialize } from '../pages/loginPage';
import { PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { DataSetup } from './setup';
import { StartTransaction } from './utils/start-transaction/start-transaction';
import { ContactLookup } from '../pages/contactLookup';
import { ReportListPage } from '../pages/reportListPage';

type DebtAmounts = {
  amount: string;
  balance: string;
  paymentAmount: string;
  balanceAtClose: string;
};

function startDebtOwedByCommittee(result: any, amount: number) {
  // cy.wait because the DataSetup above is a loose cannon,
  // causing navigations to occur in the middle of the following
  // script.  To be addressed in FECFILE-2842
  cy.wait(500);
  ReportListPage.goToReportList(result.report);
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

function reopenDebtOwedByCommittee(report: any) {
  ReportListPage.goToReportList(report);
  cy.contains('Debt Owed By Committee', { timeout: 10000 }).should('exist');
  cy.contains('Debt Owed By Committee').click();
  cy.wait(500);
}

function assertDebtAmounts(expected: DebtAmounts) {
  cy.get('#amount').should('have.value', expected.amount);
  cy.get('#balance').should('have.value', expected.balance);
  cy.get('#payment_amount').should('have.value', expected.paymentAmount);
  cy.get('#balance_at_close').should('have.value', expected.balanceAtClose);
}

function updateIncurredAmount(amount: number) {
  cy.get('#amount').clear().safeType(String(amount));
  cy.get('#amount').blur();
  cy.wait(200);
}

describe('Debt Balance at Close Calculation', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should calculate balance_at_close = beginning_balance + incurred_amount - payment_amount when creating a debt', () => {
    cy.wrap(DataSetup({ committee: true })).then((result: any) => {
      startDebtOwedByCommittee(result, 3000);

      // Verify balance_at_close was calculated during form entry: 0 + 3000 - 0 = 3000
      cy.get('#balance_at_close').should('have.value', '$3,000.00');
      PageUtils.clickSaveButton('navigation-control');

      reopenDebtOwedByCommittee(result.report);
      assertDebtAmounts({
        amount: '$3,000.00',
        balance: '$0.00',
        paymentAmount: '$0.00',
        balanceAtClose: '$3,000.00',
      });
      updateIncurredAmount(5000);

      // Verify balance_at_close updates to: 0 + 5000 - 0 = 5000
      cy.get('#balance_at_close').should('have.value', '$5,000.00');
    });
  });

  it('should update balance_at_close when modifying incurred_amount', () => {
    cy.wrap(DataSetup({ committee: true })).then((result: any) => {
      startDebtOwedByCommittee(result, 5000);

      // Verify initial balance_at_close = 0 + 5000 - 0 = 5000
      cy.get('#balance_at_close').should('have.value', '$5,000.00');
      PageUtils.clickSaveButton('navigation-control');

      reopenDebtOwedByCommittee(result.report);
      assertDebtAmounts({
        amount: '$5,000.00',
        balance: '$0.00',
        paymentAmount: '$0.00',
        balanceAtClose: '$5,000.00',
      });
      updateIncurredAmount(8000);

      // Verify balance_at_close updates to: 0 + 8000 - 0 = 8000
      cy.get('#balance_at_close').should('have.value', '$8,000.00');
    });
  });
});
