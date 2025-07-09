import { Initialize, setCommitteeToPTY } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { makeRequestToAPI } from '../requests/methods';
import { F3X_Q2 } from '../requests/library/reports';
import { buildScheduleF } from '../requests/library/transactions';
import { Individual_A_A, Candidate_Senate_A, Candidate_Senate_B, Committee_A } from '../requests/library/contacts';
import { organizationFormData } from '../models/ContactFormModel';
import { ContactListPage } from '../pages/contactListPage';

function generateReportAndContacts(transData: [number, string][], redirectToCreate = false) {
  cy.intercept('GET', 'http://localhost:8080/api/v1/transactions/**').as('GetTransactionList');
  makeRequestToAPI(
    'POST',
    'http://localhost:8080/api/v1/reports/form-3x/?fields_to_validate=filing_frequency',
    F3X_Q2,
    (response) => {
      const report_id: string = response.body.id;
      makeRequestToAPI('POST', 'http://localhost:8080/api/v1/contacts/', Individual_A_A, (response) => {
        const individual_A_A = response.body;
        makeRequestToAPI('POST', 'http://localhost:8080/api/v1/contacts/', Candidate_Senate_B);
        makeRequestToAPI('POST', 'http://localhost:8080/api/v1/contacts/', Candidate_Senate_A, (response) => {
          const candidate_S_A = response.body;
          makeRequestToAPI('POST', 'http://localhost:8080/api/v1/contacts/', Committee_A, (response) => {
            const committee_A = response.body;

            transData.forEach((data, i) => {
              const transaction = buildScheduleF(
                data[0],
                data[1],
                individual_A_A,
                candidate_S_A,
                committee_A,
                report_id,
              );
              makeRequestToAPI('POST', 'http://localhost:8080/api/v1/transactions/', transaction, (response) => {
                if (i === transData.length - 1) {
                  if (redirectToCreate) {
                    cy.visit(`/reports/transactions/report/${report_id}/create/COORDINATED_PARTY_EXPENDITURE`);
                  } else {
                    cy.visit(`/reports/transactions/report/${report_id}/list`);
                  }
                }
              });
            });
          });
        });
      });
    },
  );
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
    ]);
    cy.wait('@GetTransactionList');

    cy.get(':nth-child(2) > :nth-child(2) > a').click();
    cy.contains('Create a new contact').should('exist');

    cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$225.01');

    // Tests moving the date to be earlier
    TransactionDetailPage.enterDate('[data-cy="expenditure_date"]', new Date(2025, 3, 10), '');

    cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$25.00');

    // Move the date back
    TransactionDetailPage.enterDate('[data-cy="expenditure_date"]', new Date(currentYear, 3, 30), '');

    cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$225.01');

    // Change the candidate contact
    cy.get('#contact_2_lookup').find('#searchBox').safeType(Candidate_Senate_B.first_name);
    cy.contains('Senate, Beta').should('exist');
    cy.contains('Senate, Beta').click({ force: true });

    cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$25.00');

    // Change the contact back
    cy.get('#contact_2_lookup').find('#searchBox').safeType(Candidate_Senate_A.first_name);
    cy.contains('Senate, Alpha').should('exist');
    cy.contains('Senate, Alpha').click({ force: true });

    cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$225.01');

    // Change the amount
    cy.get('[id="amount"]').clear().safeType('40').blur();

    cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$240.01');
  });

  it('new transaction aggregate different contact', () => {
    generateReportAndContacts(
      [
        [200.01, '2025-04-12'],
        [25.0, '2025-04-16'],
      ],
      true,
    );
    // New transaction form should have loaded
    cy.contains('Contact').should('exist');
    cy.intercept('GET', 'http://localhost:8080/api/v1/transactions/previous/payee-candidate/**').as('GetPrevious');
    // Create a new contact
    PageUtils.clickLink('Create a new contact');
    ContactListPage.enterFormData(organizationFormData, true);
    PageUtils.clickButton('Save & continue');
    cy.get('#amount').safeType('100').blur();
    cy.get('#aggregate_general_elec_expended').should('have.value', '$100.00');
    cy.get('#contact_2_lookup').find('#searchBox').safeType(Candidate_Senate_B.first_name);
    cy.contains('Senate, B').should('exist');
    cy.contains('Senate, B').click({ force: true });
    TransactionDetailPage.enterDate('[data-cy="expenditure_date"]', new Date(currentYear, 4 - 1, 20), '');
    cy.get('#general_election_year').safeType('2024').blur();
    cy.wait('@GetPrevious');
    cy.get('#aggregate_general_elec_expended').should('have.value', '$100.00');
  });

  it('new transaction aggregate different election year', () => {
    generateReportAndContacts(
      [
        [200.01, '2025-04-12'],
        [25.0, '2025-04-16'],
      ],
      true,
    );

    // New transaction form should have loaded
    cy.contains('Contact').should('exist');
    cy.intercept('GET', 'http://localhost:8080/api/v1/transactions/previous/payee-candidate/**').as('GetPrevious');
    // Create a new contact
    PageUtils.clickLink('Create a new contact');
    ContactListPage.enterFormData(organizationFormData, true);
    PageUtils.clickButton('Save & continue');
    cy.get('#contact_2_lookup').find('#searchBox').safeType(Candidate_Senate_A.first_name);
    cy.contains('Senate, A').should('exist');
    cy.contains('Senate, A').click({ force: true });
    cy.get('#amount').safeType('100').blur();
    cy.get('#aggregate_general_elec_expended').should('have.value', '$100.00');
    cy.get('#general_election_year').safeType('1990').blur();

    TransactionDetailPage.enterDate('[data-cy="expenditure_date"]', new Date(currentYear, 4 - 1, 20), '');
    cy.wait('@GetPrevious');
    cy.get('#aggregate_general_elec_expended').should('have.value', '$100.00');
  });

  it('existing transaction change contact', () => {
    generateReportAndContacts([
      [200.01, '2025-04-12'],
      [25.0, '2025-04-16'],
    ]);
    cy.wait('@GetTransactionList');

    cy.contains('Transactions in this report').should('exist');
    cy.get('.p-datatable-tbody > :nth-child(2) > :nth-child(2) > a').click();

    // Tests changing the second transaction's contact
    cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$25.00');
    cy.get('#contact_2_lookup').find('#searchBox').safeType(Candidate_Senate_A.first_name);
    cy.contains('Senate, Alpha').should('exist');
    cy.contains('Senate, Alpha').click({ force: true });

    cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$225.01');
  });

  it('existing transaction change general election year', () => {
    generateReportAndContacts([
      [200.01, '2025-04-12'],
      [25.0, '2025-04-16'],
    ]);
    cy.wait('@GetTransactionList');

    cy.contains('Transactions in this report').should('exist');
    cy.get('.p-datatable-tbody > :nth-child(2) > :nth-child(2) > a').click();

    // Tests changing the second transaction's general election year
    cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$25.00');
    TransactionDetailPage.enterDate('[data-cy="expenditure_date"]', new Date(2025, 3, 15), '');
    cy.get('[id=general_election_year]').clear().safeType('2024').blur();

    cy.get('[id=aggregate_general_elec_expended]').should('have.value', '$225.01');
  });

  it('existing transaction date leapfrogging', () => {
    generateReportAndContacts([
      [200.01, '2025-04-12'],
      [25.0, '2025-04-16'],
    ]);
    cy.wait('@GetTransactionList');

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

  it('leapfrog and contact change', () => {
    generateReportAndContacts([
      [200.01, '2025-04-12'],
      [25.0, '2025-04-16'],
      [40.0, '2025-04-20'],
    ]);

    cy.wait('@GetTransactionList');

    cy.contains('Transactions in this report').should('exist');
    cy.get('.p-datatable-tbody > :nth-child(1) > :nth-child(2) > a').click();

    // Change the first transaction's candidate
    cy.get('#contact_2_lookup').find('#searchBox').safeType(Candidate_Senate_B.first_name);
    cy.contains('Senate, Beta').should('exist');
    cy.contains('Senate, Beta').click({ force: true });

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
