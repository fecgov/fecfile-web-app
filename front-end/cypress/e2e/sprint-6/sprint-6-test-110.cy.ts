// @ts-check

import { generateContactObject } from '../../support/generators/contacts.spec';

function testPersonalFields(contact, cType) {
  if (cType == 'Individual' || cType == 'Candidate') {
    cy.get('#last_name').should('have.value', contact['last_name']);
    cy.get('#first_name').should('have.value', contact['first_name']);
    cy.get('#middle_name').should('have.value', contact['middle_name']);
    cy.get('#prefix').should('have.value', contact['prefix']);
    cy.get('#suffix').should('have.value', contact['suffix']);

    cy.get('#employer').should('have.value', contact['employer']);
    cy.get('#occupation').should('have.value', contact['occupation']);
  }
}

function testCandidateFields(contact, cType) {
  if (cType == 'Candidate') {
    cy.get('#candidate_id').should('have.value', contact['candidate_id']);
    cy.get("p-dropdown[formcontrolname='candidate_office']").should('contain', contact['candidate_office']);

    if (contact['candidate_office'] != 'Presidential') {
      cy.get("p-dropdown[formcontrolname='candidate_state']").should('contain', contact['candidate_state']);

      if (contact['candidate_office'] == 'House') {
        cy.get("p-dropdown[formcontrolname='candidate_district']") //Gets the field for the input for State
          .should('contain', contact['candidate_district']);
      }
    }
  }
}

function testNameFields(contact, cType) {
  if (cType == 'Committee' || cType == 'Organization') {
    cy.get('#name').should('have.value', contact['name']);

    if (cType == 'Committee') {
      cy.get('#committee_id').should('have.value', contact['committee_id']);
    }
  }
}

function testAddressFields(contact) {
  cy.get('#street_1').should('have.value', contact['street']);
  cy.get('#street_2').should('have.value', contact['apartment']);
  cy.get('#city').should('have.value', contact['city']);
  cy.get('#zip').should('have.value', contact['zip']);
  cy.get('#telephone').find('input').should('have.value', contact['phone']);
  cy.get("p-dropdown[formcontrolname='state']") //Gets the field for the input for State
    .should('contain', contact['state']);
}

function testSavedProperly(contact, cType) {
  cy.contains('tr', `${contact['name']}`).should('contain', contact['contact_type']);
  if (cType == 'Individual' || cType == 'Candidate') {
    cy.get('tbody')
      .contains('tr', `${contact['name']}`)
      .should('contain', contact['employer'])
      .should('contain', contact['occupation']);
  }
}

let contactType: string;
const contacts: object = { Individual: {}, Candidate: {}, Committee: {}, Organization: {} };

describe('QA Test Script #110 (Sprint 6)', () => {
  beforeEach('Logs in', () => {
    cy.login();
    cy.visit('/dashboard');
  });

  after(() => {
    cy.login();
    cy.visit('/dashboard');
    cy.deleteAllContacts();
  });

  for (contactType of Object.keys(contacts)) {
    contacts[contactType] = generateContactObject({ contact_type: contactType });

    context(`QA Script #110 - ${contactType}`, (cType = contactType) => {
      it('Steps 1-5: Test "Save"', () => {
        cy.get('.p-menubar').contains('.p-menuitem-link', 'Contacts').click();
        cy.url().should('contain', '/contacts');
        let contact: object = contacts[cType];
        cy.createContact(contact, false);

        testPersonalFields(contact, cType);
        testCandidateFields(contact, cType);
        testNameFields(contact, cType);
        testAddressFields(contact);

        cy.contains('.p-button-primary', 'Save').click();
        cy.longWait();
        testSavedProperly(contact, cType);
      });

      it('Steps 6-11: Test "Save & Add More"', () => {
        cy.login();
        cy.visit('/dashboard');
        cy.get('.p-menubar').contains('.p-menuitem-link', 'Contacts').click();
        cy.createContact(generateContactObject(), false);

        cy.contains('.p-button-label', 'Save & Add More').click();

        cy.contains('.p-toast-message', 'Contact Created').should('exist');

        cy.get('#last_name').should('have.value', '');
        cy.get('#first_name').should('have.value', '');

        cy.get("button[label='Cancel']").click();
      });
    });
  }
});
