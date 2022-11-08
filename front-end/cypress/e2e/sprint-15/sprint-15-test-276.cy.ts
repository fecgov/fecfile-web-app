// @ts-check

import { generateContactIndividual } from '../../support/generators/contacts.spec';
import { generateReportObject } from '../../support/generators/reports.spec';
import { generateTransactionObject, TransactionTree } from '../../support/generators/transactions.spec';

const contact = generateContactIndividual({
  employer: '',
  occupation: '',
});
const transactions = [
  generateTransactionObject({ 'INDIVIDUALS/PERSONS': { 'Individual Receipt': { contributionAmount: 199.99 } } }),
  generateTransactionObject({ 'INDIVIDUALS/PERSONS': { 'Individual Receipt': { contributionAmount: 200.01 } } }),
  generateTransactionObject({ OTHER: { 'Other Receipts': { contributionAmount: 199.99 } } }),
  generateTransactionObject({ OTHER: { 'Other Receipts': { contributionAmount: 200.01 } } }),
];

function test_employer_fields(transaction: TransactionTree) {
  const accordion = Object.keys(transaction)[0];
  const receipt = Object.keys(transaction[accordion])[0];
  const contribution = transaction[accordion][receipt]['contributionAmount'];
  const required = contribution > 200;

  cy.createTransactionSchA(transaction, contact, false);
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
