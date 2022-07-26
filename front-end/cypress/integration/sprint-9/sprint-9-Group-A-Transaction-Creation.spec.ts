// @ts-check

import { generateReportObject } from '../../support/generators/reports.spec';
import { Transaction, generateTransactionObject } from '../../support/generators/transactions.spec';
import { enterTransactionSchA } from '../../support/transactions.spec';
import { TransactionNavTree, groupANavTree } from '../../support/transaction_nav_trees.spec';

function testEditTransaction(transactionForm) {
  const lastName = transactionForm['contributorLastName'];
  const firstName = transactionForm['contributorFirstName'];
  const groupName = transactionForm['contributorOrganizationName'];

  let name: string = '';
  if (lastName && firstName) name = `${lastName}, ${firstName}`;
  else if (groupName) name = groupName;

  cy.contains('tr', name).find('a').click();
  cy.shortWait();

  cy.get("input[FormControlName='contributor_street_1']").overwrite('100 West Virginia Avenue');
  cy.shortWait();
  cy.get('button[label="Save & view all transactions"]').click();
  cy.longWait();
  cy.url().should('contain', '/reports/f3x/create/step3/');

  cy.contains('tr', name).find('a').click();
  cy.shortWait();

  cy.get("input[FormControlName='contributor_street_1']").should('have.value', '100 West Virginia Avenue');

  cy.get('button[label="Cancel"]').click();
  cy.shortWait();
}

describe('Test saving and editing on all transactions', () => {
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

      it(`Creates a ${transactionName} transaction`, () => {
        const transaction: Transaction = generateTransactionObject(tTree);
        enterTransactionSchA(transaction);
        cy.longWait();

        const tForm = transaction[category][transactionName];
        testEditTransaction(tForm);
      });

      it(`Creates a ${transactionName} transaction with "Save & add another"`, () => {
        const transaction: Transaction = generateTransactionObject(tTree);
        enterTransactionSchA(transaction, false);
        cy.get('button[label="Save & add another"]').click();
        cy.get('input[FormControlName="contributor_street_1"]').should('have.value', '');
        cy.longWait();
        cy.get('button[label="Cancel"]').click();

        const tForm = transaction[category][transactionName];
        testEditTransaction(tForm);
      });
    }
  }

  after('Cleanup', () => {
    cy.deleteAllReports();
    cy.logout();
  });
});
