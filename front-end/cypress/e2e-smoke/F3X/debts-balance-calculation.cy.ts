import { defaultDebtFormData } from '../models/TransactionFormModel';
import { Initialize } from '../pages/loginPage';
import { PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { DataSetup } from './setup';
import { StartTransaction } from './utils/start-transaction/start-transaction';
import { ContactLookup } from '../pages/contactLookup';
import { ReportListPage } from '../pages/reportListPage';
import { ApiUtils } from '../utils/api';

function createDebt(result: any, amount: number, expectedBalanceAtClose: string) {
  ReportListPage.goToReportList(result.report);
  PageUtils.locationCheck(`/reports/transactions/report/${result.report}/list`);

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

  cy.get('#balance_at_close').should('have.value', expectedBalanceAtClose);
  PageUtils.clickButton('Save');
}

function openDebtForEdit(reportId: string) {
  ReportListPage.goToReportList(reportId);
  cy.contains('Debt Owed By Committee', { timeout: 10000 }).should('exist');

  cy.intercept({
    method: 'GET',
    pathname: new RegExp(`^${ApiUtils.apiRoutePathname('/transactions/')}[^/]+/$`),
  }).as('GetDebtDetail');

  cy.contains('Debt Owed By Committee').click();
  cy.wait('@GetDebtDetail');
  cy.get('#amount').should('be.visible');
}

function assertDebtValues(amount: string, balanceAtClose: string, balance = '$0.00', paymentAmount = '$0.00') {
  cy.get('#amount').should('have.value', amount);
  cy.get('#balance').should('have.value', balance);
  cy.get('#payment_amount').should('have.value', paymentAmount);
  cy.get('#balance_at_close').should('have.value', balanceAtClose);
}

function updateAmountAndAssertBalanceAtClose(amount: string, expectedBalanceAtClose: string) {
  cy.get('#amount').clear().safeType(amount).blur();
  cy.get('#balance_at_close', { timeout: 10000 }).should('have.value', expectedBalanceAtClose);
}

describe('Debt Balance at Close Calculation', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should calculate balance_at_close = beginning_balance + incurred_amount - payment_amount when creating a debt', () => {
    DataSetup({ committee: true }).then((result: any) => {
      createDebt(result, 3000, '$3,000.00');
      openDebtForEdit(result.report);

      assertDebtValues('$3,000.00', '$3,000.00');
      updateAmountAndAssertBalanceAtClose('5000', '$5,000.00');
    });
  });

  it('should update balance_at_close when modifying incurred_amount', () => {
    DataSetup({ committee: true }).then((result: any) => {
      createDebt(result, 5000, '$5,000.00');
      openDebtForEdit(result.report);

      assertDebtValues('$5,000.00', '$5,000.00');
      updateAmountAndAssertBalanceAtClose('8000', '$8,000.00');
    });
  });
});
