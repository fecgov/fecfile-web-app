// @ts-check

import { enterContact } from '../../support/contacts.spec';
import { generateContactCommittee, generateContactIndividual, generateContactOrganization, generateContactToFit } from '../../support/generators/contacts.spec';
import { generateReportObject } from '../../support/generators/reports.spec';
import { generateTransactionObject } from '../../support/generators/transactions.spec';
import { createTransactionSchA, enterTransactionSchA } from '../../support/transactions.spec';

describe('QA Script 244 (Sprint 8)', () => {
  after(() => {
    cy.login();
    cy.visit('/dashboard');
    cy.deleteAllReports();
    cy.deleteAllContacts();
  });

  const contactIndividual = generateContactIndividual({});
  const contactOrganization = generateContactOrganization({});
  const contactCommittee = generateContactCommittee({});

  it('', () => {
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

    cy.navigateToTransactionManagement();

    //Step 3: Test aggregation for individuals

    const transactionA = generateTransactionObject({"INDIVIDUALS/PERSONS":{"Individual Receipt":{}}});
    cy.get('button[label="Add new transaction"]').click();
    cy.shortWait();
    cy.navigateTransactionAccordion("INDIVIDUALS/PERSONS", "Individual Receipt");
    cy.get('p-autocomplete[formcontrolname="selectedContact"]').safeType(contactIndividual["name"]);
    cy.medWait();
    cy.contains('li', 'In contacts').click({force:true});
    cy.medWait();
  });
});
