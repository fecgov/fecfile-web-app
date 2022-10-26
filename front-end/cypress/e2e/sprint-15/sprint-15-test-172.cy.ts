// @ts-check

import * as _ from 'lodash';
import { generateContactToFit } from '../../support/generators/contacts.spec';
import { generateReportObject } from '../../support/generators/reports.spec';
import { generateTransactionObject, TransactionTree } from '../../support/generators/transactions.spec';

const transactions = [
  generateTransactionObject({ 'INDIVIDUALS/PERSONS': { 'Individual Receipt': { contributionAmount: 199.99 } } }),
  generateTransactionObject({ 'INDIVIDUALS/PERSONS': { 'Individual Receipt': { contributionAmount: 200.01 } } }),
  generateTransactionObject({ 'INDIVIDUALS/PERSONS': { 'Tribal Receipt': { contributionAmount: 199.99 } } }),
  generateTransactionObject({ 'INDIVIDUALS/PERSONS': { 'Tribal Receipt': { contributionAmount: 200.01 } } }),
  generateTransactionObject({ OTHER: { 'Offsets to Operating Expenditures': { contributionAmount: 199.99 } } }),
  generateTransactionObject({ OTHER: { 'Offsets to Operating Expenditures': { contributionAmount: 200.01 } } }),
  generateTransactionObject({ OTHER: { 'Other Receipts': { contributionAmount: 199.99 } } }),
  generateTransactionObject({ OTHER: { 'Other Receipts': { contributionAmount: 200.01 } } }),
];

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

function test_itemization(transaction: TransactionTree) {
  const contact = generateContactToFit(transaction);
  const accordion = Object.keys(transaction)[0];
  const receipt = Object.keys(transaction[accordion])[0];
  const contribution = transaction[accordion][receipt]['contributionAmount'];
  const itemized = contribution > 200;
  cy.createTransactionSchA(transaction, contact);

  if (!itemized) cy.contains('tr', getName(contact)).should('contain.text', 'Unitemized');
  else cy.contains('tr', getName(contact)).should('not.contain.text', 'Unitemized');
}

describe('QA Script 244 (Sprint 8)', () => {
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
      test_itemization(transaction);
    }
  });
});
