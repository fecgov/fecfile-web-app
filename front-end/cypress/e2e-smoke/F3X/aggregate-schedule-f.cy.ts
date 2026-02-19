import { Initialize, setCommitteeToPTY } from '../pages/loginPage';
import { currentYear } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { DataSetup } from './setup';
import { ContactLookup } from '../pages/contactLookup';
import { ReportListPage } from '../pages/reportListPage';
import { StartTransaction } from './utils/start-transaction/start-transaction';
import { ApiUtils } from '../utils/api';
import { openTransactionFromListByAmount, saveAndWaitForTransactionsList } from './utils/transaction-list-navigation';
import { setupAggregateScheduleFTransactions } from './utils/seed-transactions';
import { SmokeAliases } from '../utils/aliases';

const AGGREGATE_SCHEDULE_F_ALIAS_SOURCE = 'aggregateScheduleFSpec';

function reopenScheduleFByAmount(reportId: string, amount: string) {
  openTransactionFromListByAmount(reportId, amount, { visit: false });
}

describe('Tests transaction form aggregate calculation', () => {
  beforeEach(() => {
    Initialize();
  });

  it('sets aggregate to value when no previous', () => {
    setCommitteeToPTY();
    DataSetup({ organization: true, candidate: true, committee: true }).then((result: any) => {
      ReportListPage.goToReportList(result.report);
      StartTransaction.Disbursements().Contributions().CoordinatedPartyExpenditure();
      ContactLookup.getContact(result.organization.name, '', 'Organization');
      ContactLookup.getCommittee(result.committee, [], [], '#contact_3_lookup');
      ContactLookup.getCandidate(result.candidate, [], [], '#contact_2_lookup');

      TransactionDetailPage.enterDate(`[data-cy="expenditure_date"]`, new Date(currentYear, 4 - 1, 27));
      cy.get('#general_election_year').safeType(currentYear);
      cy.get('#amount').safeType(100);
      cy.get('#purpose_description').first().safeType('test').blur();
      cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$100.00');
    });
  });

  it('new transaction aggregate', () => {
    setupAggregateScheduleFTransactions([
      [200.01, `${currentYear}-04-12`, true],
      [25, `${currentYear}-04-16`, true],
    ]).then((result: any) => {
      ReportListPage.goToReportList(result.report);
      reopenScheduleFByAmount(result.report, '$25.00');
      cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$225.01');

      // Tests moving the date to be earlier
      TransactionDetailPage.enterDate('[data-cy="expenditure_date"]', new Date(currentYear, 3, 10), '');
      saveAndWaitForTransactionsList(result.report);
      reopenScheduleFByAmount(result.report, '$25.00');
      cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$25.00');

      // Move the date back
      TransactionDetailPage.enterDate('[data-cy="expenditure_date"]', new Date(currentYear, 3, 29), '');
      saveAndWaitForTransactionsList(result.report);
      reopenScheduleFByAmount(result.report, '$25.00');
      cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$225.01');

      // Change the candidate contact
      ContactLookup.getCandidate(result.candidateSenate, [], [], '#contact_2_lookup');
      saveAndWaitForTransactionsList(result.report);
      reopenScheduleFByAmount(result.report, '$25.00');
      cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$25.00');

      // Change the contact back
      ContactLookup.getCandidate(result.candidate, [], [], '#contact_2_lookup');
      saveAndWaitForTransactionsList(result.report);
      reopenScheduleFByAmount(result.report, '$25.00');
      cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$225.01');

      // Change the amount
      cy.get('[id="amount"]').clear().safeType('40').blur();
      saveAndWaitForTransactionsList(result.report);
      reopenScheduleFByAmount(result.report, '$40.00');
      cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$240.01');
    });
  });

  it('new transaction aggregate different contact', () => {
    cy.intercept({
      method: 'GET',
      pathname: ApiUtils.apiRoutePathname('/transactions/previous/payee-candidate/'),
    }).as(SmokeAliases.network.named('GetPrevious', AGGREGATE_SCHEDULE_F_ALIAS_SOURCE));
    setupAggregateScheduleFTransactions([
      [200.01, '2025-04-12', true],
      [25, '2025-04-16', true],
    ]).then((result: any) => {
      cy.visit(`/reports/transactions/report/${result.report}/create/COORDINATED_PARTY_EXPENDITURE`);
      ContactLookup.getContact(result.organization.name);
      cy.get('#amount').safeType('100').blur();
      cy.get('#aggregate_general_elec_expended').should('have.value', '$100.00');
      ContactLookup.getCandidate(result.candidateSenate, [], [], '#contact_2_lookup');
      TransactionDetailPage.enterDate('[data-cy="expenditure_date"]', new Date(currentYear, 4 - 1, 20), '');
      cy.get('#general_election_year').safeType('2024').blur();
      cy.wait(`@${SmokeAliases.network.named('GetPrevious', AGGREGATE_SCHEDULE_F_ALIAS_SOURCE)}`);
      cy.get('#aggregate_general_elec_expended').should('have.value', '$100.00');
    });
  });

  it('new transaction aggregate different election year', () => {
    setupAggregateScheduleFTransactions([
      [200.01, '2025-04-12', true],
      [25, '2025-04-16', true],
    ]).then((result: any) => {
      cy.visit(`/reports/transactions/report/${result.report}/create/COORDINATED_PARTY_EXPENDITURE`);
      cy.intercept({
        method: 'GET',
        pathname: ApiUtils.apiRoutePathname('/transactions/previous/payee-candidate/'),
      }).as(SmokeAliases.network.named('GetPrevious', AGGREGATE_SCHEDULE_F_ALIAS_SOURCE));
      ContactLookup.getContact(result.organization.name);
      ContactLookup.getCandidate(result.candidate, [], [], '#contact_2_lookup');
      cy.get('#amount').safeType('100').blur();
      cy.get('#aggregate_general_elec_expended').should('have.value', '$100.00');
      cy.get('#general_election_year').safeType('1990').blur();

      TransactionDetailPage.enterDate('[data-cy="expenditure_date"]', new Date(currentYear, 4 - 1, 20), '');
      cy.wait(`@${SmokeAliases.network.named('GetPrevious', AGGREGATE_SCHEDULE_F_ALIAS_SOURCE)}`);
      cy.get('#aggregate_general_elec_expended').should('have.value', '$100.00');
    });
  });

  it('existing transaction change contact', () => {
    setupAggregateScheduleFTransactions([
      [200.01, `${currentYear}-04-12`, true],
      [25, `${currentYear}-04-16`, false],
    ]).then((result: any) => {
      ReportListPage.goToReportList(result.report);
      cy.contains('Transactions in this report').should('exist');
      reopenScheduleFByAmount(result.report, '$25.00');

      // Tests changing the second transaction's contact
      cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$25.00');
      ContactLookup.getCandidate(result.candidate, [], [], '#contact_2_lookup');
      saveAndWaitForTransactionsList(result.report);
      reopenScheduleFByAmount(result.report, '$25.00');
      cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$225.01');
    });
  });

  it('existing transaction change general election year', () => {
    setupAggregateScheduleFTransactions([
      [200.01, `${currentYear}-04-12`, true],
      [25, `${currentYear}-04-10`, true],
    ]).then((result: any) => {
      ReportListPage.goToReportList(result.report);
      cy.contains('Transactions in this report').should('exist');
      reopenScheduleFByAmount(result.report, '$25.00');

      // Tests changing the second transaction's general election year
      cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$25.00');
      TransactionDetailPage.enterDate('[data-cy="expenditure_date"]', new Date(currentYear, 3, 15), '');
      cy.get('[id=general_election_year]').clear().safeType('2024').blur();
      saveAndWaitForTransactionsList(result.report);
      reopenScheduleFByAmount(result.report, '$25.00');
      cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$225.01');
    });
  });

  it('existing transaction date leapfrogging', () => {
    setupAggregateScheduleFTransactions([
      [200.01, `${currentYear}-04-12`, true],
      [25, `${currentYear}-04-16`, true],
    ]).then((result: any) => {
      ReportListPage.goToReportList(result.report);
      cy.contains('Transactions in this report').should('exist');
      cy.get('.p-datatable-tbody > :nth-child(1) > :nth-child(2) > a').click();

      // Tests moving the first transaction's date to be later than the second
      TransactionDetailPage.enterDate('[data-cy="expenditure_date"]', new Date(currentYear, 3, 30), '');
      cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$225.01');

      saveAndWaitForTransactionsList(result.report);

      cy.get('.p-datatable-tbody > :nth-child(2) > :nth-child(2) > a').click();
      cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$25.00');

      saveAndWaitForTransactionsList(result.report);
      cy.get('.p-datatable-tbody > :nth-child(1) > :nth-child(2) > a').click();

      // Tests moving the first transaction's date to be later than the second
      TransactionDetailPage.enterDate('[data-cy="expenditure_date"]', new Date(currentYear, 3, 10), '');

      cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$200.01');
      saveAndWaitForTransactionsList(result.report);

      cy.get('.p-datatable-tbody > :nth-child(2) > :nth-child(2) > a').click();
      cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$225.01');
    });
  });

  it('leapfrog and contact change', () => {
    setupAggregateScheduleFTransactions([
      [200.01, `${currentYear}-04-12`, true],
      [25, `${currentYear}-04-16`, true],
      [40, `${currentYear}-04-20`, true],
    ]).then((result: any) => {
      ReportListPage.goToReportList(result.report);
      cy.contains('Transactions in this report').should('exist');
      cy.get('.p-datatable-tbody > :nth-child(1) > :nth-child(2) > a').click();

      // Change the first transaction's candidate
      ContactLookup.getCandidate(result.candidateSenate, [], [], '#contact_2_lookup');

      // Tests moving the first transaction's date to be later than the second
      TransactionDetailPage.enterDate('[data-cy="expenditure_date"]', new Date(currentYear, 3, 29), '');
      cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$200.01');

      saveAndWaitForTransactionsList(result.report);

      cy.get('.p-datatable-tbody > :nth-child(1) > :nth-child(2) > a').click();
      cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$200.01');
      saveAndWaitForTransactionsList(result.report);

      cy.get('.p-datatable-tbody > :nth-child(2) > :nth-child(2) > a').click();
      cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$25.00');
      saveAndWaitForTransactionsList(result.report);

      cy.get('.p-datatable-tbody > :nth-child(3) > :nth-child(2) > a').click();
      cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$65.00');
    });
  });
});
