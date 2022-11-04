// @ts-check

import * as _ from 'lodash';
import { generateContactIndividual } from '../../support/generators/contacts.spec';
import { generateReportObject } from '../../support/generators/reports.spec';
import { generateTransactionObject } from '../../support/generators/transactions.spec';
import { enterTransactionSchA } from '../../support/transactions.spec';

const contactIndividual = generateContactIndividual({});
const indvRecTree = {
  'INDIVIDUALS/PERSONS': {
    'Individual Receipt': {
      contributionDate: new Date('12/12/2012'),
      contributionAmount: _.random(10, 500, false),
    },
  },
};
const tTreeIndividual = generateTransactionObject(indvRecTree);
const transactionIndv = tTreeIndividual['INDIVIDUALS/PERSONS']['Individual Receipt'];

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

    cy.get('button[label="Add new transaction"]').click();
    cy.shortWait();
    cy.navigateTransactionAccordion('INDIVIDUALS/PERSONS', 'Individual Receipt');

    cy.get('p-autocomplete[formcontrolname="selectedContact"]').safeType(contactIndividual['name']);
    cy.medWait();
    cy.contains('li', 'In contacts').click({ force: true });
    cy.medWait();
    enterTransactionSchA(transactionIndv);
    cy.shortWait();

    cy.get('input[formControlName="contributor_city"]').overwrite('TESTOPOLIS');
    cy.get('input[formControlName="contributor_suffix"]').overwrite('XI');
    cy.shortWait();

    cy.get('button[label="Save & view all transactions"]').click();
    cy.shortWait();
    cy.get('.p-confirm-dialog-reject').click();
    cy.shortWait();
    cy.get('button[label="Save & view all transactions"]').click();

    cy.contains('.p-confirm-dialog-message', 'XI').should('exist');
    cy.contains('.p-confirm-dialog-message', 'TESTOPOLIS').should('exist');
    cy.get('.p-confirm-dialog-accept').click();
    cy.shortWait();

    cy.get('.p-menubar').find('.p-menuitem-link').contains('Contacts').click();
    cy.medWait();

    cy.contains('tr', contactIndividual['name']).get('p-button[icon="pi pi-pencil"]').click();
    cy.shortWait();

    cy.get('input[formControlName="city"]').should('have.value', 'TESTOPOLIS');
    cy.get('input[formControlName="suffix"]').should('have.value', 'XI');
  });
});
