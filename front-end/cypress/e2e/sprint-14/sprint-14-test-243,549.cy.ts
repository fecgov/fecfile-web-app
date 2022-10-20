// @ts-check

import * as _ from 'lodash';
import { generateContactCommittee, generateContactIndividual, generateContactOrganization } from '../../support/generators/contacts.spec';
import { generateReportObject } from '../../support/generators/reports.spec';
import { generateTransactionObject } from '../../support/generators/transactions.spec';

//Contacts
const contactIndividual = generateContactIndividual({});
const contactOrganization = generateContactOrganization({});
const contactCommittee = generateContactCommittee({});

//Individual Transactions
const indvRecTree = {
  "INDIVIDUALS/PERSONS":{
    "Individual Receipt":{
      "contributionDate": new Date("12/12/2012"),
      "contributionAmount": _.random(10, 500, false)
    }
  }
};
const tTreeIndividualA = generateTransactionObject(indvRecTree);


//Organization Transactions
const orgRecTree = {
  "INDIVIDUALS/PERSONS":{
    "Tribal Receipt":{
      "contributionDate": new Date("12/12/2012"),
      "contributionAmount": _.random(10, 500, false)
    }
  }
};
const tTreeOrganizationA = generateTransactionObject(orgRecTree);

//JF Transfer Transfers
const JFTransTree = {
  "TRANSFERS":{
    "Joint Fundraising Transfer":{
      "contributionDate": new Date("12/12/2012"),
      "contributionAmount": _.random(10, 250, false)
    }
  }
};
const tTreeJFTransA = generateTransactionObject(JFTransTree);


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

  it('Tests contact creation', ()=>{
    cy.login();
    cy.visit('/dashboard');
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.medWait();
    cy.navigateToTransactionManagement();
    cy.medWait();
    cy.createTransactionSchA(tTreeIndividualA, contactIndividual);
    cy.medWait();
    cy.createTransactionSchA(tTreeOrganizationA, contactOrganization);
    cy.medWait();
    cy.createTransactionSchA(tTreeJFTransA, contactCommittee);
    cy.medWait();

    cy.get('.p-menubar').find('.p-menuitem-link').contains('Contacts').click();
    cy.medWait();
    cy.contains('td', contactIndividual['name']).should('exist');
    cy.contains('td', contactOrganization['name']).should('exist');
    cy.contains('td', contactCommittee['name']).should('exist');
  });
});