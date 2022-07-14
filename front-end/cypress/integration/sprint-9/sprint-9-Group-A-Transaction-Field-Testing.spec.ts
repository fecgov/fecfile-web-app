// @ts-check

import _ from 'lodash';
import { generateReportObject } from '../../support/generators/reports.spec';
import { Transaction, generateTransactionObject } from '../../support/generators/transactions.spec';
import { navigateTransactionAccordion } from '../../support/transactions.spec';
import { TransactionNavTree, groupANavTree, TransactionFields } from '../../support/transaction_nav_trees.spec';
import { committeeID, randomString } from '../../support/generators/generators.spec';
import { shortWait, overwrite } from '../../support/commands';

function testField(fieldName, fieldRules, number: boolean = false) {
  const fieldLength = fieldRules['maxLength'];
  const required = 'required' in Object.keys(fieldRules) && fieldRules['required'];
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
    randString = randomString(fieldLength);
  }

  cy.get(fieldName).overwrite(randString);
  cy.get('h1').first().click({ scrollBehavior: false, force: true });
  cy.get(fieldName).parent().find('.p-error').should('not.exist');

  cy.get(fieldName).overwrite(randString + randString[1]);
  cy.get('h1').first().click({ scrollBehavior: false, force: true });
  cy.get(fieldName).parent().find('.p-error').should('exist');
}

describe('Test max lengths, requirements, and allowed characters on all fields on all transactions', () => {
  before('Logs in and creates a dummy report', () => {
    cy.login();
    cy.deleteAllReports();
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.shortWait();

    const report = generateReportObject();
    cy.enterReport(report);

    cy.get('p-button[icon="pi pi-pencil"]').click();
    cy.shortWait();
    cy.progressReport();
    cy.medWait();
  });

  const navTree = groupANavTree;
  for (let category of Object.keys(navTree)) {
    for (let transactionName of Object.keys(navTree[category])) {
      it(`Tests the fields of ${transactionName}`, () => {
        cy.get('button[label="Add new transaction"]').click();
        cy.shortWait();

        navigateTransactionAccordion(category, transactionName);
        cy.shortWait();

        const fields = Object.keys(groupANavTree[category][transactionName]);

        //Gets the value of the first field-key in the form that starts with "entityType"
        const transactionEntityTypeKey = fields.find((key) => {
          return key.startsWith('entityType');
        });
        const entityTypes = TransactionFields[transactionEntityTypeKey]['entities'];

        for (let entityType of entityTypes) {
          cy.get('button[label="Save & add another"]').click();
          if (entityTypes.length > 1) {
            cy.dropdownSetValue('p-dropdown[formcontrolname="entity_type"]', entityType);
            cy.shortWait();
          }

          for (let field of fields) {
            const fieldRules = TransactionFields[field];
            const fieldName = fieldRules['fieldName'];

            const readOnly = 'readOnly' in fieldRules && fieldRules['readOnly'];
            const universalField = !('entities' in fieldRules);
            const belongsToEntity = _.includes(fieldRules['entities'], entityType);
            //Skip if field is read only or doesn't belong to the Transaction's entity type
            if (readOnly || (!universalField && !belongsToEntity)) {
              continue;
            }

            //Skip if it's the entity_type field
            if (fieldRules['fieldName'] == 'entity_type') {
              continue;
            }

            const fieldType = fieldRules['fieldType'];
            let fieldId: string;
            switch (fieldType) {
              case 'Text':
                fieldId = `input[formControlName=${fieldName}]`;
                testField(fieldId, fieldRules);
                break;
              case 'P-InputNumber':
                fieldId = `p-inputnumber[formControlName=${fieldName}]`;
                testField(fieldId, fieldRules, true);
                break;
              case 'Textarea':
                fieldId = `textarea[formControlName=${fieldName}]`;
                testField(fieldId, fieldRules);
                break;
              case 'Dropdown':
                cy.get(`p-dropdown[formControlName=${fieldName}`)
                  .parent()
                  .find('app-error-messages')
                  .should('not.have.length', 0);
            }
          }
        }

        cy.get('button[label="Cancel"]').click();
        cy.shortWait();
      });
    }
  }

  after('Cleanup', () => {
    cy.deleteAllReports();
    cy.logout();
  });
});
