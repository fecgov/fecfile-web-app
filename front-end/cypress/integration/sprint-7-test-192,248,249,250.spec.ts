// @ts-check

import * as _ from 'lodash';

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

let contactType: string;
let contacts: object = { Individual: {}, Candidate: {}, Committee: {}, Organization: {} };

function randomString(strLength: number, charType: string = 'alphanumeric'): string {
  // prettier-ignore
  const alphanumeric: Array<string> = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9',];
  // prettier-ignore
  const alphabet: Array<string> =   ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9',];
  // prettier-ignore
  const numeric: Array<string> = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  let characters: Array<string> = [];
  if (charType == 'alphanumeric') {
    characters = alphanumeric;
  } else if (charType == 'numeric') {
    characters = numeric;
  } else if (charType == 'alphabet') {
    characters = alphabet;
  } else {
    console.log('RandomString: Invalid charType');
    return '';
  }

  let outString: string = '';
  while (outString.length < strLength) {
    outString += _.sample(characters);
  }
  return outString;
}

describe('QA Test Scripts #192, #248, #249, & #250 (Sprint 7)', () => {
  it('Step 1: Navigate to contacts page', () => {
    cy.visit('/dashboard');
    cy.url().should('contain', '/dashboard');
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Contacts').click();
    cy.url().should('contain', '/contacts');
  });

  for (contactType of Object.keys(contacts)) {
    context(`---> ${contactType}`, (cType = contactType) => {
      it('Check every field for required/optional and maximum length', () => {
        cy.get("button[label='New']").click();
        cy.wait(50);
        cy.get("div[role='dialog']").contains('Add Contact').should('exist');

        cy.dropdownSetValue("p-dropdown[FormControlName='type']", cType);
        cy.wait(50);
        cy.get("button[label='Save']").click();
        cy.wait(50);

        for (let field of Object.keys(contactFields[cType])) {
          let strLength: number = contactFields[cType][field];

          if (fieldsRequired.includes(field)) {
            cy.get('#' + field)
              .parent()
              .should('contain', 'This is a required field');
          }

          let randString: string = '';
          if (field == 'telephone') {
            randString = randomString(strLength, 'numeric');
          } else {
            randString = randomString(strLength);
          }

          cy.get('#' + field)
            .safeType(randString)
            .parent()
            .find('app-error-messages')
            .children()
            .should('have.length', 0);
          cy.get('#' + field)
            .safeType('0')
            .parent()
            .find('app-error-messages')
            .should('contain', `This field cannot contain more than ${strLength}`);
        }

        cy.get("p-dropdown[FormControlName='country']").should('contain', 'United States of America');
        cy.get("p-dropdown[FormControlName='state']").click();
        cy.get('p-dropdownitem').should('not.have.length', 0);

        cy.get("button[label='Cancel']").click();
        cy.wait(50);
      });
    });
  }
});
