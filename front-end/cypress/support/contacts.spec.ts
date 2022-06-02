import * as _ from 'lodash';
import * as generator from './generators/generators.spec';

export function generateContactObject(contactGiven: object = {}): object {
  let contactRandom: object = {
    //fields defined in this object are intentionally not CamelCase as they are intended to mirror the FormControlNames of elements on the Front-End
    //_.sample : standard js object method (hence _.); takes a random element from a given list.  Much more readable than [randomint % list.length] on every list
    contact_type: _.sample(['Individual', 'Candidate', 'Committee', 'Organization']),

    // Fields needed for an Individual
    //Names were provided by a random name generator
    last_name: generator.lastName(),
    first_name: generator.firstName(),
    middle_name: generator.middleName(),
    prefix: generator.prefix(),
    suffix: generator.suffix(),
    street: generator.street(),
    apartment: generator.apartment(),
    city: generator.city(),
    zip: generator.zipcode(),
    state: generator.state(),
    phone: generator.phone(),
    employer: '',
    //Jobs provided by another random generator
    occupation: generator.occupation(),

    //Candidate-exclusive fields
    candidate_id: '',
    candidate_office: generator.candidateOffice(),
    candidate_state: generator.state(true),
    candidate_district: '01',

    //Committee-exclusive fields
    committee_id: generator.committeeID(),
    committee_name: generator.groupName(),

    //Organization-exclusive fields
    organization_name: generator.groupName(),

    //Name that will show up on the "Manage Contacts" table
    name: '',
  };

  let contact = { ...contactRandom, ...contactGiven }; //Merges the provided contact with the randomly generated one, overwriting the random one with any fields found in the provided

  //  Resolve the contact object's "name" based on contact_type.  This must be done after merging in case the contactGiven object does not provide first, last, committee, or organization names
  if (contact['contact_type'] == 'Individual' || contact['contact_type'] == 'Candidate') {
    contact['name'] = `${contact['first_name']} ${contact['last_name']}`;
  }
  if (contact['contact_type'] == 'Committee') {
    contact['name'] = contact['committee_name'];
  }
  if (contact['contact_type'] == 'Organization') {
    contact['name'] = contact['organization_name'];
  }

  // Resolve CandidateID
  if (contact['candidate_id'] == '') {
    contact['candidate_id'] = generator.candidateID(contact['candidate_office']);
  }

  return contact;
}

export function enterContact(contact: object, save: boolean = true) {
  cy.get('.p-menubar').find('.p-menuitem-link').contains('Contacts').click();
  cy.wait(100);

  cy.get('#button-contacts-new').click();
  cy.wait(100);

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

  cy.wait(250); //Gives the database time to process the request.  It gets a little funky otherwise...
}
