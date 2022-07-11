import { Transaction } from './generators/transactions.spec';
import { dropdownSetValue, calendarSetValue, medWait, safeType } from './commands';
import { TransactionFields } from './transaction_nav_trees.spec';
import { notDeepStrictEqual } from 'assert';
import _ from 'lodash';

export function enterTransactionSchA(transaction: object) {
  const tType = transaction['contributor_type'];

  cy.dropdownSetValue('p-dropdown[formcontrolname="entity_type"]', tType);
  cy.shortWait();

  //Contributor
  if (tType == 'Individual' || tType == 'Candidate') {
    cy.get("input[formControlName='contributor_last_name']").safeType(transaction['last_name']);
    cy.get("input[formControlName='contributor_first_name']").safeType(transaction['first_name']);
    cy.get("input[formControlName='contributor_middle_name']").safeType(transaction['middle_name']);
    cy.get("input[formControlName='contributor_prefix']").safeType(transaction['prefix']);
    cy.get("input[formControlName='contributor_suffix']").safeType(transaction['suffix']);
  } else {
    cy.get("input[formControlName='contributor_organization_name']").safeType(transaction['name']);
  }

  //Address
  cy.get("input[formControlName='contributor_street_1']").safeType(transaction['street']);
  cy.get("input[formControlName='contributor_street_2']").safeType(transaction['apartment']);
  cy.get("input[formControlName='contributor_city']").safeType(transaction['city']);
  cy.dropdownSetValue("p-dropdown[formControlName='contributor_state']", transaction['state']);
  cy.get("input[formControlName='contributor_zip']").safeType(transaction['zip']);

  //Contribution
  cy.calendarSetValue("p-calendar[formControlName='contribution_date']", transaction['contribution_date']);
  if (transaction['contribution_memo_item']) {
    cy.get("p-checkbox[formControlName='memo_code']").find("div[class='p-checkbox-box']").click();
  }
  cy.get("p-inputnumber[formControlName='contribution_amount']").safeType(transaction['contribution_amount']);

  //Additional Information
  cy.get("textarea[formControlName='contribution_purpose_descrip']").safeType(transaction['contribution_purpose']);
  cy.get("textarea[formControlName='memo_text_description']").safeType(transaction['contribution_memo']);

  //Save
  cy.get("button[label='Save & view all transactions']").click();
  cy.longWait();
}

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
export function createTransactionSchA(transaction: Transaction, save: boolean = true) {
  cy.get('button[label="Add new transaction"]').click();
  cy.shortWait();

  const category = Object.keys(transaction)[0];
  const transactionType = Object.keys(transaction[category])[0];
  navigateTransactionAccordion(category, transactionType);
  cy.medWait();

  const form = transaction[category][transactionType];
  console.log(form);
  const fields = Object.keys(form);

  for (let field of fields) {
    const fieldRules = TransactionFields[field];
    const inEntity: boolean = 'entities' in fieldRules && !_.includes(fieldRules['entities'], form['entity_type']);

    if (field == 'entity_type' || inEntity) {
      continue;
    }

    const fieldType = fieldRules['fieldType'];
    const fieldValue = form[field];
    switch (fieldType) {
      case 'Text':
        cy.get(`input[formControlName=${field}]`).safeType(fieldValue);
        break;
      case 'P-InputNumber':
        cy.get(`p-inputnumber[formControlName=${field}]`).safeType(fieldValue);
        break;
      case 'Textarea':
        cy.get(`textarea[formControlName=${field}]`).safeType(fieldValue);
      case 'Dropdown':
        cy.dropdownSetValue(`p-dropdown[formControlName=${field}]`, fieldValue);
        break;
      case 'Calendar':
        cy.calendarSetValue(`p-calendar[formControlName=${field}]`, fieldValue);
        break;
    }
  }
}
