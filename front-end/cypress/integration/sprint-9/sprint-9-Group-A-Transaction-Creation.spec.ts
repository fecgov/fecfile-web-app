// @ts-check

import { generateReportObject } from '../../support/generators/reports.spec';
import { Transaction, generateTransactionObject } from '../../support/generators/transactions.spec';
import { enterTransactionSchA } from '../../support/transactions.spec';
import { TransactionNavTree, groupANavTree } from '../../support/transaction_nav_trees.spec';

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

  const navTree = groupANavTree;
  for (let category of Object.keys(navTree)) {
    for (let transactionName of Object.keys(navTree[category])) {
      const tTree: TransactionNavTree = {};
      tTree[category] = {};
      tTree[category][transactionName] = {};
      const transaction: Transaction = generateTransactionObject(tTree);

      it('Creates a transaction', () => {
        enterTransactionSchA(transaction);
      });
    }
  }

  after('Cleanup', () => {
    cy.deleteAllReports();
    cy.logout();
  });
});
