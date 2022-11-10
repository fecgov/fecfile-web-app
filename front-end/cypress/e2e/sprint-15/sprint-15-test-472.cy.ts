// @ts-check

import * as _ from 'lodash';
import {
  Contact,
  generateContactCommittee,
  generateContactIndividual,
  generateContactOrganization,
} from '../../support/generators/contacts.spec';
import { generateReportObject } from '../../support/generators/reports.spec';
import { generateTransactionObject, Transaction } from '../../support/generators/transactions.spec';
import { enterTransactionSchA } from '../../support/transactions.spec';

//Contacts
const contactIndividual = generateContactIndividual({});
const contactOrganization = generateContactOrganization({});
const contactCommittee = generateContactCommittee({});

//Individual Transactions
const indvRecTree = {
  transaction_name: 'Individual Receipt',
  fields: {
    contributionDate: new Date('12/12/2012'),
    contributionAmount: _.random(10, 500, false),
  },
  contact: contactIndividual,
};
const offsetToOpexTree = {
  transaction_name: 'Offsets to Operating Expenditures',
  fields: {
    contributionDate: new Date('12/12/2012'),
    contributionAmount: _.random(10, 500, false),
  },
  contact: contactIndividual,
};

const transactionIndvA = generateTransactionObject(indvRecTree);
const transactionIndvB = generateTransactionObject(indvRecTree);
const transactionIndvC = generateTransactionObject(indvRecTree);
transactionIndvC.fields['contributionDate'] = new Date('12/12/2013');

const transactionIndvD = generateTransactionObject(offsetToOpexTree);

//Organization Transactions
const orgRecTree = {
  transaction_name: 'Tribal Receipt',
  fields: {
    contributionDate: new Date('12/12/2012'),
    contributionAmount: _.random(10, 500, false),
  },
  contact: contactOrganization,
  isNewContact: false,
};
const otherRecTree = {
  transaction_name: 'Other Receipts',
  fields: {
    contributionDate: new Date('12/12/2012'),
    contributionAmount: _.random(10, 500, false),
  },
  contact: contactOrganization,
  isNewContact: false,
};
const transactionOrgA = generateTransactionObject(orgRecTree);
const transactionOrgB = generateTransactionObject(orgRecTree);
const transactionOrgC = generateTransactionObject(orgRecTree);
transactionOrgC.fields['contributionDate'] = new Date('12/12/2013');

const transactionOrgD = generateTransactionObject(otherRecTree);

//JF Transfer Transfers
const JFTransTree = {
  transaction_name: 'Party Receipt',
  fields: {
    contributionDate: new Date('12/12/2012'),
    contributionAmount: _.random(10, 250, false),
  },
  contact: contactCommittee,
  isNewContact: false,
};

const transactionPartyA = generateTransactionObject(JFTransTree);
const transactionPartyB = generateTransactionObject(JFTransTree);

const transactionPartyC = generateTransactionObject(JFTransTree);
transactionPartyC['contributionDate'] = new Date('12/12/2013');

function testAggregation(contact: Contact, navigation: [string, string], transactions: Transaction[]) {
  cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
  cy.medWait();

  cy.navigateToTransactionManagement();

  //Step 3: Test aggregation for individuals
  cy.get('button[label="Add new transaction"]').click();
  cy.shortWait();
  cy.navigateTransactionAccordion(navigation[0], navigation[1]);

  cy.get('p-autocomplete[formcontrolname="selectedContact"]').safeType(contact['name']);
  cy.medWait();
  cy.contains('li', 'In contacts').click({ force: true });
  cy.medWait();
  enterTransactionSchA(transactions[0]);
  cy.shortWait();
  cy.contains('button', 'Save & add another').click();
  cy.shortWait();

  cy.get('p-autocomplete[formcontrolname="selectedContact"]').safeType(contact['name']);
  cy.medWait();
  cy.contains('li', 'In contacts').click({ force: true });
  cy.medWait();
  enterTransactionSchA(transactions[1]);
  cy.longWait();
  cy.contains('Additional Information').click(); // Field loses focus refreshing the value of contribution aggregate
  cy.shortWait();
  const aggregate = transactions[0]['contributionAmount'] + transactions[1]['contributionAmount'];
  cy.get('p-inputnumber[formcontrolname="contribution_aggregate"]').find('input').should('contain.value', aggregate);

  cy.contains('button', 'Save & add another').click();
  cy.shortWait();

  cy.get('p-autocomplete[formcontrolname="selectedContact"]').safeType(contact['name']);
  cy.medWait();
  cy.contains('li', 'In contacts').click({ force: true });
  cy.medWait();
  enterTransactionSchA(transactions[2]);
  cy.longWait();
  cy.contains('Additional Information').click(); // Field loses focus refreshing the value of contribution aggregate
  cy.shortWait();
  cy.get('p-inputnumber[formcontrolname="contribution_aggregate"]')
    .find('input')
    .should('contain.value', transactions[2]['contributionAmount']);
}

