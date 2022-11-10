// @ts-check

import { Contact, generateContactToFit } from '../../support/generators/contacts.spec';
import { generateReportObject } from '../../support/generators/reports.spec';
import {
  Transaction,
  generateTransactionObject,
  getTransactionFormByName,
} from '../../support/generators/transactions.spec';
import { createTransactionSchA } from '../../support/transactions.spec';
import {
  TransactionNavTree,
  groupANavTree,
  TransactionForm,
  SchATransactionName,
} from '../../support/transaction_nav_trees.spec';

function testEditTransaction(contact: Contact, isPairedTransaction = false) {
  const name = getName(contact);

  cy.contains('tr', name).find('a').click();
  cy.shortWait();

  if (isPairedTransaction) {
    cy.contains('p-accordiontab', 'STEP ONE').click();
    cy.shortWait();
  }

  cy.get("input:visible[FormControlName='contributor_street_1']").overwrite('100 West Virginia Avenue');
  cy.shortWait();
  cy.contains('button', 'Save & view all transactions').click();
  cy.shortWait();
  cy.get('.p-confirm-dialog-accept').click();
  cy.longWait();
  cy.url().should('contain', 'transactions/report/');
  cy.url().should('contain', 'list');

  cy.contains('tr', name).find('a').click();
  cy.shortWait();

  if (isPairedTransaction) {
    cy.contains('p-accordiontab', 'STEP ONE').click();
    cy.shortWait();
  }

  cy.get("input:visible[FormControlName='contributor_street_1']").should('have.value', '100 West Virginia Avenue');
  cy.shortWait();
}

function getName(contact: Contact): string {
  switch (contact['contact_type']) {
    case 'Individual':
    case 'Candidate':
      return `${contact['last_name']}, ${contact['first_name']}`;
    case 'Committee':
    case 'Organization':
      return contact['name'];
  }
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
  for (const category of Object.keys(navTree)) {
    for (const transactionName of Object.keys(navTree[category])) {
      it(`Creates a ${transactionName} transaction`, () => {
        const transaction = generateTransactionObject({ transaction_name: transactionName as SchATransactionName });
        createTransactionSchA(transaction);
        cy.longWait();

        if (transaction.contact) {
          testEditTransaction(transaction.contact);
        } else if (transaction.transactionA?.contact) {
          testEditTransaction(transaction.transactionA.contact, true);
        }
      });

      const noSaveAndAddAnother = ['Earmark Receipt'];
      if (!noSaveAndAddAnother.includes(transactionName)) {
        it(`Creates a ${transactionName} transaction with "Save & add another"`, () => {
          const transaction = generateTransactionObject({ transaction_name: transactionName as SchATransactionName });
          createTransactionSchA(transaction, false);
          cy.contains('button', 'Save & add another').click();
          cy.shortWait();
          cy.get('.p-confirm-dialog-accept').click();
          cy.medWait();
          cy.get('input:visible[FormControlName="street_1"]').should('have.length', 0);
          cy.longWait();
          cy.contains('button', 'Cancel').click();

          if (transaction.contact) {
            testEditTransaction(transaction.contact);
          } else if (transaction.transactionA?.contact) {
            testEditTransaction(transaction.transactionA.contact, true);
          }
        });
      }
    }
  }
});
