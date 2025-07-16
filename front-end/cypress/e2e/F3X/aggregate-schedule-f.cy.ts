import { Initialize, setCommitteeToPTY } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { makeTransaction } from '../requests/methods';
import { buildScheduleF } from '../requests/library/transactions';
import { F3XSetup } from './f3x-setup';

function generateReportAndContacts(transData: [number, string][]) {
  return cy
    .wrap(F3XSetup({ individual: true, candidate: true, candidateSenate: true, committee: true, organization: true }))
    .then((result: any) => {
      transData.forEach((data, i) => {
        const transaction = buildScheduleF(
          data[0],
          data[1],
          result.individual,
          result.candidate,
          result.committee,
          result.report,
        );
        makeTransaction(transaction);
      });
      return cy.wrap(result);
    });
}

describe('Tests transaction form aggregate calculation', () => {
  beforeEach(() => {
    Initialize();
    setCommitteeToPTY();
  });

  it('new transaction aggregate', () => {
    generateReportAndContacts([
      [200.01, '2025-04-12'],
      [25.0, '2025-04-16'],
    ]).then((result: any) => {
      cy.visit(`/reports/transactions/report/${result.report}/list`);
      cy.get(':nth-child(2) > :nth-child(2) > a').click();
      cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$225.01');

      // Tests moving the date to be earlier
      TransactionDetailPage.enterDate('[data-cy="expenditure_date"]', new Date(2025, 3, 10), '');
      cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$25.00');

      // Move the date back
      const alias = PageUtils.getAlias('');
      cy.get(alias).find('[data-cy="expenditure_date"]').first().click();
      cy.get('body').find('.p-datepicker-panel').as('calendarElement');
      cy.get('@calendarElement').find('[data-date="2025-3-29"]').click('bottom', { force: true });
      cy.get('@calendarElement').find('[data-date="2025-3-29"]').click('bottom', { force: true });

      cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$225.01');

      // Change the candidate contact
      TransactionDetailPage.getContact(result.candidateSenate, '#contact_2_lookup');
      cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$25.00');

      // Change the contact back
      TransactionDetailPage.getContact(result.candidate, '#contact_2_lookup');
      cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$225.01');

      // Change the amount
      cy.get('[id="amount"]').clear().safeType('40').blur();

      cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$240.01');
    });
  });

  it('new transaction aggregate different contact', () => {
    cy.intercept('GET', 'http://localhost:8080/api/v1/transactions/previous/payee-candidate/**').as('GetPrevious');
    generateReportAndContacts([
      [200.01, '2025-04-12'],
      [25.0, '2025-04-16'],
    ]).then((result: any) => {
      cy.visit(`/reports/transactions/report/${result.report}/create/COORDINATED_PARTY_EXPENDITURE`);
      TransactionDetailPage.getContact(result.organization);
      cy.get('#amount').safeType('100').blur();
      cy.get('#aggregate_general_elec_expended').should('have.value', '$100.00');
      TransactionDetailPage.getContact(result.candidateSenate, '#contact_2_lookup');
      TransactionDetailPage.enterDate('[data-cy="expenditure_date"]', new Date(currentYear, 4 - 1, 20), '');
      cy.get('#general_election_year').safeType('2024').blur();
      cy.wait('@GetPrevious');
      cy.get('#aggregate_general_elec_expended').should('have.value', '$100.00');
    });
  });

  it('new transaction aggregate different election year', () => {
    generateReportAndContacts([
      [200.01, '2025-04-12'],
      [25.0, '2025-04-16'],
    ]).then((result: any) => {
      cy.visit(`/reports/transactions/report/${result.report}/create/COORDINATED_PARTY_EXPENDITURE`);
      cy.intercept('GET', 'http://localhost:8080/api/v1/transactions/previous/payee-candidate/**').as('GetPrevious');
      TransactionDetailPage.getContact(result.organization);
      TransactionDetailPage.getContact(result.candidate, '#contact_2_lookup');
      cy.get('#amount').safeType('100').blur();
      cy.get('#aggregate_general_elec_expended').should('have.value', '$100.00');
      cy.get('#general_election_year').safeType('1990').blur();

      TransactionDetailPage.enterDate('[data-cy="expenditure_date"]', new Date(currentYear, 4 - 1, 20), '');
      cy.wait('@GetPrevious');
      cy.get('#aggregate_general_elec_expended').should('have.value', '$100.00');
    });
  });

  it('existing transaction change contact', () => {
    generateReportAndContacts([
      [200.01, '2025-04-12'],
      [25.0, '2025-04-16'],
    ]).then((result: any) => {
      cy.visit(`/reports/transactions/report/${result.report}/list`);
      cy.contains('Transactions in this report').should('exist');
      cy.get('.p-datatable-tbody > :nth-child(2) > :nth-child(2) > a').click();

      // Tests changing the second transaction's contact
      cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$25.00');
      TransactionDetailPage.getContact(result.candidateSenate, '#contact_2_lookup');
      cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$225.01');
    });
  });

  it('existing transaction change general election year', () => {
    generateReportAndContacts([
      [200.01, '2025-04-12'],
      [25.0, '2025-04-16'],
    ]).then((result: any) => {
      cy.visit(`/reports/transactions/report/${result.report}/list`);
      cy.contains('Transactions in this report').should('exist');
      cy.get('.p-datatable-tbody > :nth-child(2) > :nth-child(2) > a').click();

      // Tests changing the second transaction's general election year
      cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$25.00');
      TransactionDetailPage.enterDate('[data-cy="expenditure_date"]', new Date(2025, 3, 15), '');
      cy.get('[id=general_election_year]').clear().safeType('2024').blur();

      cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$225.01');
    });
  });

  it('existing transaction date leapfrogging', () => {
    generateReportAndContacts([
      [200.01, '2025-04-12'],
      [25.0, '2025-04-16'],
    ]).then((result: any) => {
      cy.visit(`/reports/transactions/report/${result.report}/list`);
      cy.contains('Transactions in this report').should('exist');
      cy.get('.p-datatable-tbody > :nth-child(1) > :nth-child(2) > a').click();

      // Tests moving the first transaction's date to be later than the second
      TransactionDetailPage.enterDate('[data-cy="expenditure_date"]', new Date(currentYear, 3, 30), '');

      cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$225.01');
      PageUtils.clickButton('Save');

      cy.contains('Transactions in this report').should('exist');
      cy.get('.p-datatable-tbody > :nth-child(2) > :nth-child(2) > a').click();
      cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$25.00');

      PageUtils.clickButton('Save');
      cy.contains('Transactions in this report').should('exist');
      cy.get('.p-datatable-tbody > :nth-child(1) > :nth-child(2) > a').click();

      // Tests moving the first transaction's date to be later than the second
      TransactionDetailPage.enterDate('[data-cy="expenditure_date"]', new Date(currentYear, 3, 10), '');

      cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$200.01');
      PageUtils.clickButton('Save');

      cy.contains('Transactions in this report').should('exist');
      cy.get('.p-datatable-tbody > :nth-child(2) > :nth-child(2) > a').click();
      cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$225.01');
    });
  });

  it('leapfrog and contact change', () => {
    generateReportAndContacts([
      [200.01, '2025-04-12'],
      [25.0, '2025-04-16'],
      [40.0, '2025-04-20'],
    ]).then((result: any) => {
      cy.visit(`/reports/transactions/report/${result.report}/list`);
      cy.contains('Transactions in this report').should('exist');
      cy.get('.p-datatable-tbody > :nth-child(1) > :nth-child(2) > a').click();

      // Change the first transaction's candidate
      TransactionDetailPage.getContact(result.candidateSenate, '#contact_2_lookup');

      // Tests moving the first transaction's date to be later than the second
      TransactionDetailPage.enterDate('[data-cy="expenditure_date"]', new Date(currentYear, 3, 29), '');

      cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$200.01');
      PageUtils.clickButton('Save');
      cy.contains('Confirm').should('exist');
      PageUtils.clickButton('Continue', '', true);

      //cy.get('.p-datatable-tbody > :nth-child(1) > :nth-child(7)').should('contain', '$200.01');
      //cy.get('.p-datatable-tbody > :nth-child(2) > :nth-child(7)').should('contain', '$25.00');
      //cy.get('.p-datatable-tbody > :nth-child(3) > :nth-child(7)').should('contain', '$65.00');

      cy.contains('Transactions in this report').should('exist');
      cy.get('.p-datatable-tbody > :nth-child(1) > :nth-child(2) > a').click();
      cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$200.01');
      PageUtils.clickButton('Save');

      cy.contains('Transactions in this report').should('exist');
      cy.get('.p-datatable-tbody > :nth-child(2) > :nth-child(2) > a').click();
      cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$25.00');
      PageUtils.clickButton('Save');

      cy.contains('Transactions in this report').should('exist');
      cy.get('.p-datatable-tbody > :nth-child(3) > :nth-child(2) > a').click();
      cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$65.00');
    });
  });
});