describe('QA Script 472 (Sprint 15)', () => {
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
    cy.medWait();

    cy.createContact(contactIndividual);
    cy.shortWait();
    cy.createContact(contactOrganization);
    cy.shortWait();
    cy.createContact(contactCommittee);
    cy.shortWait();

    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.medWait();

    //Step 2: Create a report and navigate to the transactions page
    const report = generateReportObject();
    cy.createReport(report);
  });

  it('Tests aggregations', () => {
    cy.login();
    cy.visit('/dashboard');

    testAggregation(
      contactIndividual,
      ['INDIVIDUALS/PERSONS', 'Individual Receipt'],
      [transactionIndvA, transactionIndvB, transactionIndvC, transactionIndvD]
    );

    testAggregation(
      contactOrganization,
      ['INDIVIDUALS/PERSONS', 'Tribal Receipt'],
      [transactionOrgA, transactionOrgB, transactionOrgC, transactionIndvD]
    );

    testAggregation(
      contactCommittee,
      ['TRANSFERS', 'Party Receipt'],
      [transactionPartyA, transactionPartyB, transactionPartyC]
    );
  });

  /*
  it('Tests Memo aggregations', () => {
    cy.login();
    cy.visit('/dashboard');
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.medWait();

    cy.navigateToTransactionManagement();
    cy.longWait();
    cy.contains('a', 'JOINT_FUNDRAISING_TRANSFER').click();
    cy.medWait();
    cy.get('p-dropdown[formcontrolname="subTransaction"]').click();
    cy.shortWait();
    cy.contains('li', 'PAC Joint Fundraising Transfer Memo').click();
    cy.longWait();

    const contact = contactCommittee;
    const transactions = [JFMemoA, JFMemoB, JFMemoC];
    cy.get('p-autocomplete[formcontrolname="selectedContact"]').safeType(contact['name']);
    cy.medWait();
    cy.contains('li', 'In contacts').click({ force: true });
    cy.medWait();
    enterTransactionSchA(transactions[0]);
    cy.shortWait();
    cy.contains('button', 'Save & add another').click();
    cy.shortWait();

    cy.get('p-autocomplete[formcontrolname="selectedContact"]').safeType(contact['name']);
    cy.medWait();
    cy.contains('li', 'In contacts').click({ force: true });
    cy.medWait();
    enterTransactionSchA(transactions[1]);
    cy.longWait();
    cy.contains('Additional Information').click(); // Field loses focus refreshing the value of contribution aggregate
    cy.shortWait();
    const aggregate =
      transactions[0]['contributionAmount'] +
      transactions[1]['contributionAmount'] +
      transactionJFA['contributionAmount'] +
      transactionJFB['contributionAmount'];
    cy.get('p-inputnumber[formcontrolname="contribution_aggregate"]').find('input').should('contain.value', aggregate);

    cy.contains('button', 'Save & add another').click();
    cy.shortWait();

    cy.get('p-autocomplete[formcontrolname="selectedContact"]').safeType(contact['name']);
    cy.medWait();
    cy.contains('li', 'In contacts').click({ force: true });
    cy.medWait();
    enterTransactionSchA(transactions[2]);
    cy.longWait();
    cy.contains('Additional Information').click(); // Field loses focus refreshing the value of contribution aggregate
    cy.shortWait();
    cy.get('p-inputnumber[formcontrolname="contribution_aggregate"]')
      .find('input')
      .should('contain.value', transactions[2]['contributionAmount']);
  });
  */
});
