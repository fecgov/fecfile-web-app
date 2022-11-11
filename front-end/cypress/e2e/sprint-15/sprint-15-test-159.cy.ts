// @ts-check

import { generateContactIndividual } from '../../support/generators/contacts.spec';
import { generateReportObject } from '../../support/generators/reports.spec';
import { generateTransactionObject } from '../../support/generators/transactions.spec';
import { enterTransactionSchA } from '../../support/transactions.spec';

const contactIndividual = generateContactIndividual({});
const transactionIndv = generateTransactionObject({
  transaction_name: 'Individual Receipt',
  contact: contactIndividual,
  isNewContact: false,
});

describe('QA Script 159 (Sprint 15)', () => {
  after(() => {
    cy.login();
    cy.visit('/dashboard');
    cy.deleteAllReports();
    cy.deleteAllContacts();
  });

  before('', () => {
    //Step 1: Log in, navigate to the contacts page and creates the individual contact
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

    enterTransactionSchA(transactionIndv);
    cy.shortWait();

    cy.get('input[formControlName="contributor_city"]').overwrite('TESTOPOLIS');
    cy.get('input[formControlName="contributor_suffix"]').overwrite('XI');
    cy.shortWait();

    cy.contains('button', 'Save & view all transactions').click();
    cy.shortWait();
    cy.get('.p-confirm-dialog-reject').click();
    cy.shortWait();
    cy.contains('button', 'Save & view all transactions').click();

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
