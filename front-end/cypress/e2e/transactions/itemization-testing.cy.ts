// @ts-check

import { Contact } from '../../support/generators/contacts.spec';
import { generateReportObject } from '../../support/generators/reports.spec';
import { generateTransactionObject } from '../../support/generators/transactions.spec';

const transactions = [
  generateTransactionObject({
    transaction_name: 'Individual Receipt',
    fields: { contributionAmount: 199.99 },
  }),
  generateTransactionObject({
    transaction_name: 'Individual Receipt',
    fields: { contributionAmount: 200.01 },
  }),
  generateTransactionObject({
    transaction_name: 'Tribal Receipt',
    fields: { contributionAmount: 199.99 },
  }),
  generateTransactionObject({
    transaction_name: 'Tribal Receipt',
    fields: { contributionAmount: 200.01 },
  }),
  generateTransactionObject({
    transaction_name: 'Offsets to Operating Expenditures',
    fields: { contributionAmount: 199.99 },
  }),
  generateTransactionObject({
    transaction_name: 'Offsets to Operating Expenditures',
    fields: { contributionAmount: 200.01 },
  }),
  generateTransactionObject({
    transaction_name: 'Other Receipts',
    fields: { contributionAmount: 199.99 },
  }),
  generateTransactionObject({
    transaction_name: 'Other Receipts',
    fields: { contributionAmount: 200.01 },
  }),
  generateTransactionObject(
    {
      transaction_name: 'Joint Fundraising Transfer',
      fields: { contributionAmount: 100.0 },
      childTransactions: [],
    },
    false
  ),
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

function test_itemization(transaction: Transaction) {
  const contact = transaction.contact;
  const contribution = transaction.fields['contributionAmount'];
  let itemized = contribution > 200;
  if (transaction.transaction_name === 'Joint Fundraising Transfer') itemized = true;

  cy.createTransactionSchA(transaction);

  if (!itemized) cy.contains('tr', getName(contact)).should('contain.text', 'Unitemized');
  else cy.contains('tr', getName(contact)).should('not.contain.text', 'Unitemized');
}

describe('Tests itemization', () => {
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

  it('Tests itemization', () => {
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
