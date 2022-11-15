// @ts-check

import { generateContactIndividual } from '../../support/generators/contacts.spec';
import { generateReportObject } from '../../support/generators/reports.spec';
import { generateTransactionObject, PairedTransaction } from '../../support/generators/transactions.spec';

const indvContact = generateContactIndividual({
  employer: '',
  occupation: '',
});

const earmarkA = generateTransactionObject({
  transaction_name: 'Earmark Receipt',
}) as PairedTransaction;
earmarkA.transactionA.fields['contributionAmount'] = 199.99;
earmarkA.transactionA.contact = indvContact;
earmarkA.transactionA.isNewContact = false;

const earmarkB = generateTransactionObject({
  transaction_name: 'Earmark Receipt',
}) as PairedTransaction;
earmarkB.transactionA.fields['contributionAmount'] = 200.01;
earmarkB.transactionA.contact = indvContact;
earmarkB.transactionA.isNewContact = false;

const transactions = [earmarkA, earmarkB];

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

function test_employer_fields(pairedTransaction: PairedTransaction) {
  const transaction = pairedTransaction.transactionA;
  const contribution = transaction.fields['contributionAmount'] as number;
  const required = contribution > 200;

  cy.createTransactionSchA(pairedTransaction, false);
  cy.shortWait();
  cy.contains('p-accordiontab', 'STEP ONE').click();
  cy.shortWait();
  cy.get('input:visible[formControlName="contributor_employer"]').click();
  cy.get('input:visible[formControlName="contributor_occupation"]').click();
  cy.contains('FECFile Online').click({ force: true, scrollBehavior: false });
  cy.shortWait();

  if (required) {
    cy.get('input:visible[formControlName="contributor_employer"]').parent().find('.p-error').should('exist');
    cy.get('input:visible[formControlName="contributor_occupation"]').parent().find('.p-error').should('exist');
  } else {
    cy.get('input:visible[formControlName="contributor_employer"]').parent().find('.p-error').should('not.exist');
    cy.get('input:visible[formControlName="contributor_occupation"]').parent().find('.p-error').should('not.exist');
  }

  cy.contains('button', 'Cancel').click();
  cy.shortWait();
}

describe('QA Script 621 (Sprint 16)', () => {
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

    cy.get('.p-menubar').find('.p-menuitem-link').contains('Contacts').click();
    cy.createContact(indvContact);

    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.medWait();

    //Step 2: Create a report and navigate to the transactions page
    const report = generateReportObject();
    cy.createReport(report);
  });

  it('Tests loading pre-existing contacts and the requirement of employer/occupation fields', () => {
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

  it('Tests itemization of Earmark Receipts', () => {
    cy.login();
    cy.visit('/dashboard');
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.medWait();

    cy.navigateToTransactionManagement();
    cy.longWait();

    const pairedTransaction = generateTransactionObject({
      transaction_name: 'Earmark Receipt',
    }) as PairedTransaction;

    pairedTransaction.transactionA.fields.contributionAmount = 100.0;
    cy.createTransactionSchA(pairedTransaction);
    cy.longWait();

    const contactA = pairedTransaction.transactionA.contact;
    const contactB = pairedTransaction.transactionB.contact;
    cy.contains('tr', getName(contactA)).should('not.contain.text', 'Unitemized');
    cy.contains('tr', getName(contactB)).should('not.contain.text', 'Unitemized');
  });
});
