import { getAuthToken } from './commands';

export function createContact(contact: object, save = true) {
  cy.get('.p-menubar').find('.p-menuitem-link').contains('Contacts').click();
  cy.shortWait();

  cy.get('#button-contacts-new').click();
  cy.shortWait();

  cy.dropdownSetValue("p-dropdown[formcontrolname='type']", contact['contact_type']);

  if (contact['contact_type'] == 'Individual' || contact['contact_type'] == 'Candidate') {
    //Contact
    cy.get('#last_name').safeType(contact['last_name']);
    cy.get('#first_name').safeType(contact['first_name']);
    cy.get('#middle_name').safeType(contact['middle_name']);
    cy.get('#prefix').safeType(contact['prefix']);
    cy.get('#suffix').safeType(contact['suffix']);

    //Employer
    cy.get('#employer').safeType(contact['employer']);
    cy.get('#occupation').safeType(contact['occupation']);
  }

  //Address
  cy.get('#street_1').safeType(contact['street']);
  cy.get('#street_2').safeType(contact['apartment']);
  cy.get('#city').safeType(contact['city']);
  cy.get('#zip').safeType(contact['zip']);
  cy.get('#telephone').safeType(contact['phone']);
  cy.dropdownSetValue("p-dropdown[formcontrolname='state']", contact['state']);

  //Candidate-exclusive fields
  if (contact['contact_type'] == 'Candidate') {
    cy.get('#candidate_id').safeType(contact['candidate_id']);

    cy.dropdownSetValue("p-dropdown[formcontrolname='candidate_office']", contact['candidate_office']);

    if (contact['candidate_office'] != 'Presidential') {
      cy.dropdownSetValue("p-dropdown[formcontrolname='candidate_state']", contact['candidate_state']);

      if (contact['candidate_office'] == 'House') {
        cy.dropdownSetValue("p-dropdown[formcontrolname='candidate_district']", contact['candidate_district']);
      }
    }
  }

  if (contact['contact_type'] == 'Committee') {
    cy.get('#committee_id').safeType(contact['committee_id']);
    cy.get('#name').safeType(contact['committee_name']);
  }

  if (contact['contact_type'] == 'Organization') {
    cy.get('#name').safeType(contact['organization_name']);
  }

  if (save) {
    cy.get('.p-button-primary > .p-button-label').contains('Save').click();
  }

  cy.longWait(); //Gives the database time to process the request.  It gets a little funky otherwise...
}

//Deletes all reports belonging to the logged-in committee
export function deleteAllContacts() {
  const authToken: string = getAuthToken();
  cy.request({
    method: 'GET',
    url: 'http://localhost:8080/api/v1/contacts/',
    headers: {
      Authorization: authToken,
    },
  }).then((resp) => {
    const contacts = resp.body.results;
    for (const contact of contacts) {
      deleteContact(contact.id, authToken);
    }
    cy.longWait();
  });
}

//Deletes a single report by its ID
export function deleteContact(contactID: number, authToken: string | null = null) {
  if (authToken == null) {
    authToken = getAuthToken();
  }

  cy.request({
    method: 'DELETE',
    url: `http://localhost:8080/api/v1/contacts/${contactID}/`,
    headers: {
      Authorization: authToken,
    },
  });
}
