import _ from 'lodash';
import { dropdownSetValue } from './commands';
import {
  apartment,
  city,
  committeeID,
  date,
  firstName,
  groupName,
  lastName,
  middleName,
  prefix,
  randomString,
  state,
  street,
  suffix,
  zipcode,
} from './generators/generators.spec';

export type TransactionNavTree = {
  [key: string]: {
    [key: string]: TransactionForm;
  };
};

export type TransactionForm = {
  [key: string]: TransactionField;
};

export type FieldType = 'Text' | 'Calendar' | 'Dropdown' | 'P-InputNumber' | 'Textarea';

export type TransactionField = {
  generator: Function; //A function that returns a valid value for that field
  genArgs?: Array<any>; //Any arguments that need to be passed to the generator
  fieldType: FieldType;
  required: boolean; //Denotes whether or not the field is required
  entities?: Array<string>; //If a field only appears on one or more entity types
  maxLength: number; //The max number of characters that may be entered (-1 for N/A)
  childTransaction?: TransactionForm; //The transaction fields necessary for creating a child
};

export const TransactionFields: { [key: string]: TransactionField } = {
  /*
   *                      Transaction Fields
   *  This object contains every field for all possible transaction forms
   *  and the information necessary for E2E Tests to fill them out correctly.
   */
  entity_type: {
    generator: () => {
      return _.sample(['Individual', 'Organization', 'Committee']);
    },
    fieldType: 'Dropdown',
    required: true,
    maxLength: -1,
  },
  entity_type_individual: {
    generator: () => {
      return 'Individual';
    },
    fieldType: 'Dropdown',
    required: true,
    maxLength: -1,
  },
  entity_type_organization: {
    generator: () => {
      return 'Organization';
    },
    fieldType: 'Dropdown',
    required: true,
    maxLength: -1,
  },
  entity_type_committee: {
    generator: () => {
      return 'Committee';
    },
    fieldType: 'Dropdown',
    required: true,
    maxLength: -1,
  },
  contributor_last_name: {
    generator: lastName,
    fieldType: 'Text',
    required: true,
    entities: ['Individual'],
    maxLength: 30,
  },
  contributor_first_name: {
    generator: firstName,
    fieldType: 'Text',
    required: true,
    entities: ['Individual'],
    maxLength: 20,
  },
  contributor_middle_name: {
    generator: middleName,
    fieldType: 'Text',
    required: false,
    entities: ['Individual'],
    maxLength: 20,
  },
  contributor_prefix: {
    generator: prefix,
    fieldType: 'Text',
    required: false,
    entities: ['Individual'],
    maxLength: 10,
  },
  contributor_suffix: {
    generator: suffix,
    fieldType: 'Text',
    required: false,
    entities: ['Individual'],
    maxLength: 10,
  },
  contributor_employer: {
    generator: () => {
      return 'Bob Rohrman';
    },
    fieldType: 'Text',
    required: false,
    entities: ['Individual'],
    maxLength: 38,
  },
  contributor_occupation: {
    generator: () => {
      return 'Car Salesperson';
    },
    fieldType: 'Text',
    required: false,
    entities: ['Individual'],
    maxLength: 38,
  },
  contributor_organization_name: {
    generator: groupName,
    fieldType: 'Text',
    required: true,
    entities: ['Organization', 'Committee'],
    maxLength: 200,
  },
  donor_committee_fec_id: {
    generator: committeeID,
    fieldType: 'Text',
    required: true,
    entities: ['Committee'],
    maxLength: 9,
  },
  contributor_street_1: {
    generator: street,
    fieldType: 'Text',
    required: true,
    maxLength: 34,
  },
  contributor_street_2: {
    generator: apartment,
    fieldType: 'Text',
    required: false,
    maxLength: 34,
  },
  contributor_city: {
    generator: city,
    fieldType: 'Text',
    required: true,
    maxLength: 30,
  },
  contributor_state: {
    generator: state,
    fieldType: 'Dropdown',
    required: true,
    maxLength: -1,
  },
  contributor_zip: {
    generator: zipcode,
    fieldType: 'Text',
    required: true,
    maxLength: 9,
  },
  memo_text_description: {
    generator: randomString,
    fieldType: 'Textarea',
    genArgs: [100],
    required: false,
    maxLength: 100,
  },
  contribution_date: {
    generator: date,
    fieldType: 'Calendar',
    required: true,
    maxLength: -1,
  },
  contribution_amount: {
    generator: _.random,
    fieldType: 'P-InputNumber',
    genArgs: [10, 10000, true],
    required: true,
    maxLength: 12,
  },
};

