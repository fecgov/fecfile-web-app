import { defaultDebtFormData } from '../../models/TransactionFormModel';
import { ContactLookup } from '../../pages/contactLookup';
import { PageUtils } from '../../pages/pageUtils';
import { ReportListPage } from '../../pages/reportListPage';
import { TransactionDetailPage } from '../../pages/transactionDetailPage';
import { StartTransaction } from './start-transaction/start-transaction';
import { ApiUtils } from '../../utils/api';
import { SmokeAliases } from '../../utils/aliases';

const DEBT_BALANCE_HELPERS_ALIAS_SOURCE = 'debtBalanceHelpers';

export function createDebt(result: any, amount: number, expectedBalanceAtClose: string) {
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

export function openDebtForEdit(reportId: string) {
  ReportListPage.goToReportList(reportId);
  cy.contains('Debt Owed By Committee').should('exist');

  cy.intercept({
    method: 'GET',
    pathname: new RegExp(`^${ApiUtils.apiRoutePathname('/transactions/')}[^/]+/$`),
  }).as(SmokeAliases.network.named('GetDebtDetail', DEBT_BALANCE_HELPERS_ALIAS_SOURCE));

  cy.contains('Debt Owed By Committee').click();
  cy.wait(`@${SmokeAliases.network.named('GetDebtDetail', DEBT_BALANCE_HELPERS_ALIAS_SOURCE)}`);
  cy.get('#amount').should('be.visible');
}

export function assertDebtValues(
  amount: string,
  balanceAtClose: string,
  balance = '$0.00',
  paymentAmount = '$0.00',
) {
  cy.get('#amount').should('have.value', amount);
  cy.get('#balance').should('have.value', balance);
  cy.get('#payment_amount').should('have.value', paymentAmount);
  cy.get('#balance_at_close').should('have.value', balanceAtClose);
}

export function updateAmountAndAssertBalanceAtClose(amount: string, expectedBalanceAtClose: string) {
  cy.get('#amount').clear().safeType(amount).blur();
  cy.get('#balance_at_close').should('have.value', expectedBalanceAtClose);
}
