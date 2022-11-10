// @ts-check

import * as _ from 'lodash';
import {
  generateContactCommittee,
  generateContactIndividual,
  generateContactOrganization,
} from '../../support/generators/contacts.spec';
import { generateReportObject } from '../../support/generators/reports.spec';
import { generateTransactionObject } from '../../support/generators/transactions.spec';

//Contacts
const contactIndividual = generateContactIndividual({});
const contactOrganization = generateContactOrganization({});
const contactCommittee = generateContactCommittee({});

//Individual Transactions
const transactionIndividual = generateTransactionObject({
  transaction_name: 'Individual Receipt',
  contact: contactIndividual,
});

//Organization Transactions
const transactionOrganization = generateTransactionObject({
  transaction_name: 'Tribal Receipt',
  contact: contactOrganization,
});

//JF Transfer Transfers
const transactionCommittee = generateTransactionObject({
  transaction_name: 'Party Receipt',
  contact: contactCommittee,
});

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
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.medWait();

    //Step 2: Create a report and navigate to the transactions page
    const report = generateReportObject();
    cy.createReport(report);
  });

  it('Tests contact creation', () => {
    cy.login();
    cy.visit('/dashboard');
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.medWait();
    cy.navigateToTransactionManagement();
    cy.medWait();
    cy.createTransactionSchA(transactionIndividual);
    cy.medWait();
    cy.createTransactionSchA(transactionOrganization);
    cy.medWait();
    cy.createTransactionSchA(transactionCommittee);
    cy.medWait();

    cy.get('.p-menubar').find('.p-menuitem-link').contains('Contacts').click();
    cy.medWait();
    cy.contains('td', contactIndividual['name']).should('exist');
    cy.contains('td', contactOrganization['name']).should('exist');
    cy.contains('td', contactCommittee['name']).should('exist');
  });
});