/*
 *                      Field Macros
 *  The variables defined in this section collect transaction
 *  fields into shorthand groups that can be quickly brought
 *  into a Transaction object with the spread operator (...)
 */

const entityAny = {
  entity_type: TransactionFields['entity_type'],
};

const entityIndividual = {
  entity_type: TransactionFields['entity_type_individual'],
};

const entityOrganization = {
  entity_type: TransactionFields['entity_type_organization'],
};

const entityCommittee = {
  entity_type: TransactionFields['entity_type_committee'],
};

const personNameFields: { [key: string]: TransactionField } = {
  contributor_last_name: TransactionFields['contributor_last_name'],
  contributor_first_name: TransactionFields['contributor_first_name'],
  contributor_middle_name: TransactionFields['contributor_middle_name'],
  contributor_prefix: TransactionFields['contributor_prefix'],
  contributor_suffix: TransactionFields['contributor_suffix'],
};

const jobFields: { [key: string]: TransactionField } = {
  contributor_employer: TransactionFields['contributor_employer'],
  contributor_occupation: TransactionFields['contributor_occupation'],
};

const groupNameFields: { [key: string]: TransactionField } = {
  contributor_organization_name: TransactionFields['contributor_organization_name'],
};

const addressFields: { [key: string]: TransactionField } = {
  contributor_street_1: TransactionFields['contributor_street_1'],
  contributor_street_2: TransactionFields['contributor_street_2'],
  contributor_city: TransactionFields['contributor_city'],
  contributor_state: TransactionFields['contributor_state'],
  contributor_zip: TransactionFields['contributor_zip'],
};

const memoFields: { [key: string]: TransactionField } = {
  memo_text_description: TransactionFields['memo_text_description'],
};

const contributionFields: { [key: string]: TransactionField } = {
  contribution_date: TransactionFields['contribution_date'],
  contribution_amount: TransactionFields['contribution_amount'],
};

/*
 *                          Transactions
 *  These variables denote complete "Transaction" objects such
 *  that each object contains all of the fields necessary for
 *  creating a valid transaction.
 */

const individualReceipt: TransactionForm = {
  ...entityIndividual,
  ...personNameFields,
  ...addressFields,
  ...jobFields,
  ...memoFields,
  ...contributionFields,
};

const tribalReceipt: TransactionForm = {
  ...entityOrganization,
  ...groupNameFields,
  ...addressFields,
  ...memoFields,
  ...contributionFields,
};

const JFTransfer: TransactionForm = {
  ...entityCommittee,
  ...groupNameFields,
  ...addressFields,
  ...memoFields,
  ...contributionFields,
};

const opex: TransactionForm = {
  ...entityAny,
  ...personNameFields,
  ...groupNameFields,
  ...addressFields,
  ...memoFields,
  ...contributionFields,
};

const otherReceipt: TransactionForm = {
  ...entityAny,
  ...personNameFields,
  ...groupNameFields,
  ...addressFields,
  ...jobFields,
  ...memoFields,
  ...contributionFields,
};

/*
 *          Group A Transaction Navigation Tree
 * Every entry in this object represents a path that an E2E test
 * can take in generating a valid transaction.
 *
 */
export const groupANavTree: TransactionNavTree = {
  //Commented out lines are branches that have not yet been implemented
  'INDIVIDUALS/PERSONS': {
    'Individual Receipt': individualReceipt,
    'Tribal Receipt': tribalReceipt,
  },
  //"REGISTERED FILERS":{},
  TRANSFERS: {
    'JF Transfers': JFTransfer,
  },
  //"REFUNDS":{},
  OTHER: {
    'Offsets to Operating Expenditures': opex,
    'Other Receipts': otherReceipt,
  },
};
