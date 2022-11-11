import { generateReportObject } from '../../support/generators/reports.spec';
import { generateTransactionObject } from '../../support/generators/transactions.spec';
import { createTransactionSchA } from '../../support/transactions.spec';

describe('QA Script 347 (Sprint 10)', () => {
  after('Cleanup', () => {
    cy.login();
    cy.visit('/dashboard');
    cy.deleteAllReports();
    cy.deleteAllContacts();
  });

  before('', () => {
    cy.login();
  });

  it('', () => {
    //Logs in and creates a dummy report
    cy.login();
    cy.visit('/dashboard');

    const report = generateReportObject();
    cy.createReport(report);
    cy.shortWait();
    cy.get('p-button[icon="pi pi-pencil"]').click({ force: true });
    cy.navigateToTransactionManagement();

    //Tests the summary page for a report
    const transaction = generateTransactionObject({
      transaction_name: 'Joint Fundraising Transfer',
    });

    createTransactionSchA(transaction);
    cy.medWait();
    const childTransaction = transaction.childTransactions[0];
    const contribution = childTransaction.fields['contributionAmount'] as number;
    const convContribution = Intl.NumberFormat('en-US').format(Math.floor(contribution));

    cy.contains('tr', 'JOINT_FUNDRAISING_TRANSFER')
      .find('td')
      .eq(6)
      .then(($td) => {
        const parentId = $td.text();
        cy.contains('tr', convContribution).find('td').eq(7).should('have.text', parentId);
      });
  });
});
