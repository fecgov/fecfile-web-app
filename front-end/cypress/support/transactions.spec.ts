import _ from 'lodash';
import {
  TransactionTree,
  Transaction,
  transaction_matches_contact,
  wrap_transaction_with_tree,
  getTransactionFormByName,
} from './generators/transactions.spec';
import { PairedTransactionForm, TransactionFields } from './transaction_nav_trees.spec';
import { Contact, generateContactToFit } from './generators/contacts.spec';
import { enterContact } from './contacts.spec';
import { PairedTransaction } from './generators/transactions.spec';

//Run this on the transaction creation accordion to navigate to the desired transaction
export function navigateTransactionAccordion(category: string, transactionType: string) {
  cy.get('p-accordiontab').contains('p-accordiontab', category).click();
  cy.shortWait();
  cy.get('a').contains(transactionType).click();
  cy.medWait();
}

/*
 *                Create Transaction (Schedule A)
 *  Run this function while Cypress is on the View All Transactions page
 *  to create a new transaction.
 *
 *  @transaction: the Transaction object to be used (see: the Transaction Generator file)
 *  @save: Boolean.  Controls whether or not to save when finished. (Default: True)
 */
export function createTransactionSchA(transaction: Transaction | PairedTransaction, save = true) {
  const category = transaction.transaction_category;
  const transactionType = transaction.transaction_name;

  cy.get('button[label="Add new transaction"]').click();
  cy.shortWait();

  navigateTransactionAccordion(category, transactionType);
  cy.medWait();

  if (transaction?.fields) {
    return createSingleTransaction(transaction as Transaction, save);
  } else if (transaction?.transactionA) {
    return createPairedTransaction(transaction as PairedTransaction, save);
  }
}

function createSingleTransaction(transaction: Transaction, save = true) {
  enterTransactionSchA(transaction);

  if (save) {
    if (transaction.childTransactions) {
      for (let i = 0; i < transaction.childTransactions.length; i++) {
        const childTransaction = transaction.childTransactions[i];
        const childName = childTransaction.transaction_name;

        cy.get('p-dropdown[formcontrolname="subTransaction"]').click();
        cy.contains('li', childName).click();
        if (i == 0) {
          cy.get('.p-confirm-dialog-accept').click();
        }
        cy.longWait();
        enterTransactionSchA(childTransaction);

        cy.contains('button', 'Save & add another').click();
        cy.shortWait();
        cy.get('.p-confirm-dialog-accept').click();
        cy.shortWait();
        cy.contains('button', 'Back to').click();
        cy.shortWait();
        cy.medWait();
      }
      cy.contains('button', 'Cancel').click();
      cy.medWait();
    } else {
      cy.contains('button', 'Save & view all transactions').click();
      cy.shortWait();
      cy.get('.p-confirm-dialog-accept').click();
      cy.medWait();
    }
  }
}

function createPairedTransaction(transaction: PairedTransaction, save = true) {
  console.log(transaction.transactionA);
  console.log(transaction.transactionB);

  cy.contains('p-accordiontab', 'STEP ONE').click();
  enterTransactionSchA(transaction.transactionA);
  cy.shortWait();

  cy.contains('p-accordiontab', 'STEP TWO').click();
  console.log('Earmark:', transaction);
  enterTransactionSchA(transaction.transactionB);
  cy.shortWait();

  if (save) {
    cy.contains('button', 'Save & view all transactions').click();
    if (transaction.transactionA.isNewContact) {
      cy.shortWait();
      cy.get('.p-confirm-dialog-accept').first().click();
    }
    if (transaction.transactionB.isNewContact) {
      cy.shortWait();
      cy.get('.p-confirm-dialog-accept').first().click();
    }
    cy.longWait();
  }
}

export function enterTransactionSchA(transaction: Transaction) {
  const contact = transaction.contact;
  const fields = Object.keys(transaction.fields);

  const entityType = transaction.entity_type;
  const tForm = getTransactionFormByName(transaction.transaction_name);
  if (tForm?.entity_type?.entities?.length > 1) {
    cy.dropdownSetValue('.p-dropdown', transaction.entity_type);
  }

  if (transaction.isNewContact) {
    cy.contains('a:visible', 'Create a new contact').click();
    cy.medWait();
    enterContact(contact, true, true);
    cy.medWait();
  }

  for (const field of fields) {
    const fieldRules = TransactionFields[field];
    const fieldName = fieldRules['fieldName'];

    const readOnly = fieldRules['readOnly'] ?? false;
    const universalField = !Object.keys(fieldRules).includes('entities');
    const belongsToEntity = fieldRules['entities']?.includes(entityType) ?? true;
    //Skip if field is read only or doesn't belong to the Transaction's entity type
    if (readOnly || (!universalField && !belongsToEntity)) {
      continue;
    }

    const fieldType = fieldRules['fieldType'];
    const fieldValue = transaction.fields[field];
    fillFormField(fieldName, fieldValue, fieldType);
  }
}

function fillFormField(fieldName: string, fieldValue: string, fieldType: string) {
  switch (fieldType) {
    case 'Text':
      cy.get(`input:visible[formControlName=${fieldName}]`).safeType(fieldValue);
      break;
    case 'P-InputNumber':
      cy.get(`p-inputnumber:visible[formControlName=${fieldName}]`).safeType(fieldValue);
      break;
    case 'Textarea':
      cy.get(`textarea:visible[formControlName=${fieldName}]`).safeType(fieldValue);
      break;
    case 'Dropdown':
      if (fieldName === 'entity_type_dropdown') cy.dropdownSetValue(`#${fieldName}`, fieldValue);
      else cy.dropdownSetValue(`p-dropdown:visible[formControlName=${fieldName}]`, fieldValue);
      break;
    case 'Calendar':
      cy.calendarSetValue(`p-calendar:visible[formControlName=${fieldName}]`, fieldValue);
      break;
  }
}
