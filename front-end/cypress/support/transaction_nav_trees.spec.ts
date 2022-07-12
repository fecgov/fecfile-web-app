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
  fieldName: string; //should match the FormControlName for the field in the DOM
  generator: Function; //A function that returns a valid value for that field
  genArgs?: Array<any>; //Any arguments that need to be passed to the generator
  fieldType: FieldType;
  required: boolean; //Denotes whether or not the field is required
  readOnly?: boolean; //Denotes whether or not the field is read only (Assumes False)
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
  entityType: {
    fieldName: 'entity_type',
    generator: () => {
      return _.sample(['Individual', 'Organization', 'Committee']);
    },
    fieldType: 'Dropdown',
    required: true,
    maxLength: -1,
  },
  entityTypeIndividual: {
    fieldName: 'entity_type',
    generator: () => {
      return 'Individual';
    },
    fieldType: 'Dropdown',
    required: true,
    readOnly: true,
    maxLength: -1,
  },
  entityTypeOrganization: {
    fieldName: 'entity_type',
    generator: () => {
      return 'Organization';
    },
    fieldType: 'Dropdown',
    required: true,
    readOnly: true,
    maxLength: -1,
  },
  entityTypeCommittee: {
    fieldName: 'entity_type',
    generator: () => {
      return 'Committee';
    },
    fieldType: 'Dropdown',
    required: true,
    readOnly: true,
    maxLength: -1,
  },
  contributorLastName: {
    fieldName: 'contributor_last_name',
    generator: lastName,
    fieldType: 'Text',
    required: true,
    entities: ['Individual'],
    maxLength: 30,
  },
  contributorFirstName: {
    fieldName: 'contributor_first_name',
    generator: firstName,
    fieldType: 'Text',
    required: true,
    entities: ['Individual'],
    maxLength: 20,
  },
  contributorMiddleName: {
    fieldName: 'contributor_middle_name',
    generator: middleName,
    fieldType: 'Text',
    required: false,
    entities: ['Individual'],
    maxLength: 20,
  },
  contributorPrefix: {
    fieldName: 'contributor_prefix',
    generator: prefix,
    fieldType: 'Text',
    required: false,
    entities: ['Individual'],
    maxLength: 10,
  },
  contributorSuffix: {
    fieldName: 'contributor_suffix',
    generator: suffix,
    fieldType: 'Text',
    required: false,
    entities: ['Individual'],
    maxLength: 10,
  },
  contributorEmployer: {
    fieldName: 'contributor_employer',
    generator: () => {
      return 'Bob Rohrman';
    },
    fieldType: 'Text',
    required: false,
    entities: ['Individual'],
    maxLength: 38,
  },
  contributorOccupation: {
    fieldName: 'contributor_occupation',
    generator: () => {
      return 'Car Salesperson';
    },
    fieldType: 'Text',
    required: false,
    entities: ['Individual'],
    maxLength: 38,
  },
  contributorOrganizationName: {
    fieldName: 'contributor_organization_name',
    generator: groupName,
    fieldType: 'Text',
    required: true,
    entities: ['Organization', 'Committee'],
    maxLength: 200,
  },
  donorCommitteeFECId: {
    fieldName: 'donor_committee_fec_id',
    generator: committeeID,
    fieldType: 'Text',
    required: true,
    entities: ['Committee'],
    maxLength: 9,
  },
  contributorStreet1: {
    fieldName: 'contributor_street_1',
    generator: street,
    fieldType: 'Text',
    required: true,
    maxLength: 34,
  },
  contributorStreet2: {
    fieldName: 'contributor_street_2',
    generator: apartment,
    fieldType: 'Text',
    required: false,
    maxLength: 34,
  },
  contributorCity: {
    fieldName: 'contributor_city',
    generator: city,
    fieldType: 'Text',
    required: true,
    maxLength: 30,
  },
  contributorState: {
    fieldName: 'contributor_state',
    generator: state,
    fieldType: 'Dropdown',
    required: true,
    maxLength: -1,
  },
  contributorZip: {
    fieldName: 'contributor_zip',
    generator: zipcode,
    fieldType: 'Text',
    required: true,
    maxLength: 9,
  },
  memoTextDescription: {
    fieldName: 'memo_text_description',
    generator: randomString,
    fieldType: 'Textarea',
    genArgs: [100],
    required: false,
    maxLength: 100,
  },
  contributionDate: {
    fieldName: 'contribution_date',
    generator: date,
    fieldType: 'Calendar',
    required: true,
    maxLength: -1,
  },
  contributionAmount: {
    fieldName: 'contribution_amount',
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
  entityType: TransactionFields['entityType'],
};

const entityIndividual = {
  entityTypeIndividual: TransactionFields['entityTypeIndividual'],
};

const entityOrganization = {
  entityTypeOrganization: TransactionFields['entityTypeOrganization'],
};

const entityCommittee = {
  entityTypeCommittee: TransactionFields['entityTypeCommittee'],
};

const personNameFields: { [key: string]: TransactionField } = {
  contributorLastName: TransactionFields['contributorLastName'],
  contributorFirstName: TransactionFields['contributorFirstName'],
  contributorMiddleName: TransactionFields['contributorMiddleName'],
  contributorPrefix: TransactionFields['contributorPrefix'],
  contributorSuffix: TransactionFields['contributorSuffix'],
};

const jobFields: { [key: string]: TransactionField } = {
  contributorEmployer: TransactionFields['contributorEmployer'],
  contributorOccupation: TransactionFields['contributorOccupation'],
};

const groupNameFields: { [key: string]: TransactionField } = {
  contributorOrganizationName: TransactionFields['contributorOrganizationName'],
};

const addressFields: { [key: string]: TransactionField } = {
  contributorStreet1: TransactionFields['contributorStreet1'],
  contributorStreet2: TransactionFields['contributorStreet2'],
  contributorCity: TransactionFields['contributorCity'],
  contributorState: TransactionFields['contributorState'],
  contributorZip: TransactionFields['contributorZip'],
};

const memoFields: { [key: string]: TransactionField } = {
  memoTextDescription: TransactionFields['memoTextDescription'],
};

const contributionFields: { [key: string]: TransactionField } = {
  contributionDate: TransactionFields['contributionDate'],
  contributionAmount: TransactionFields['contributionAmount'],
};

/*
 *                     Transaction Forms
 *  These variables denote complete "Transaction Form" objects such
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

const offsetToOpex: TransactionForm = {
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
    'Offsets to Operating Expenditures': offsetToOpex,
    'Other Receipts': otherReceipt,
  },
};
