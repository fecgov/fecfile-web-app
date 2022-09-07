import { generateReportObject } from '../../support/generators/reports.spec';
import { generateTransactionObject } from '../../support/generators/transactions.spec';
import { createTransactionSchA } from '../../support/transactions.spec';

describe('QA Script 347 (Sprint 10)', () => {
  it('', () => {
    //Logs in and creates a dummy report
    cy.login();
    cy.visit('/dashboard');
    const report = generateReportObject();
    cy.createReport(report);
    cy.shortWait();
    cy.get('p-button[icon="pi pi-pencil"]').click();
    cy.navigateToTransactionManagement();

    //Tests the summary page for a report
    const transactionTree = generateTransactionObject({
      TRANSFERS: {
        'Joint Fundraising Transfer': {},
      },
    });
    createTransactionSchA(transactionTree);
    cy.medWait();
    const parentTransaction = transactionTree['TRANSFERS']['Joint Fundraising Transfer'];
    const childTransaction = parentTransaction['childTransactions'][0];
    const childName = childTransaction['contributorOrganizationName'];

    cy.contains('tr', parentTransaction['contributorOrganizationName'])
      .find('>td')
      .eq(6)
      .then(($td) => {
        const parentId = $td.text();
        cy.contains('tr', childName).find('td').eq(7).should('have.text', parentId);
      });
  });

  after('Cleanup', () => {
    cy.login();
    cy.visit('/dashboard');
    cy.deleteAllReports();
  });
});
