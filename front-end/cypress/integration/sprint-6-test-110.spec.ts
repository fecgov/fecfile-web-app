// @ts-check

import { before } from 'lodash';
import { isContext } from 'vm';
import { GenerateContactObject, EnterContact } from '../support/contacts.spec';

/*

        Individual

*/

var contact_type;
var contacts = { Individual: {}, Candidate: {}, Committee: {}, Organization: {} };

describe('QA Test Script #110 (Sprint 6)', () => {
  function before() {
    cy.login();
  }

  function after() {
    cy.get('p-button[icon="pi pi-trash"]').each((element) => {
      cy.wrap(element).click();
      cy.wait(50);
      cy.get('.p-confirm-dialog-accept').click();
      cy.wait(50);
    });
    cy.logout();
  }

  for (var i = 0; i < Object.keys(contacts).length; i++) {
    contact_type = Object.keys(contacts)[i];
    contacts[contact_type] = GenerateContactObject({ contact_type: contact_type });

    context(`QA Script #110 - ${contact_type}`, (c_type = contact_type) => {
      var contact = contacts[c_type];
      it('Step 1: Navigate to contacts page', () => {
        before();

        cy.url().should('contain', '/dashboard');
        cy.get('.p-menubar').find('.p-menuitem-link').contains('Contacts').click();
        cy.url().should('contain', '/contacts');
      });

      it('Steps 2-5: Creates a contact', () => {
        cy.EnterContact(contact, false);

        if (c_type == 'Individual' || c_type == 'Candidate') {
          cy.get('#last_name').should('have.value', contact['last_name']);
          cy.get('#first_name').should('have.value', contact['first_name']);
          cy.get('#middle_name').should('have.value', contact['middle_name']);
          cy.get('#prefix').should('have.value', contact['prefix']);
          cy.get('#suffix').should('have.value', contact['suffix']);

          cy.get('#employer').should('have.value', contact['employer']);
          cy.get('#occupation').should('have.value', contact['occupation']);
        }

        if (c_type == 'Candidate') {
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

        if (c_type == 'Committee' || c_type == 'Organization') {
          cy.get('#name').should('have.value', contact['name']);

          if (c_type == 'Committee') {
            cy.get('#committee_id').should('have.value', contact['committee_id']);
          }
        }

        //Address
        cy.get('#street_1').should('have.value', contact['street']);
        cy.get('#street_2').should('have.value', contact['apartment']);
        cy.get('#city').should('have.value', contact['city']);
        cy.get('#zip').should('have.value', contact['zip']);
        cy.get('#telephone').should('have.value', contact['phone']);
        //cy.dropdown_set_value("p-dropdown[formcontrolname='state']", contact['state']);
        cy.get("p-dropdown[formcontrolname='state']") //Gets the field for the input for State
          .should('contain', contact['state']);

        cy.get('.p-button-primary > .p-button-label').contains('Save').click();

        cy.wait(250);
        cy.get('tbody').find('tr').contains(`${contact['name']}`).parent().should('contain', contact['contact_type']);
        if (c_type == 'Individual' || c_type == 'Candidate') {
          cy.get('tbody')
            .find('tr')
            .contains(`${contact['name']}`)
            .parent()
            .should('contain', contact['employer'])
            .should('contain', contact['occupation']);
        }
      });

      it('Steps 6-11: Test "Save & Add More"', () => {
        cy.EnterContact(GenerateContactObject(), false);

        cy.get('.p-button-label').contains('Save & Add More').click();

        cy.get('.p-toast-message').should('contain', 'Contact Created');

        cy.get('#last_name').should('have.value', '');
        cy.get('#first_name').should('have.value', '');

        cy.get("button[label='Cancel']").click();
        cy.wait(100);
      });

      it('Cleanup', () => {
        after();
      });
    });
  }
});
