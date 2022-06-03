import * as _ from 'lodash';
import * as generator from './generators.spec';

export function generateSchATransactionObject(transactionGiven: object = {}): object {
  let transactionRandom: object = {
    //fields defined in this object are intentionally not CamelCase as they are intended to mirror the FormControlNames of elements on the Front-End
    //_.sample : standard js object method (hence _.); takes a random element from a given list.  Much more readable than [randomint % list.length] on every list
    contributor_type: _.sample(['Individual', 'Candidate', 'Committee', 'Organization']),

    //Contribution
    date_received: generator.transactionDateReceived(),
    contribution_memo_item: _.sample([true, false]),
    contribution_amount: _.random(5, 10000, true),
    contribution_description: '',
    contribution_memo: '',

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
    state: generator.state(false),
    phone: generator.phone(),

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

  let transaction = { ...transactionRandom, ...transactionGiven }; //Merges the provided contact with the randomly generated one, overwriting the random one with any fields found in the provided

  //  Resolve the contact object's "name" based on transaction_type.  This must be done after merging in case the contactGiven object does not provide first, last, committee, or organization names
  if (transaction['transaction_type'] == 'Individual' || transaction['transaction_type'] == 'Candidate') {
    transaction['name'] = `${transaction['first_name']} ${transaction['last_name']}`;
  }
  if (transaction['transaction_type'] == 'Committee') {
    transaction['name'] = transaction['committee_name'];
  }
  if (transaction['transaction_type'] == 'Organization') {
    transaction['name'] = transaction['organization_name'];
  }

  // Resolve CandidateID
  if (transaction['candidate_id'] == '') {
    transaction['candidate_id'] = generator.candidateID(transaction['candidate_office']);
  }

  return transaction;
}
