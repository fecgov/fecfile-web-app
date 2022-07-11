import * as _ from 'lodash';
import * as generator from './generators.spec';
import { groupANavTree, TransactionNavTree, TransactionField } from '../transaction_nav_trees.spec';

export type Transaction = {
  [accordion: string]: {
    [transaction_type: string]: {
      entity_type?: 'Individual' | 'Committee' | 'Organization';
      contributor_last_name?: string;
      contributor_first_name?: string;
      contributor_middle_name?: string;
      contributor_prefix?: string;
      contributor_suffix?: string;
      contributor_organization_name?: string;
      contributor_street_1?: string;
      contributor_street_2?: string;
      contributor_city?: string;
      contributor_zip?: string | number;
      memo_text_description?: string;
      contribution_amount?: number;
    };
  };
};

export function generateSchATransactionObject(transactionGiven: object = {}): object {
  const transactionRandom: object = {
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

  const transaction = { ...transactionRandom, ...transactionGiven }; //Merges the provided contact with the randomly generated one, overwriting the random one with any fields found in the provided

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

export function generateTransaction(transactionGiven: Transaction = {}): Transaction {
  let newTransaction: Transaction = {};

  const accordions = Object.keys(groupANavTree);
  const accordion = _.sample(accordions);
  const transactionTypes = Object.keys(groupANavTree[accordion]);
  const transactionType = _.sample(transactionTypes);
  const transactionFields = Object.keys(groupANavTree[accordion][transactionType]);

  newTransaction[accordion] = {};
  newTransaction[accordion][transactionType] = {};
  for (let field of transactionFields) {
    const fieldRules = groupANavTree[accordion][transactionType][field];
    let fieldValue: string | number;

    if (fieldRules['required'] || _.random(10) < 2) {
      if ('genArgs' in fieldRules) {
        fieldValue = fieldRules['generator'](...fieldRules['genArgs']);
      } else {
        fieldValue = fieldRules['generator']();
      }
      newTransaction[accordion][transactionType][field] = fieldValue;
    }
  }

  const finalTransaction = { ...newTransaction, ...transactionGiven };

  return finalTransaction;
}
