import * as _ from 'lodash';
import * as generator from './generators.spec';

export function generateContactObject(contactGiven: object = {}): object {
  const contactRandom: object = {
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

  const contact = { ...contactRandom, ...contactGiven }; //Merges the provided contact with the randomly generated one, overwriting the random one with any fields found in the provided

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
