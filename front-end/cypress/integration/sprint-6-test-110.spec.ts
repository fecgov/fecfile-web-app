// @ts-check

import { GenerateContactObject } from '../support/contacts.spec';

/*

        Individual

*/

let ContactType: string;
let Contacts: object = { Individual: {}, Candidate: {}, Committee: {}, Organization: {} };

describe('QA Test Script #110 (Sprint 6)', () => {
  function before() {
    cy.Login();
  }

  function after() {
    cy.get('p-button[icon="pi pi-trash"]').each((Element) => {
      cy.wrap(Element).click();
      cy.wait(50);
      cy.get('.p-confirm-dialog-accept').click();
      cy.wait(50);
    });
    cy.Logout();
  }

  for (ContactType of Object.keys(Contacts)) {
    Contacts[ContactType] = GenerateContactObject({ contact_type: ContactType });

    context(`QA Script #110 - ${ContactType}`, (c_type = ContactType) => {
      let Contact: object = Contacts[c_type];
      it('Step 1: Navigate to contacts page', () => {
        before();

        cy.url().should('contain', '/dashboard');
        cy.get('.p-menubar').find('.p-menuitem-link').contains('Contacts').click();
        cy.url().should('contain', '/contacts');
      });

      it('Steps 2-5: Creates a contact', () => {
        cy.EnterContact(Contact, false);

        if (c_type == 'Individual' || c_type == 'Candidate') {
          cy.get('#last_name').should('have.value', Contact['last_name']);
          cy.get('#first_name').should('have.value', Contact['first_name']);
          cy.get('#middle_name').should('have.value', Contact['middle_name']);
          cy.get('#prefix').should('have.value', Contact['prefix']);
          cy.get('#suffix').should('have.value', Contact['suffix']);

          cy.get('#employer').should('have.value', Contact['employer']);
          cy.get('#occupation').should('have.value', Contact['occupation']);
        }

        if (c_type == 'Candidate') {
          cy.get('#candidate_id').should('have.value', Contact['candidate_id']);
          cy.get("p-dropdown[formcontrolname='candidate_office']").should('contain', Contact['candidate_office']);

          if (Contact['candidate_office'] != 'Presidential') {
            cy.get("p-dropdown[formcontrolname='candidate_state']").should('contain', Contact['candidate_state']);

            if (Contact['candidate_office'] == 'House') {
              cy.get("p-dropdown[formcontrolname='candidate_district']") //Gets the field for the input for State
                .should('contain', Contact['candidate_district']);
            }
          }
        }

        if (c_type == 'Committee' || c_type == 'Organization') {
          cy.get('#name').should('have.value', Contact['name']);

          if (c_type == 'Committee') {
            cy.get('#committee_id').should('have.value', Contact['committee_id']);
          }
        }

        //Address
        cy.get('#street_1').should('have.value', Contact['street']);
        cy.get('#street_2').should('have.value', Contact['apartment']);
        cy.get('#city').should('have.value', Contact['city']);
        cy.get('#zip').should('have.value', Contact['zip']);
        cy.get('#telephone').should('have.value', Contact['phone']);
        cy.get("p-dropdown[formcontrolname='state']") //Gets the field for the input for State
          .should('contain', Contact['state']);

        cy.get('.p-button-primary > .p-button-label').contains('Save').click();

        cy.wait(250);
        cy.get('tbody').find('tr').contains(`${Contact['name']}`).parent().should('contain', Contact['contact_type']);
        if (c_type == 'Individual' || c_type == 'Candidate') {
          cy.get('tbody')
            .find('tr')
            .contains(`${Contact['name']}`)
            .parent()
            .should('contain', Contact['employer'])
            .should('contain', Contact['occupation']);
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
