import { Initialize } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { DataSetup } from './setup';
import { buildScheduleA } from '../requests/library/transactions';
import { ContactLookup } from '../pages/contactLookup';
import { ReportListPage } from '../pages/reportListPage';
import { F3XAggregationHelpers } from '../../e2e-extended/reports/f3x/f3x-aggregation.helpers';

function setupTransactions(secondSame: boolean) {
  return cy.wrap(DataSetup({ individual: true, individual2: true })).then((result: any) => {
    const firstTransaction = buildScheduleA(
      'INDIVIDUAL_RECEIPT',
      200.01,
      `${currentYear}-04-12`,
      result.individual,
      result.report,
    );
    const secondTransaction = buildScheduleA(
      'INDIVIDUAL_RECEIPT',
      25,
      `${currentYear}-04-16`,
      secondSame ? result.individual : result.individual2,
      result.report,
    );

    return F3XAggregationHelpers.createTransaction(firstTransaction).then((createdFirst) => {
      return F3XAggregationHelpers.createTransaction(secondTransaction).then((createdSecond) => {
        return {
          ...result,
          transactionIds: [createdFirst.id, createdSecond.id],
        };
      });
    });
  });
}

function reloadTransactionsInReport(reportId: string) {
  ReportListPage.gotToReportTransactionListPage(reportId);
  cy.contains('Transactions in this report').should('be.visible');
}

function openReceiptTransaction(transactionId: string) {
  F3XAggregationHelpers.openRowById(F3XAggregationHelpers.receiptsTableRoot, transactionId);
}

function assertAggregateValue(value: string) {
  cy.get('#aggregate').should('have.value', value);
}

function assertAggregateColumnValues(aggregates: Array<[string, string]>) {
  aggregates.forEach(([transactionId, expected]) => {
    F3XAggregationHelpers.assertReceiptAggregate(transactionId, expected);
  });
}

function saveAndAssertAggregateColumnValues(reportId: string, aggregates: Array<[string, string]>) {
  PageUtils.clickButton('Save', 'app-navigation-control-bar:visible');
  reloadTransactionsInReport(reportId);
  assertAggregateColumnValues(aggregates);
}

