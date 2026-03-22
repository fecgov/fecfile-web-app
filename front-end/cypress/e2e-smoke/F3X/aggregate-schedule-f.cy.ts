import { Initialize, setCommitteeToPTY } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { buildScheduleF } from '../requests/library/transactions';
import { DataSetup } from './setup';
import { ContactLookup } from '../pages/contactLookup';
import { ReportListPage } from '../pages/reportListPage';
import { StartTransaction } from './utils/start-transaction/start-transaction';
import { F3XAggregationHelpers } from '../../e2e-extended/reports/f3x/f3x-aggregation.helpers';

function generateReportAndContacts(transactions: [number, string, boolean][]) {
  return cy
    .wrap(DataSetup({ individual: true, candidate: true, candidateSenate: true, committee: true, organization: true }))
    .then((result: any) => {
      const transactionIds: string[] = [];
      let chain: Cypress.Chainable<unknown> = cy.wrap(null, { log: false });

      transactions.forEach(([amount, date, usePrimaryCandidate]) => {
        const payload = buildScheduleF(
          amount,
          date,
          result.individual,
          usePrimaryCandidate ? result.candidate : result.candidateSenate,
          result.committee,
          result.report,
        );

        chain = chain.then(() =>
          F3XAggregationHelpers.createTransaction(payload).then((created) => {
            transactionIds.push(created.id);
          }),
        );
      });

      return chain.then(() => ({ ...result, transactionIds }));
    });
}

function reloadTransactionsInReport(reportId: string) {
  ReportListPage.gotToReportTransactionListPage(reportId);
  cy.contains('Transactions in this report').should('be.visible');
}

function openScheduleFTransaction(transactionId: string) {
  F3XAggregationHelpers.openRowById(F3XAggregationHelpers.disbursementsTableRoot, transactionId);
}

