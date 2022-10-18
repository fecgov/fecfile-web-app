// @ts-check

import { generateContactToFit } from '../../support/generators/contacts.spec';
import { generateReportObject } from '../../support/generators/reports.spec';
import { Transaction, generateTransactionObject } from '../../support/generators/transactions.spec';
import { createTransactionSchA } from '../../support/transactions.spec';
import { TransactionNavTree, groupANavTree, TransactionForm } from '../../support/transaction_nav_trees.spec';

function testEditTransaction(transactionForm: TransactionForm, contact: Contact) {
  const lastName = contact['contributorLastName'];
  const firstName = contact['contributorFirstName'];
  const groupName = contact['contributorOrganizationName'];
  const name = contact['name']

  cy.contains('tr', name).find('a').click();
  cy.shortWait();

  cy.get("input[FormControlName='contributor_street_1']").overwrite('100 West Virginia Avenue');
  cy.shortWait();
  cy.get('button[label="Save & view all transactions"]').click();
  cy.longWait();
  cy.url().should('contain', 'transactions/report/');
  cy.url().should('contain', 'list');

  cy.contains('tr', name).find('a').click();
  cy.shortWait();

  cy.get("input[FormControlName='contributor_street_1']").should('have.value', '100 West Virginia Avenue');

  cy.get('button[label="Cancel"]').click();
  cy.shortWait();
}

describe('Test saving and editing on all transactions', () => {
  before('Logs in and creates a dummy report', () => {
    cy.login();
    cy.visit('/dashboard');
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.shortWait();

    const report = generateReportObject();
    cy.createReport(report);
  });

  beforeEach(() => {
    cy.login();
    cy.visit('/dashboard');
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.shortWait();
    cy.get('p-button[icon="pi pi-pencil"]').click();
    cy.shortWait();
    cy.navigateToTransactionManagement();
    cy.medWait();
  });

  after('Cleanup', () => {
    cy.login();
    cy.visit('/dashboard');
    cy.deleteAllReports();
    cy.deleteAllContacts();
  });

  const navTree = groupANavTree;
  for (let category of Object.keys(navTree)) {
    for (let transactionName of Object.keys(navTree[category])) {
      const tTree: TransactionNavTree = {};
      tTree[category] = {};
      tTree[category][transactionName] = {};

      it(`Creates a ${transactionName} transaction`, () => {
        const transaction: Transaction = generateTransactionObject(tTree);
        const contact = generateContactToFit(transaction);
        createTransactionSchA(transaction, contact);
        cy.longWait();

        const tForm = transaction[category][transactionName];
        testEditTransaction(tForm, contact);
      });

      it(`Creates a ${transactionName} transaction with "Save & add another"`, () => {
        const transaction: Transaction = generateTransactionObject(tTree);
        createTransactionSchA(transaction, false);
        cy.get('button[label="Save & add another"]').click();
        cy.get('input[FormControlName="contributor_street_1"]').should('have.value', '');
        cy.longWait();
        cy.get('button[label="Cancel"]').click();

        const tForm = transaction[category][transactionName];
        testEditTransaction(tForm);
      });
    }
  }
});