describe('Tests transaction form aggregate calculation', () => {
  beforeEach(() => {
    Initialize();
  });

  it('new transaction aggregate', () => {
    setupTransactions(true).then((result: any) => {
      const [firstId, secondId] = result.transactionIds;
      ReportListPage.gotToReportTransactionListPage(result.report);
      openReceiptTransaction(secondId);

      assertAggregateValue('$225.01');

      TransactionDetailPage.enterDate('[data-cy="contribution_date"]', new Date(currentYear, 3, 10), '');
      cy.blurActiveField();
      assertAggregateValue('$25.00');

      TransactionDetailPage.enterDate('[data-cy="contribution_date"]', new Date(currentYear, 3, 30), '');
      cy.blurActiveField();
      assertAggregateValue('$225.01');

      ContactLookup.getContact(result.individual2.last_name);
      assertAggregateValue('$25.00');

      ContactLookup.getContact(result.individual.last_name);
      assertAggregateValue('$225.01');

      cy.get('#amount').clear().safeType('40').blurActiveField();
      assertAggregateValue('$240.01');

      saveAndAssertAggregateColumnValues(result.report, [
        [firstId, '$200.01'],
        [secondId, '$240.01'],
      ]);
    });
  });

  it('existing transaction change contact', () => {
    setupTransactions(false).then((result: any) => {
      const [firstId, secondId] = result.transactionIds;
      ReportListPage.gotToReportTransactionListPage(result.report);
      openReceiptTransaction(secondId);

      assertAggregateValue('$25.00');
      ContactLookup.getContact(result.individual.last_name);
      cy.blurActiveField();
      assertAggregateValue('$225.01');

      saveAndAssertAggregateColumnValues(result.report, [
        [firstId, '$200.01'],
        [secondId, '$225.01'],
      ]);
    });
  });

  it('existing transaction change amount', () => {
    setupTransactions(true).then((result: any) => {
      const [firstId, secondId] = result.transactionIds;
      ReportListPage.gotToReportTransactionListPage(result.report);
      openReceiptTransaction(secondId);

      assertAggregateValue('$225.01');
      cy.get('#amount').clear().safeType('40').blurActiveField();
      assertAggregateValue('$240.01');

      saveAndAssertAggregateColumnValues(result.report, [
        [firstId, '$200.01'],
        [secondId, '$240.01'],
      ]);
    });
  });

  it('existing transaction date leapfrogging', () => {
    setupTransactions(true).then((result: any) => {
      const [firstId, secondId] = result.transactionIds;
      ReportListPage.gotToReportTransactionListPage(result.report);
      openReceiptTransaction(firstId);

      TransactionDetailPage.enterDate('[data-cy="contribution_date"]', new Date(currentYear, 3, 30), '');
      cy.blurActiveField();
      assertAggregateValue('$225.01');

      saveAndAssertAggregateColumnValues(result.report, [
        [firstId, '$225.01'],
        [secondId, '$25.00'],
      ]);
    });
  });

  it('leapfrog and contact change', () => {
    setupTransactions(true).then((result: any) => {
      const [firstId, secondId] = result.transactionIds;
      const thirdTransaction = buildScheduleA(
        'INDIVIDUAL_RECEIPT',
        40,
        `${currentYear}-04-20`,
        result.individual,
        result.report,
      );

      F3XAggregationHelpers.createTransaction(thirdTransaction).then((createdThird) => {
        ReportListPage.gotToReportTransactionListPage(result.report);
        openReceiptTransaction(firstId);

        ContactLookup.getContact(result.individual2.last_name);
        TransactionDetailPage.enterDate('[data-cy="contribution_date"]', new Date(currentYear, 3, 29), '');
        cy.blurActiveField();
        assertAggregateValue('$200.01');

        saveAndAssertAggregateColumnValues(result.report, [
          [firstId, '$200.01'],
          [secondId, '$25.00'],
          [createdThird.id, '$65.00'],
        ]);
      });
    });
  });

  it('existing IE date leapfrogging', () => {
    cy.wrap(DataSetup({ individual: true, individual2: true, candidate: true })).then((result: any) => {
      F3XAggregationHelpers.createIndependentExpenditureSeries([
        {
          reportId: result.report,
          payeeContactName: result.individual.last_name,
          candidate: result.candidate,
          amount: 100,
          disbursementDate: new Date(currentYear, 4 - 1, 5),
        },
        {
          reportId: result.report,
          payeeContactName: result.individual2.last_name,
          candidate: result.candidate,
          amount: 50,
          disbursementDate: new Date(currentYear, 4 - 1, 15),
        },
        {
          reportId: result.report,
          payeeContactName: result.individual.last_name,
          candidate: result.candidate,
          amount: 25,
          disbursementDate: new Date(currentYear, 4 - 1, 27),
        },
      ]).then(([firstId, secondId]) => {
        reloadTransactionsInReport(result.report);
        F3XAggregationHelpers.openRowById(F3XAggregationHelpers.disbursementsTableRoot, firstId);
        cy.contains('Payee').should('exist');
        TransactionDetailPage.enterDate('[data-cy="disbursement_date"]', new Date(currentYear, 4 - 1, 20), '');
        cy.blurActiveField();
        cy.get('#calendar_ytd').should('have.value', '$150.00');
        PageUtils.clickButton('Save', 'app-navigation-control-bar:visible');

        reloadTransactionsInReport(result.report);
        F3XAggregationHelpers.openRowById(F3XAggregationHelpers.disbursementsTableRoot, secondId);
        cy.contains('Payee').should('exist');
        cy.get('#calendar_ytd').should('have.value', '$50.00');
      });
    });
  });

  it('schedule A delete earliest transaction reaggregates remaining chain', () => {
    cy.wrap(DataSetup({ individual: true })).then((result: any) => {
      F3XAggregationHelpers.seedScheduleAChain(result.report, result.individual, [
        { amount: 100, date: `${currentYear}-04-10` },
        { amount: 50, date: `${currentYear}-04-15` },
        { amount: 25, date: `${currentYear}-04-20` },
      ]).then((transactionIds) => {
        const [firstId, secondId, thirdId] = transactionIds;

        F3XAggregationHelpers.goToReport(result.report);
        F3XAggregationHelpers.assertReceiptAggregate(secondId, '$150.00');
        F3XAggregationHelpers.assertReceiptAggregate(thirdId, '$175.00');

        F3XAggregationHelpers.clickRowActionById(F3XAggregationHelpers.receiptsTableRoot, firstId, 'Delete');
        F3XAggregationHelpers.confirmDialog();

        cy.get(`${F3XAggregationHelpers.receiptsTableRoot} a[href*="/list/${firstId}"]`).should('not.exist');
        F3XAggregationHelpers.assertReceiptAggregate(secondId, '$50.00');
        F3XAggregationHelpers.assertReceiptAggregate(thirdId, '$75.00');
      });
    });
  });

  it('schedule A insert middle-date transaction does not double-count downstream aggregate', () => {
    cy.wrap(DataSetup({ individual: true })).then((result: any) => {
      F3XAggregationHelpers.seedScheduleAChain(result.report, result.individual, [
        { amount: 100, date: `${currentYear}-04-10` },
        { amount: 150, date: `${currentYear}-04-20` },
      ]).then((seedIds) => {
        const [firstId, lastId] = seedIds;
        F3XAggregationHelpers.createTransaction(
          buildScheduleA('INDIVIDUAL_RECEIPT', 75, `${currentYear}-04-15`, result.individual, result.report),
        ).then((middleTransaction) => {
          F3XAggregationHelpers.goToReport(result.report);
          F3XAggregationHelpers.assertReceiptAggregate(firstId, '$100.00');
          F3XAggregationHelpers.assertReceiptAggregate(middleTransaction.id, '$175.00');
          F3XAggregationHelpers.assertReceiptAggregate(lastId, '$325.00');
        });
      });
    });
  });

  it('schedule E delete transaction reaggregates calendar_ytd_per_election_office', () => {
    cy.wrap(DataSetup({ individual: true, candidate: true })).then((result: any) => {
      F3XAggregationHelpers.createIndependentExpenditureSeries([
        {
          reportId: result.report,
          payeeContactName: result.individual.last_name,
          candidate: result.candidate,
          amount: 100,
          disbursementDate: new Date(currentYear, 4 - 1, 5),
        },
        {
          reportId: result.report,
          payeeContactName: result.individual.last_name,
          candidate: result.candidate,
          amount: 50,
          disbursementDate: new Date(currentYear, 4 - 1, 20),
        },
      ]).then(([firstId, secondId]) => {
        F3XAggregationHelpers.goToReport(result.report);
        F3XAggregationHelpers.assertCalendarYtdFieldOnOpen(secondId, '$150.00');
        F3XAggregationHelpers.goToReport(result.report);

        F3XAggregationHelpers.clickRowActionById(F3XAggregationHelpers.disbursementsTableRoot, firstId, 'Delete');
        F3XAggregationHelpers.confirmDialog();

        F3XAggregationHelpers.assertCalendarYtdFieldOnOpen(secondId, '$50.00');
      });
    });
  });
});
