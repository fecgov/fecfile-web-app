/* eslint-disable @typescript-eslint/no-explicit-any */
import { Initialize } from '../../e2e-smoke/pages/loginPage';
import { currentYear, PageUtils } from '../../e2e-smoke/pages/pageUtils';
import { TransactionDetailPage } from '../../e2e-smoke/pages/transactionDetailPage';
import { ContactLookup } from '../../e2e-smoke/pages/contactLookup';
import { ReportListPage } from '../../e2e-smoke/pages/reportListPage';
import { DataSetup } from '../../e2e-smoke/F3X/setup';
import { StartTransaction } from '../../e2e-smoke/F3X/utils/start-transaction/start-transaction';
import { defaultDebtFormData, defaultScheduleFormData } from '../../e2e-smoke/models/TransactionFormModel';
import { F3XAggregationHelpers } from './f3x-aggregation.helpers';

describe('Extended F3X Schedule D Aggregation', () => {
  beforeEach(() => {
    Initialize();
  });

  it('D1-D5 deleting a debt repayment recomputes debt balance_at_close for surviving debt', () => {
    cy.wrap(DataSetup({ committee: true, individual: true })).then((result: any) => {
      ReportListPage.goToReportList(result.report);
      StartTransaction.Debts().ToCommittee();
      ContactLookup.getCommittee(result.committee);

      cy.intercept({
        method: 'POST',
        pathname: '/api/v1/transactions/',
      }).as('CreateDebtToCommittee');

      TransactionDetailPage.enterLoanFormData(
        {
          ...defaultDebtFormData,
          amount: 6000,
        },
        false,
        '',
        '#amount',
      );
      PageUtils.clickButton('Save');
      cy.wait('@CreateDebtToCommittee').then((interception) => {
        const debtId = F3XAggregationHelpers.transactionIdFromPayload(
          interception.response?.body,
          'D1-D5 create debt to committee',
        );

        F3XAggregationHelpers.goToReport(result.report);
        F3XAggregationHelpers.clickRowActionById(
          F3XAggregationHelpers.loansAndDebtsTableRoot,
          debtId,
          'Report debt repayment',
        );
        PageUtils.urlCheck('select/receipt?debt=');
        PageUtils.clickAccordion('CONTRIBUTIONS FROM INDIVIDUALS/PERSONS');
        PageUtils.clickLink('Individual Receipt');
        ContactLookup.getContact(result.individual.last_name);

        cy.intercept({
          method: 'POST',
          pathname: '/api/v1/transactions/',
        }).as('CreateDebtRepaymentReceipt');

        TransactionDetailPage.enterScheduleFormData(
          {
            ...defaultScheduleFormData,
            electionType: undefined,
            electionYear: undefined,
            date_received: new Date(currentYear, 4 - 1, 20),
            amount: 1000,
          },
          false,
          '',
          true,
          'contribution_date',
        );
        PageUtils.clickButton('Save');
        cy.wait('@CreateDebtRepaymentReceipt').then((repaymentInterception) => {
          const repaymentId = F3XAggregationHelpers.transactionIdFromPayload(
            repaymentInterception.response?.body,
            'D1-D5 create debt repayment receipt',
          );

          F3XAggregationHelpers.goToReport(result.report);
          F3XAggregationHelpers.assertDebtBalanceFieldOnOpen(debtId, '$5,000.00');
          F3XAggregationHelpers.clickSave();

          F3XAggregationHelpers.deleteTransactionById(repaymentId);
          F3XAggregationHelpers.goToReport(result.report);

          F3XAggregationHelpers.assertDebtBalanceFieldOnOpen(debtId, '$6,000.00');
        });
      });
    });
  });

  it('D3 editing debt amount updates running debt balance_at_close', () => {
    cy.wrap(DataSetup({ committee: true })).then((result: any) => {
      ReportListPage.goToReportList(result.report);
      StartTransaction.Debts().ByCommittee();
      ContactLookup.getCommittee(result.committee, [], [], '', 'Committee');

      cy.intercept({
        method: 'POST',
        pathname: '/api/v1/transactions/',
      }).as('CreateDebtByCommittee');

      TransactionDetailPage.enterLoanFormData(
        {
          ...defaultDebtFormData,
          amount: 3000,
        },
        false,
        '',
        '#amount',
      );
      cy.get('#balance_at_close').should('have.value', '$3,000.00');
      PageUtils.clickButton('Save');

      cy.wait('@CreateDebtByCommittee').then((interception) => {
        const debtId = F3XAggregationHelpers.transactionIdFromPayload(
          interception.response?.body,
          'D3 create debt by committee',
        );

        F3XAggregationHelpers.goToReport(result.report);
        F3XAggregationHelpers.openLoanOrDebt(debtId);
        cy.get('#amount').clear().safeType('5500').blur();
        cy.get('#balance_at_close').should('have.value', '$5,500.00');
        F3XAggregationHelpers.clickSave();

        F3XAggregationHelpers.assertLoansBalance(debtId, '$5,500.00');
      });
    });
  });
});
