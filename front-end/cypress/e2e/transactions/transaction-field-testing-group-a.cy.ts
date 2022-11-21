// @ts-check

import _ from 'lodash';
import { generateReportObject } from '../../support/generators/reports.spec';
import { navigateTransactionAccordion } from '../../support/transactions.spec';
import { groupANavTree, TransactionFields } from '../../support/transaction_nav_trees.spec';
import { committeeID, randomString } from '../../support/generators/generators.spec';
import {
  generateTransactionObject,
  getTransactionFormByName,
  PairedTransaction,
  Transaction,
} from '../../support/generators/transactions.spec';
import { enterContact } from '../../support/contacts.spec';

function testField(fieldName, fieldRules, number: boolean = false) {
  const fieldLength = fieldRules['maxLength'];
  const required = Object.keys(fieldRules).includes('required') && fieldRules['required'];
  cy.get(fieldName).overwrite('{selectAll}{backspace}');
  cy.get('h1').first().click({ scrollBehavior: false, force: true }); //We do this to force refresh the errors in a field

  if (required) {
    cy.get(fieldName).parent().find('.p-error').should('exist');
  }

  let randString: string;
  if (number) {
    randString = randomString(fieldLength - 3, 'numeric');
    if (randString[0] == '0') {
      randString = randString.replace('0', '1'); //If the first char you write in is a 0, you get *weird* behavior
    }
  } else if (fieldRules['fieldName'] == 'donor_committee_fec_id') {
    randString = committeeID();
  } else {
    randString = randomString(fieldLength, 'special');
  }

  cy.get(fieldName).overwrite(randString);
  cy.get('h1').first().click({ scrollBehavior: false, force: true });
  cy.get(fieldName).parent().find('.p-error').should('not.exist');

  cy.get(fieldName).overwrite(randString + randString[1]);
  cy.get('h1').first().click({ scrollBehavior: false, force: true });
  cy.get(fieldName).parent().find('.p-error').should('exist');
}

function testFields(fields, entityType) {
  for (let field of Object.keys(fields)) {
    const fieldRules = TransactionFields[field];
    const fieldName = fieldRules['fieldName'];

    const readOnly = Object.keys(fieldRules).includes('readOnly') && fieldRules['readOnly'];
    const universalField = !('entities' in fieldRules);
    const belongsToEntity = _.includes(fieldRules['entities'], entityType);
    //Skip if field is read only or doesn't belong to the Transaction's entity type
    if (readOnly || (!universalField && !belongsToEntity)) {
      continue;
    }

    //Skip if it's the entity_type field
    if (fieldRules['fieldName'] == 'entity_type_dropdown') {
      continue;
    }

    const fieldType = fieldRules['fieldType'];
    let selector: string;
    switch (fieldType) {
      case 'Text':
        selector = `input[formControlName=${fieldName}]`;
        testField(selector + ':visible', fieldRules);
        break;
      case 'P-InputNumber':
        selector = `p-inputnumber[formControlName=${fieldName}]`;
        testField(selector + ':visible', fieldRules, true);
        break;
      case 'Textarea':
        selector = `textarea[formControlName=${fieldName}]`;
        testField(selector + ':visible', fieldRules);
        break;
      case 'Dropdown':
        if (fieldName === 'entity_type_dropdown') selector = `#${fieldName}:visible`;
        else selector = `p-dropdown:visible[formControlName=${fieldName}`;
        cy.get(selector).parent().find('app-error-messages').should('not.have.length', 0);
    }
  }
}

function testSingleTransaction(transaction: Transaction, doExit = true) {
  const transactionForm = getTransactionFormByName(transaction.transaction_name);

  if (!transactionForm) {
    console.log('Failed to find a transaction form!', transaction);
    return;
  }

  const entityRules = transactionForm.entity_type;
  if (entityRules?.entities && entityRules.entities.length > 1) {
    console.log('Yes, dropdown please!');
    cy.dropdownSetValue('p-dropdown:visible[id="entity_type_dropdown"]', transaction.entity_type);
  }
  cy.shortWait();
  cy.contains('a:visible', 'Create a new contact').click();
  cy.medWait();
  enterContact(transaction.contact, true, true);
  cy.medWait();

  const fields = transaction.fields;

  //Gets the value of the first field-key in the form that starts with "entityType"
  const entityTypes = transactionForm.entity_type.entities;

  for (const entityType of entityTypes) {
    cy.contains('button', 'Save').first().click();
    if (entityTypes.length > 1) {
      cy.dropdownSetValue('p-dropdown:visible[id="entity_type_dropdown"]', entityType);
      cy.shortWait();
    }
    console.log('Fields:', fields);
    testFields(fields, entityType);
  }

  if (doExit) {
    cy.contains('button', 'Cancel').click();
    cy.shortWait();
  }
}

function testPairedTransaction(pairedTransaction: PairedTransaction) {
  cy.contains('p-accordiontab', 'STEP ONE').click();
  cy.shortWait();
  testSingleTransaction(pairedTransaction.transactionA, false);

  cy.contains('p-accordiontab', 'STEP TWO').click();
  cy.shortWait();
  testSingleTransaction(pairedTransaction.transactionB, true);
}

describe('Test max lengths, requirements, and allowed characters on all fields on all transactions', () => {
  before('Logs in and creates a dummy report', () => {
    cy.login();
    cy.visit('/dashboard');
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.shortWait();
    const report = generateReportObject();
    cy.createReport(report);
  });

  after('Cleanup', () => {
    cy.login();
    cy.visit('/dashboard');
    cy.deleteAllReports();
  });

  const navTree = groupANavTree;
  const transactionPairs = [];
  for (const tCategory of Object.keys(navTree)) {
    for (const tName of Object.keys(navTree[tCategory])) {
      transactionPairs.push([tCategory, tName]);
    }
  }

  for (let i = 0; i < transactionPairs.length; i += 1) {
    const [tCategory, tName] = transactionPairs[i];
    context('', (transactionName = tName, category = tCategory) => {
      it(`Tests the fields of ${transactionName}`, () => {
        cy.login();
        cy.visit('/dashboard');
        cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
        cy.shortWait();
        cy.get('p-button[icon="pi pi-pencil"]').click();
        cy.shortWait();
        cy.navigateToTransactionManagement();
        cy.medWait();

        cy.get('button[label="Add new transaction"]').click();
        cy.shortWait();

        navigateTransactionAccordion(category, transactionName);
        cy.shortWait();

        const transaction: Transaction | PairedTransaction = generateTransactionObject({
          transaction_name: transactionName,
        });

        if (transaction.fields) {
          testSingleTransaction(transaction);
        } else if (transaction.transactionA) {
          testPairedTransaction(transaction);
        }
      });
    });
  }
});
