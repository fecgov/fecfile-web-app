// @ts-check

import { randomString, candidateID, committeeID } from '../../support/generators/generators.spec';

const contactFields: object = {
  //Contains the max allowable length for any given field
  Individual: {
    last_name: 30,
    first_name: 20,
    middle_name: 20,
    prefix: 10,
    suffix: 10,
    street_1: 34,
    street_2: 34,
    city: 30,
    zip: 9,
    telephone: 10,
    employer: 38,
    occupation: 38,
  },
  Candidate: {
    last_name: 30,
    first_name: 20,
    middle_name: 20,
    prefix: 10,
    suffix: 10,
    street_1: 34,
    street_2: 34,
    city: 30,
    zip: 9,
    telephone: 10,
    employer: 38,
    occupation: 38,
    candidate_id: 9,
  },
  Committee: {
    street_1: 34,
    street_2: 34,
    city: 30,
    zip: 9,
    telephone: 10,
    committee_id: 9,
    name: 200,
  },
  Organization: {
    street_1: 34,
    street_2: 34,
    city: 30,
    zip: 9,
    telephone: 10,
    name: 200,
  },
};

const fieldsRequired: Array<string> = [
  'street_1',
  'city',
  'zip',
  'name',
  'first_name',
  'last_name',
  'committee_id',
  'candidate_id',
];

function testField(cType, field) {
  const strLength = contactFields[cType][field];

  if (fieldsRequired.includes(field)) {
    cy.get('#' + field)
      .parent()
      .should('contain', 'This is a required field');
  }

  let randString = '';
  if (field == 'telephone') {
    randString = randomString(strLength, 'numeric');
  } else if (field == 'candidate_id') {
    randString = candidateID('Presidential');
  } else if (field == 'committee_id') {
    randString = committeeID();
  } else {
    randString = randomString(strLength, 'special');
  }

  cy.get('#' + field)
    .safeType(randString)
    .parent()
    .find('app-error-messages')
    .children()
    .should('have.length', 0);
  cy.get('#' + field).safeType('0');

  if (field != 'telephone') {
    cy.get('#' + field)
      .parent()
      .find('app-error-messages')
      .should('contain', `This field cannot contain more than ${strLength}`);
  } else {
    cy.get('#' + field)
      .parent()
      .find('app-error-messages')
      .should('contain', `This field must contain ${strLength} numeric characters`);
  }
}

let contactType: string;
const contacts: object = { Individual: {}, Candidate: {}, Committee: {}, Organization: {} };

describe('Tests the maximum length and required/not-required for each field', () => {
  beforeEach('Logs in', () => {
    cy.login();
    cy.visit('/dashboard');
  });

  for (contactType of Object.keys(contacts)) {
    it(`${contactType} - Check every field for required/optional and maximum length`, () => {
      cy.visit('/dashboard');
      cy.url().should('contain', '/dashboard');
      cy.get('.p-menubar').find('.p-menuitem-link').contains('Contacts').click();
      cy.url().should('contain', '/contacts');

      cy.get("button[label='New']").click();
      cy.shortWait();
      cy.get("div[role='dialog']").contains('Add Contact').should('exist');

      cy.dropdownSetValue("p-dropdown[FormControlName='type']", contactType);
      cy.shortWait();
      cy.get("button[label='Save']").click(); //Clicking the save button populates the fields with 'required' error messages
      cy.shortWait();

      for (const field of Object.keys(contactFields[contactType])) {
        testField(contactType, field);
      }

      cy.get("p-dropdown[FormControlName='country']").should('contain', 'United States of America');
      cy.get("p-dropdown[FormControlName='state']").click();
      cy.get('p-dropdownitem').should('not.have.length', 0);

      cy.get("button[label='Cancel']").click();
      cy.shortWait();
    });
  }
});
