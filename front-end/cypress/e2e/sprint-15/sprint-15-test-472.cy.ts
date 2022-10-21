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
  'INDIVIDUALS/PERSONS': {
    'Individual Receipt': {
      contributionDate: new Date('12/12/2012'),
      contributionAmount: _.random(10, 500, false),
    },
  },
};
const tTreeIndividualA = generateTransactionObject(indvRecTree);
const tTreeIndividualB = generateTransactionObject(indvRecTree);
const transactionIndvA = tTreeIndividualA['INDIVIDUALS/PERSONS']['Individual Receipt'];
const transactionIndvB = tTreeIndividualB['INDIVIDUALS/PERSONS']['Individual Receipt'];

const tTreeIndividualC = generateTransactionObject(indvRecTree);
const transactionIndvC = tTreeIndividualC['INDIVIDUALS/PERSONS']['Individual Receipt'];
transactionIndvC['contributionDate'] = new Date('12/12/2013');

//Organization Transactions
const orgRecTree = {
  'INDIVIDUALS/PERSONS': {
    'Tribal Receipt': {
      contributionDate: new Date('12/12/2012'),
      contributionAmount: _.random(10, 500, false),
    },
  },
};
const tTreeOrganizationA = generateTransactionObject(orgRecTree);
const tTreeOrganizationB = generateTransactionObject(orgRecTree);
const transactionOrgA = tTreeOrganizationA['INDIVIDUALS/PERSONS']['Tribal Receipt'];
const transactionOrgB = tTreeOrganizationB['INDIVIDUALS/PERSONS']['Tribal Receipt'];

const tTreeOrganizationC = generateTransactionObject(orgRecTree);
const transactionOrgC = tTreeOrganizationC['INDIVIDUALS/PERSONS']['Tribal Receipt'];
transactionOrgC['contributionDate'] = new Date('12/12/2013');

//JF Transfer Transfers
const JFTransTree = {
  TRANSFERS: {
    'Joint Fundraising Transfer': {
      contributionDate: new Date('12/12/2012'),
      contributionAmount: _.random(10, 250, false),
    },
  },
};
const tTreeJFTransA = generateTransactionObject(JFTransTree);
const tTreeJFTransB = generateTransactionObject(JFTransTree);
const transactionJFA = tTreeJFTransA['TRANSFERS']['Joint Fundraising Transfer'];
const transactionJFB = tTreeJFTransB['TRANSFERS']['Joint Fundraising Transfer'];

const tTreeJFTransC = generateTransactionObject(JFTransTree);
const transactionJFC = tTreeJFTransC['TRANSFERS']['Joint Fundraising Transfer'];
transactionJFC['contributionDate'] = new Date('12/12/2013');

//JF Transfer Memos
const JFMemoA = transactionJFA['childTransactions'][0];
JFMemoA['contributionDate'] = new Date('12/12/2012');
JFMemoA['contributionAmount'] = _.random(10, 200, false);
const JFMemoB = transactionJFB['childTransactions'][0];
JFMemoB['contributionDate'] = new Date('12/12/2012');
JFMemoB['contributionAmount'] = _.random(10, 200, false);
const JFMemoC = transactionJFC['childTransactions'][0];
JFMemoC['contributionDate'] = new Date('12/12/2013');
JFMemoC['contributionAmount'] = _.random(10, 500, false);

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
  cy.get('button[label="Save & add another"]').click();
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

  cy.get('button[label="Save & add another"]').click();
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
      [transactionIndvA, transactionIndvB, transactionIndvC]
    );

    testAggregation(
      contactOrganization,
      ['INDIVIDUALS/PERSONS', 'Tribal Receipt'],
      [transactionOrgA, transactionOrgB, transactionOrgC]
    );

    testAggregation(
      contactCommittee,
      ['TRANSFERS', 'Joint Fundraising Transfer'],
      [transactionJFA, transactionJFB, transactionJFC]
    );
  });

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
    cy.contains('li', 'PAC JF Transfer Memo').click();
    cy.longWait();

    const contact = contactCommittee;
    const transactions = [JFMemoA, JFMemoB, JFMemoC];
    cy.get('p-autocomplete[formcontrolname="selectedContact"]').safeType(contact['name']);
    cy.medWait();
    cy.contains('li', 'In contacts').click({ force: true });
    cy.medWait();
    enterTransactionSchA(transactions[0]);
    cy.shortWait();
    cy.get('button[label="Save & add another Memo"]').click();
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

    cy.get('button[label="Save & add another Memo"]').click();
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
});
