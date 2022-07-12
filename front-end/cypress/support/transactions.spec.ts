import { Transaction } from './generators/transactions.spec';
import { dropdownSetValue, calendarSetValue, medWait, safeType } from './commands';
import { TransactionFields } from './transaction_nav_trees.spec';
import { notDeepStrictEqual } from 'assert';
import _, { forEach } from 'lodash';

//Run this on the transaction creation accordion to navigate to the desired transaction
function navigateTransactionAccordion(category: string, transactionType: string) {
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
 *  transaction: the Transaction object to be used (see the Transaction Generator file)
 *  save: Boolean.  Controls whether or not to save when finished. (Default: True)
 */
export function enterTransactionSchA(transaction: Transaction, save: boolean = true) {
  cy.get('button[label="Add new transaction"]').click();
  cy.shortWait();

  const category = Object.keys(transaction)[0];
  const transactionType = Object.keys(transaction[category])[0];
  navigateTransactionAccordion(category, transactionType);
  cy.medWait();

  const form = transaction[category][transactionType];
  const fields = Object.keys(form);

  for (let field of fields) {
    const fieldRules = TransactionFields[field];
    const fieldName = fieldRules['fieldName'];
    const entityType = form['entityType'];

    const readOnly: boolean = 'readOnly' in fieldRules && fieldRules['readOnly'];
    console.log(fieldRules, readOnly);
    //If a field is universal *or* that field belongs to this Transaction's entity type
    const belongsToEntity: boolean = !('entities' in fieldRules) || _.includes(fieldRules['entities'], entityType);
    if (readOnly || !belongsToEntity) {
      console.log(`Skipped ${field}`);
      continue; //Then skip it
    }

    const fieldType = fieldRules['fieldType'];
    const fieldValue = form[field];
    switch (fieldType) {
      case 'Text':
        cy.get(`input[formControlName=${fieldName}]`).safeType(fieldValue);
        break;
      case 'P-InputNumber':
        cy.get(`p-inputnumber[formControlName=${fieldName}]`).safeType(fieldValue);
        break;
      case 'Textarea':
        cy.get(`textarea[formControlName=${fieldName}]`).safeType(fieldValue);
      case 'Dropdown':
        cy.dropdownSetValue(`p-dropdown[formControlName=${fieldName}]`, fieldValue);
        break;
      case 'Calendar':
        cy.calendarSetValue(`p-calendar[formControlName=${fieldName}]`, fieldValue);
        break;
    }
  }
}
