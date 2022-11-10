// @ts-check

import { generateContactIndividual } from '../../support/generators/contacts.spec';
import { generateReportObject } from '../../support/generators/reports.spec';
import { generateTransactionObject, Transaction, TransactionTree } from '../../support/generators/transactions.spec';

const contact = generateContactIndividual({
  employer: '',
  occupation: '',
});
const transactions = [
  generateTransactionObject({
    transaction_name: 'Individual Receipt',
    fields: { contributionAmount: 199.99 },
    contact: contact,
  }),
  generateTransactionObject({
    transaction_name: 'Individual Receipt',
    fields: { contributionAmount: 200.01 },
    contact: contact,
  }),
  generateTransactionObject({
    transaction_name: 'Other Receipts',
    fields: { contributionAmount: 199.99 },
    contact: contact,
  }),
  generateTransactionObject({
    transaction_name: 'Other Receipts',
    fields: { contributionAmount: 200.01 },
    contact: contact,
  }),
];

function test_employer_fields(transaction: Transaction) {
  const accordion = transaction.transaction_category;
  const receipt = transaction.transaction_name;
  const contribution = transaction.fields['contributionAmount'] as number;
  const required = contribution > 200;

  cy.createTransactionSchA(transaction, false);
  cy.shortWait();
  cy.get('input[formControlName="contributor_employer"]').click();
  cy.get('input[formControlName="contributor_occupation"]').click();
  cy.contains('FECFile Online').click({ force: true, scrollBehavior: false });
  cy.shortWait();

  if (required) {
    cy.get('input[formControlName="contributor_employer"]').parent().find('.p-error').should('exist');
    cy.get('input[formControlName="contributor_occupation"]').parent().find('.p-error').should('exist');
  } else {
    cy.get('input[formControlName="contributor_employer"]').parent().find('.p-error').should('not.exist');
    cy.get('input[formControlName="contributor_occupation"]').parent().find('.p-error').should('not.exist');
  }

  cy.contains('button', 'Cancel').click();
  cy.shortWait();
}

describe('QA Script 276 (Sprint 15)', () => {
  after(() => {
    cy.login();
    cy.visit('/dashboard');
    cy.deleteAllReports();
    cy.deleteAllContacts();
  });

  before('', () => {
    //Step 1: Log in, navigate to the contacts page and create individual, organization, and committee contacts
    cy.login();
    cy.visit('/dashboard');
    cy.url().should('contain', '/dashboard');
    cy.medWait();

    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.medWait();

    //Step 2: Create a report and navigate to the transactions page
    const report = generateReportObject();
    cy.createReport(report);
  });

  it('Tests contact editing within a transaction', () => {
    cy.login();
    cy.visit('/dashboard');
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.medWait();

    cy.navigateToTransactionManagement();
    cy.longWait();

    for (const transaction of transactions) {
      test_employer_fields(transaction);
    }
  });
});
