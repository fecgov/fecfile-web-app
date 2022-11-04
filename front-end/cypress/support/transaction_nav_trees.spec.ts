import _ from 'lodash';
import { contributionAmount, date, randomString } from './generators/generators.spec';

/*
 *          Adding support for a new transaction:
 *  1. Add the name to the SchATransaction type
 *  2. Create a new Transaction Form object for it
 *  3. Add it to the SchA Nav Tree
 */
export type TransactionCategory = 'INDIVIDUALS/PERSONS' | 'REGISTERED FILERS' | 'TRANSFERS' | 'REFUNDS' | 'OTHER';
export type SchATransaction =
  | 'Individual Receipt'
  | 'Tribal Receipt'
  | 'Joint Fundraising Transfer'
  | 'Offsets to Operating Expenditures'
  | 'Other Receipts';

export type TransactionNavTree = {
  [category in TransactionCategory]?: {
    [transactionName in SchATransaction]?: TransactionForm;
  };
};

export type TransactionForm = {
  entity_type?: 'Individual' | 'Committee' | 'Organization';
  memoTextDescription?: TransactionField;
  contributionAmount?: TransactionField;
  childTransactions?: {
    [key: string]: TransactionForm;
  };
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
};

export const TransactionFields: { [key: string]: TransactionField } = {
  /*
   *                      Transaction Fields
   *  This object contains every field for all possible transaction forms
   *  and the information necessary for E2E Tests to fill them out correctly.
   */
  entityType: {
    fieldName: 'entity_type_dropdown',
    fieldType: 'Dropdown',
    generator: () => {
      return _.sample(['Individual', 'Organization', 'Committee']);
    },
    required: true,
    entities: ['Individual', 'Organization', 'Committee'],
    maxLength: -1,
  },
  entityTypeIndividual: {
    fieldName: 'entity_type_dropdown',
    fieldType: 'Dropdown',
    generator: () => {
      return 'Individual';
    },
    required: true,
    entities: ['Individual'],
    readOnly: true,
    maxLength: -1,
  },
  entityTypeOrganization: {
    fieldName: 'entity_type_dropdown',
    fieldType: 'Dropdown',
    generator: () => {
      return 'Organization';
    },
    required: true,
    entities: ['Organization'],
    readOnly: true,
    maxLength: -1,
  },
  entityTypeCommittee: {
    fieldName: 'entity_type_dropdown',
    fieldType: 'Dropdown',
    generator: () => {
      return 'Committee';
    },
    required: true,
    entities: ['Committee'],
    readOnly: true,
    maxLength: -1,
  },
  memoTextDescription: {
    fieldName: 'memo_text_description',
    fieldType: 'Textarea',
    generator: randomString,
    genArgs: [100, 'special'],
    required: false,
    maxLength: 100,
  },
  contributionDate: {
    fieldName: 'contribution_date',
    fieldType: 'Calendar',
    generator: date,
    required: true,
    maxLength: -1,
  },
  contributionAmount: {
    fieldName: 'contribution_amount',
    fieldType: 'P-InputNumber',
    generator: contributionAmount,
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
  ...memoFields,
  ...contributionFields,
};

const tribalReceipt: TransactionForm = {
  ...entityOrganization,
  ...memoFields,
  ...contributionFields,
};

const JointFundraisingTransferMemo: TransactionForm = {
  ...entityCommittee,
  ...memoFields,
  ...contributionFields,
};

const JointFundraisingTransfer: TransactionForm = {
  ...entityCommittee,
  ...memoFields,
  ...contributionFields,
  childTransactions: {
    'PAC Joint Fundraising Transfer Memo': JointFundraisingTransferMemo,
  },
};

const offsetToOpex: TransactionForm = {
  ...entityAny,
  ...memoFields,
  ...contributionFields,
};

const otherReceipt: TransactionForm = {
  ...entityAny,
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
    'Joint Fundraising Transfer': JointFundraisingTransfer,
  },
  //"REFUNDS":{},
  OTHER: {
    'Offsets to Operating Expenditures': offsetToOpex,
    'Other Receipts': otherReceipt,
  },
};
