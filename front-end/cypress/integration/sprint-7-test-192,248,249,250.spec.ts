// @ts-check

import * as _ from 'lodash';

const ContactFields: object = {
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

const FieldsRequired: Array<string> = [
  'street_1',
  'city',
  'zip',
  'name',
  'first_name',
  'last_name',
  'committee_id',
  'candidate_id',
];

let ContactType: string;
let Contacts: object = { Individual: {}, Candidate: {}, Committee: {}, Organization: {} };

function RandomString(Length, Type = 'alphanumeric'): string {
  // prettier-ignore
  const Alphanumeric: Array<string> = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9',];
  // prettier-ignore
  const Alphabet: Array<string> =   ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9',];
  // prettier-ignore
  const Numeric: Array<string> = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  let Characters: Array<string> = [];
  if (Type == 'alphanumeric') {
    Characters = Alphanumeric;
  } else if (Type == 'numeric') {
    Characters = Numeric;
  } else if (Type == 'alphabet') {
    Characters = Alphabet;
  } else {
    console.log('RandomString: Invalid type');
    return '';
  }

  let outString: string = '';
  while (outString.length < Length) {
    outString += _.sample(Characters);
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

  for (let i: number = 0; i < Object.keys(Contacts).length; i++) {
    ContactType = Object.keys(Contacts)[i];

    context(`---> ${ContactType}`, (c_type = ContactType) => {
      let Contact: object = Contacts[c_type];
      it('Check every field for required/optional and maximum length', () => {
        cy.get("button[label='New']").click();
        cy.wait(50);
        cy.get("div[role='dialog']").contains('Add Contact').should('exist');

        cy.DropdownSetValue("p-dropdown[FormControlName='type']", c_type);
        cy.wait(50);
        cy.get("button[label='Save']").click();
        cy.wait(50);

        for (let j: number = 0; j < Object.keys(ContactFields[c_type]).length; j++) {
          let Field: string = Object.keys(ContactFields[c_type])[j];
          let Length: number = ContactFields[c_type][Field];

          if (FieldsRequired.includes(Field)) {
            cy.get('#' + Field)
              .parent()
              .should('contain', 'This is a required field');
          }

          let RandString: string = '';
          if (Field == 'telephone') {
            RandString = RandomString(Length, 'numeric');
          } else {
            RandString = RandomString(Length);
          }

          cy.get('#' + Field)
            .SafeType(RandString)
            .parent()
            .find('app-error-messages')
            .children()
            .should('have.length', 0);
          cy.get('#' + Field)
            .SafeType('0')
            .parent()
            .find('app-error-messages')
            .should('contain', `This field cannot contain more than ${Length}`);
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
