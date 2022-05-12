// @ts-check

import * as _ from 'lodash';

const contact_fields = {
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

const fields_required = ['street_1', 'city', 'zip', 'name', 'first_name', 'last_name', 'committee_id', 'candidate_id'];

var contact_type;
var contacts = { Individual: {}, Candidate: {}, Committee: {}, Organization: {} };

function randomString(length, type = 'alphanumeric') {
  // prettier-ignore
  const alphanumeric = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9',];
  // prettier-ignore
  const alphabet =   ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9',];
  // prettier-ignore
  const numeric = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  var characters = [];
  if (type == 'alphanumeric') {
    characters = alphanumeric;
  } else if (type == 'numeric') {
    characters = numeric;
  } else if (type == 'alphabet') {
    characters = alphabet;
  } else {
    console.log('RandomString: Invalid type');
    return '';
  }

  var outString = '';
  while (outString.length < length) {
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

  for (var i = 0; i < Object.keys(contacts).length; i++) {
    contact_type = Object.keys(contacts)[i];

    context(`---> ${contact_type}`, (c_type = contact_type) => {
      var contact = contacts[c_type];
      it('Check every field for required/optional and maximum length', () => {
        cy.get("button[label='New']").click();
        cy.wait(50);
        cy.get("div[role='dialog']").contains('Add Contact').should('exist');

        cy.dropdown_set_value("p-dropdown[FormControlName='type']", c_type);
        cy.wait(50);
        cy.get("button[label='Save']").click();
        cy.wait(50);

        for (var j = 0; j < Object.keys(contact_fields[c_type]).length; j++) {
          var field = Object.keys(contact_fields[c_type])[j];
          var length = contact_fields[c_type][field];

          if (fields_required.includes(field)) {
            cy.get('#' + field)
              .parent()
              .should('contain', 'This is a required field');
          }

          var rString = '';
          if (field == 'telephone') {
            rString = randomString(length, 'numeric');
          } else {
            rString = randomString(length);
          }

          cy.get('#' + field)
            .type(rString)
            .parent()
            .find('app-error-messages')
            .children()
            .should('have.length', 0);
          cy.get('#' + field)
            .type('0')
            .parent()
            .find('app-error-messages')
            .should('contain', `This field cannot contain more than ${length}`);
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
