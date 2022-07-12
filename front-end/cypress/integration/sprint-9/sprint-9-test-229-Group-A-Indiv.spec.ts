// @ts-check

import { generateReportObject } from '../../support/generators/reports.spec';
import { Transaction, generateTransactionObject } from '../../support/generators/transactions.spec';
import { enterTransactionSchA } from '../../support/transactions.spec';

describe('QA Test Scripts #230 (Sprint 8)', () => {
  before('Logs in and creates a dummy report', () => {
    cy.login();
    cy.deleteAllReports();
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.shortWait();

    const report = generateReportObject();
    cy.enterReport(report);

    cy.get('p-button[icon="pi pi-pencil"]').click();
    cy.shortWait();
    cy.progressReport();
    cy.medWait();
  });

  it('Creates a transaction', () => {
    const transaction: Transaction = generateTransactionObject({ INDIVIDUAL: { individualReceipt: {} } });
    console.log(transaction);
    enterTransactionSchA(transaction, false);
  });

  after('Cleanup', () => {
    cy.deleteAllReports();
    cy.logout();
  });
});