describe('Tests transaction form aggregate calculation', () => {
  beforeEach(() => {
    Initialize();
  });

  it('sets aggregate to value when no previous', () => {
    setCommitteeToPTY();
    cy.wrap(DataSetup({ organization: true, candidate: true, committee: true })).then((result: any) => {
      ReportListPage.gotToReportTransactionListPage(result.report);
      StartTransaction.Disbursements().Contributions().CoordinatedPartyExpenditure();
      ContactLookup.getContact(result.organization.name, '', 'Organization');
      ContactLookup.getCommittee(result.committee, [], [], '#contact_3_lookup');
      ContactLookup.getCandidate(result.candidate, [], [], '#contact_2_lookup');

      TransactionDetailPage.enterDate('[data-cy="expenditure_date"]', new Date(currentYear, 4 - 1, 27));
      cy.blurActiveField();
      cy.get('#general_election_year').safeType(currentYear).blurActiveField();
      cy.get('#amount').safeType(100).blurActiveField();
      cy.get('#purpose_description').first().safeType('test');
      cy.get('#aggregate_general_elec_expended').should('have.value', '$100.00');
    });
  });

  it('new transaction aggregate', () => {
    generateReportAndContacts([
      [200.01, `${currentYear}-04-12`, true],
      [25, `${currentYear}-04-16`, true],
    ]).then((result: any) => {
      const [, secondId] = result.transactionIds;
      ReportListPage.gotToReportTransactionListPage(result.report);
      openScheduleFTransaction(secondId);
      cy.get('#aggregate_general_elec_expended').should('have.value', '$225.01');

      TransactionDetailPage.enterDate('[data-cy="expenditure_date"]', new Date(currentYear, 3, 10), '');
      cy.blurActiveField();
      cy.get('#aggregate_general_elec_expended').should('have.value', '$25.00');

      TransactionDetailPage.enterDate('[data-cy="expenditure_date"]', new Date(currentYear, 3, 29), '');
      cy.blurActiveField();
      cy.get('#aggregate_general_elec_expended').should('have.value', '$225.01');

      ContactLookup.getCandidate(result.candidateSenate, [], [], '#contact_2_lookup');
      cy.get('#aggregate_general_elec_expended').should('have.value', '$25.00');

      ContactLookup.getCandidate(result.candidate, [], [], '#contact_2_lookup');
      cy.get('#aggregate_general_elec_expended').should('have.value', '$225.01');

      cy.get('#amount').clear().safeType('40').blurActiveField();
      cy.get('#aggregate_general_elec_expended').should('have.value', '$240.01');
    });
  });

  it('new transaction aggregate different contact', () => {
    cy.intercept('GET', '**/api/v1/transactions/previous/payee-candidate/**').as('GetPrevious');
    generateReportAndContacts([
      [200.01, '2025-04-12', true],
      [25, '2025-04-16', true],
    ]).then((result: any) => {
      cy.visit(`/reports/transactions/report/${result.report}/create/COORDINATED_PARTY_EXPENDITURE`);
      ContactLookup.getContact(result.organization.name);
      cy.get('#amount').safeType('100').blurActiveField();
      cy.get('#aggregate_general_elec_expended').should('have.value', '$100.00');
      ContactLookup.getCandidate(result.candidateSenate, [], [], '#contact_2_lookup');
      TransactionDetailPage.enterDate('[data-cy="expenditure_date"]', new Date(currentYear, 4 - 1, 20), '');
      cy.blurActiveField();
      cy.get('#general_election_year').safeType('2024').blurActiveField();
      cy.wait('@GetPrevious');
      cy.get('#aggregate_general_elec_expended:visible').should('have.value', '$100.00');
    });
  });

  it('new transaction aggregate different election year', () => {
    generateReportAndContacts([
      [200.01, '2025-04-12', true],
      [25, '2025-04-16', true],
    ]).then((result: any) => {
      cy.visit(`/reports/transactions/report/${result.report}/create/COORDINATED_PARTY_EXPENDITURE`);
      ContactLookup.getContact(result.organization.name);
      ContactLookup.getCandidate(result.candidate, [], [], '#contact_2_lookup');
      cy.get('#amount').safeType('100').blurActiveField();
      cy.get('#aggregate_general_elec_expended').should('have.value', '$100.00');
      cy.get('#general_election_year').safeType('1990').blurActiveField();
      TransactionDetailPage.enterDate('[data-cy="expenditure_date"]', new Date(currentYear, 4 - 1, 20), '');
      cy.blurActiveField();
      cy.get('#aggregate_general_elec_expended').should('have.value', '$100.00');
    });
  });

  it('existing transaction change contact', () => {
    generateReportAndContacts([
      [200.01, `${currentYear}-04-12`, true],
      [25, `${currentYear}-04-16`, false],
    ]).then((result: any) => {
      const [, secondId] = result.transactionIds;
      ReportListPage.gotToReportTransactionListPage(result.report);
      openScheduleFTransaction(secondId);
      cy.get('#aggregate_general_elec_expended').should('have.value', '$25.00');
      ContactLookup.getCandidate(result.candidate, [], [], '#contact_2_lookup');
      cy.get('#aggregate_general_elec_expended').should('have.value', '$225.01');
    });
  });

  it('existing transaction change general election year', () => {
    generateReportAndContacts([
      [200.01, `${currentYear}-04-12`, true],
      [25, `${currentYear}-04-10`, true],
    ]).then((result: any) => {
      const [, secondId] = result.transactionIds;
      ReportListPage.gotToReportTransactionListPage(result.report);
      openScheduleFTransaction(secondId);
      cy.get('#aggregate_general_elec_expended').should('have.value', '$25.00');
      TransactionDetailPage.enterDate('[data-cy="expenditure_date"]', new Date(currentYear, 3, 15), '');
      cy.get('#general_election_year').clear().safeType('2024');
      cy.get('#aggregate_general_elec_expended').should('have.value', '$225.01');
    });
  });

  it('existing transaction date leapfrogging', () => {
    generateReportAndContacts([
      [200.01, `${currentYear}-04-12`, true],
      [25, `${currentYear}-04-16`, true],
    ]).then((result: any) => {
      const [firstId, secondId] = result.transactionIds;
      ReportListPage.gotToReportTransactionListPage(result.report);
      openScheduleFTransaction(firstId);
      TransactionDetailPage.enterDate('[data-cy="expenditure_date"]', new Date(currentYear, 3, 30), '');
      cy.get('#aggregate_general_elec_expended').should('have.value', '$225.01');
      PageUtils.clickButton('Save', 'app-navigation-control-bar:visible');

      reloadTransactionsInReport(result.report);
      openScheduleFTransaction(secondId);
      cy.get('#aggregate_general_elec_expended').should('have.value', '$25.00');
      PageUtils.clickButton('Save', 'app-navigation-control-bar:visible');

      reloadTransactionsInReport(result.report);
      openScheduleFTransaction(firstId);
      TransactionDetailPage.enterDate('[data-cy="expenditure_date"]', new Date(currentYear, 3, 10), '');
      cy.get('#aggregate_general_elec_expended').should('have.value', '$200.01');
      PageUtils.clickButton('Save', 'app-navigation-control-bar:visible');

      reloadTransactionsInReport(result.report);
      openScheduleFTransaction(secondId);
      cy.get('#aggregate_general_elec_expended').should('have.value', '$225.01');
    });
  });

  it('leapfrog and contact change', () => {
    generateReportAndContacts([
      [200.01, `${currentYear}-04-12`, true],
      [25, `${currentYear}-04-16`, true],
      [40, `${currentYear}-04-20`, true],
    ]).then((result: any) => {
      const [firstId, secondId, thirdId] = result.transactionIds;
      ReportListPage.gotToReportTransactionListPage(result.report);
      openScheduleFTransaction(firstId);

      ContactLookup.getCandidate(result.candidateSenate, [], [], '#contact_2_lookup');
      TransactionDetailPage.enterDate('[data-cy="expenditure_date"]', new Date(currentYear, 3, 29), '');
      cy.get('#aggregate_general_elec_expended').should('have.value', '$200.01');
      PageUtils.clickButton('Save', 'app-navigation-control-bar:visible');

      reloadTransactionsInReport(result.report);
      openScheduleFTransaction(firstId);
      cy.get('#aggregate_general_elec_expended').should('have.value', '$200.01');
      PageUtils.clickButton('Save', 'app-navigation-control-bar:visible');

      reloadTransactionsInReport(result.report);
      openScheduleFTransaction(secondId);
      cy.get('#aggregate_general_elec_expended').should('have.value', '$25.00');
      PageUtils.clickButton('Save', 'app-navigation-control-bar:visible');

      reloadTransactionsInReport(result.report);
      openScheduleFTransaction(thirdId);
      cy.get('#aggregate_general_elec_expended').should('have.value', '$65.00');
    });
  });

  it('schedule F delete middle transaction reaggregates downstream aggregate_general_elec_expended', () => {
    setCommitteeToPTY();
    cy.wrap(DataSetup({ individual: true, candidate: true, committee: true })).then((result: any) => {
      F3XAggregationHelpers.seedScheduleFChain(result.report, result.individual, result.candidate, result.committee, [
        { amount: 100, date: `${currentYear}-04-10` },
        { amount: 50, date: `${currentYear}-04-15` },
        { amount: 25, date: `${currentYear}-04-20` },
      ]).then((transactionIds) => {
        const [, middleId, finalId] = transactionIds;

        F3XAggregationHelpers.goToReport(result.report);
        F3XAggregationHelpers.openRowById(F3XAggregationHelpers.disbursementsTableRoot, finalId);
        F3XAggregationHelpers.assertScheduleFAggregateField('$175.00');
        F3XAggregationHelpers.goToReport(result.report);

        F3XAggregationHelpers.deleteRowById(F3XAggregationHelpers.disbursementsTableRoot, middleId);

        F3XAggregationHelpers.openRowById(F3XAggregationHelpers.disbursementsTableRoot, finalId);
        F3XAggregationHelpers.assertScheduleFAggregateField('$125.00');
      });
    });
  });
});
