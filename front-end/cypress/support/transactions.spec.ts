import { TransactionTree } from './generators/transactions.spec';
import { TransactionFields } from './transaction_nav_trees.spec';
import { Transaction } from './generators/transactions.spec';
import { generateContactObject, Contact } from './generators/contacts.spec';
import _ from 'lodash';
import { enterContact } from './contacts.spec';

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
export function createTransactionSchA(
  transactionTree: TransactionTree, 
  contact: Contact, 
  save = true
) {
  const category = Object.keys(transactionTree)[0];
  const transactionType = Object.keys(transactionTree[category])[0];
  const transaction = transactionTree[category][transactionType];

  cy.get('button[label="Add new transaction"]').click();
  cy.shortWait();

  navigateTransactionAccordion(category, transactionType);
  cy.medWait();
  enterTransactionSchA(transaction, contact);

  if (save) {
    if (transaction.childTransactions) {
      for (let i = 0; i < transaction['childTransactions'].length; i++) {
        const childTransaction = transaction['childTransactions'][i];

        if (i == 0) {
          cy.get('button[label="Save & add a Memo"]').click();
        } else {
          cy.get('button[label="Save & add another Memo"]').click();
        }
        cy.shortWait();
        cy.get('.p-confirm-dialog-accept').click();
        cy.longWait();
        cy.url().should('contain', 'sub-transaction');
        enterTransactionSchA(childTransaction, contact);
      }
    }
    cy.get('button[label="Save & view all transactions"]').click();
    cy.shortWait();
    cy.get('.p-confirm-dialog-accept').click();
    cy.medWait();

  }
}

export function enterTransactionSchA(transaction: Transaction, contact: Contact) {
  const fields = Object.keys(transaction);

  //Gets the value of the first field-key in the form that starts with "entityType"
  const entityTypeKey =  
    Object.keys(transaction).find((key) => {
      return key.startsWith('entityType');
    }) as string;

  const entityType = transaction[entityTypeKey];
  const entityRules = TransactionFields[entityTypeKey];
  if (entityRules["entities"].length > 1 ){
    const contactEntity = contact["contact_type"];
    cy.dropdownSetValue('.p-dropdown', contactEntity);
  }

  cy.contains('a', 'Create a new contact').click();
  cy.medWait();
  enterContact(contact, true, true);
  cy.medWait();

  for (const field of fields) {
    if (field == 'childTransactions') continue;

    const fieldRules = TransactionFields[field];
    const fieldName = fieldRules['fieldName'];

    const readOnly = 'readOnly' in fieldRules && fieldRules['readOnly'];
    const universalField = !('entities' in fieldRules);
    const belongsToEntity = _.includes(fieldRules['entities'], entityType);
    //Skip if field is read only or doesn't belong to the Transaction's entity type
    if (readOnly || (!universalField && !belongsToEntity)) {
      continue;
    }

    const fieldType = fieldRules['fieldType'];
    const fieldValue = transaction[field];
    fillFormField(fieldName, fieldValue, fieldType);
  }
}

function fillFormField(fieldName: string, fieldValue: string, fieldType: string) {
  switch (fieldType) {
    case 'Text':
      cy.get(`input[formControlName=${fieldName}]`).safeType(fieldValue);
      break;
    case 'P-InputNumber':
      cy.get(`p-inputnumber[formControlName=${fieldName}]`).safeType(fieldValue);
      break;
    case 'Textarea':
      cy.get(`textarea[formControlName=${fieldName}]`).safeType(fieldValue);
      break;
    case 'Dropdown':
      if (fieldName === 'entity_type_dropdown') cy.dropdownSetValue(`#${fieldName}`, fieldValue);
      else cy.dropdownSetValue(`p-dropdown[formControlName=${fieldName}]`, fieldValue);
      break;
    case 'Calendar':
      cy.calendarSetValue(`p-calendar[formControlName=${fieldName}]`, fieldValue);
      break;
  }
}
