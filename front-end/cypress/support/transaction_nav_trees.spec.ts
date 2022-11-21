import _ from 'lodash';
import { contributionAmount, date, randomString } from './generators/generators.spec';

/*
 *          Adding support for a new transaction:
 *  1. Add the name to the SchATransaction type
 *  2. Create a new Transaction Form object for it
 *  3. Add it to the SchA Nav Tree
 */
export type TransactionEntityType = 'Committee' | 'Individual' | 'Organization';
export type TransactionCategory = 'INDIVIDUALS/PERSONS' | 'REGISTERED FILERS' | 'TRANSFERS' | 'REFUNDS' | 'OTHER';
export type SchATransactionName =
  | 'Individual Receipt'
  | 'Tribal Receipt'
  | 'Joint Fundraising Transfer'
  | 'Offsets to Operating Expenditures'
  | 'Other Receipts'
  | 'Party Receipt'
  | 'PAC Receipt'
  | 'Transfer'
  | 'Earmark Receipt'
  | 'Business/Labor Organization Receipt - Non-Contribution Account'
  | 'Individual Receipt - Non-Contribution Account'
  | 'Joint Fundraising Transfer - National Party Recount Account'
  | 'Joint Fundraising Transfer - National Party Pres. Nominating Convention Account';

export type ChildTransactionName =
  | 'PAC Joint Fundraising Transfer Memo'
  | 'Party Joint Fundraising Transfer Memo'
  | 'Individual Joint Fundraising Transfer Memo'
  | 'Tribal Joint Fundraising Transfer Memo'
  | 'PAC National Party Recount/Legal Proceedings Account JF Transfer Memo'
  | 'Individual National Party Recount/Legal Proceedings Account JF Transfer Memo'
  | 'Tribal National Party Recount/Legal Proceedings Account JF Transfer Memo'
  | 'Earmark Receipt Step One'
  | 'Earmark Receipt Step Two'
  | 'Individual National Party Pres. Nominating Convention Account JF Transfer Memo'
  | 'PAC National Party Pres. Nominating Convention Account JF Transfer Memo'
  | 'Tribal National Party Pres. Nominating Convention Account JF Transfer Memo'
  | 'Partnership Receipt Pres. Nominating Convention Account JF Transfer Memo';

export type TransactionNavTree = {
  [category in TransactionCategory]?: {
    [transactionName in SchATransactionName]?: TransactionForm | PairedTransactionForm;
  };
};

export type PairedTransactionForm = {
  transaction_name: SchATransactionName;
  transaction_category: TransactionCategory;
  transactionA: ChildTransactionForm;
  transactionB: ChildTransactionForm;
};

export type TransactionForm = {
  entity_type: TransactionField;
  transaction_name: SchATransactionName;
  transaction_category: TransactionCategory;
  fields: {
    [fieldName: string]: TransactionField;
  };
  childTransactions?: ChildTransactionForm[];
};

export type ChildTransactionForm = {
  entity_type: TransactionField;
  transaction_name: ChildTransactionName;
  fields: {
    [fieldName: string]: TransactionField;
  };
  childOf: SchATransactionName;
  childTransactions?: {
    [childName: string]: ChildTransactionForm;
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
  entities?: TransactionEntityType[]; //If a field only appears on one or more entity types
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
  entityTypeIndvOrComm: {
    fieldName: 'entity_type_dropdown',
    fieldType: 'Dropdown',
    generator: () => {
      return _.sample(['Individual', 'Committee']);
    },
    required: true,
    entities: ['Individual', 'Committee'],
    readOnly: false,
    maxLength: -1,
  },
  memoTextInput: {
    fieldName: 'memo_text_input',
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
  entity_type: TransactionFields['entityType'],
};

const entityIndividual = {
  entity_type: TransactionFields['entityTypeIndividual'],
};

const entityOrganization = {
  entity_type: TransactionFields['entityTypeOrganization'],
};

const entityCommittee = {
  entity_type: TransactionFields['entityTypeCommittee'],
};

const entityIndvOrComm = {
  entity_type: TransactionFields['entityTypeIndvOrComm'],
};

const memoFields: { [key: string]: TransactionField } = {
  memoTextInput: TransactionFields['memoTextInput'],
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
  transaction_name: 'Individual Receipt',
  transaction_category: 'INDIVIDUALS/PERSONS',
  ...entityIndividual,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const tribalReceipt: TransactionForm = {
  transaction_name: 'Tribal Receipt',
  transaction_category: 'INDIVIDUALS/PERSONS',
  ...entityOrganization,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const businessLaborNonContribution: TransactionForm = {
  transaction_name: 'Business/Labor Organization Receipt - Non-Contribution Account',
  transaction_category: 'OTHER',
  ...entityOrganization,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const individualNonContribution: TransactionForm = {
  transaction_name: 'Individual Receipt - Non-Contribution Account',
  transaction_category: 'OTHER',
  ...entityIndividual,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const pacJointFundraisingTransferMemo: ChildTransactionForm = {
  transaction_name: 'PAC Joint Fundraising Transfer Memo',
  ...entityCommittee,
  childOf: 'Joint Fundraising Transfer',
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const partyJointFundraisingTransferMemo: ChildTransactionForm = {
  transaction_name: 'Party Joint Fundraising Transfer Memo',
  ...entityCommittee,
  childOf: 'Joint Fundraising Transfer',
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const individualJointFundraisingTransferMemo: ChildTransactionForm = {
  transaction_name: 'Individual Joint Fundraising Transfer Memo',
  ...entityIndividual,
  childOf: 'Joint Fundraising Transfer',
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const tribalJointFundraisingTransferMemo: ChildTransactionForm = {
  transaction_name: 'Tribal Joint Fundraising Transfer Memo',
  ...entityOrganization,
  childOf: 'Joint Fundraising Transfer',
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const indvNPRJFTransMemo: ChildTransactionForm = {
  transaction_name: 'Individual National Party Recount/Legal Proceedings Account JF Transfer Memo',
  ...entityIndividual,
  childOf: 'Joint Fundraising Transfer - National Party Recount Account',
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const tribalNPRJFTransMemo: ChildTransactionForm = {
  transaction_name: 'Tribal National Party Recount/Legal Proceedings Account JF Transfer Memo',
  ...entityOrganization,
  childOf: 'Joint Fundraising Transfer - National Party Recount Account',
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const pacNPRJFTransMemo: ChildTransactionForm = {
  transaction_name: 'PAC National Party Recount/Legal Proceedings Account JF Transfer Memo',
  ...entityCommittee,
  childOf: 'Joint Fundraising Transfer - National Party Recount Account',
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const pacNationalPartyConventionJFTransferMemo: ChildTransactionForm = {
  transaction_name: 'PAC National Party Pres. Nominating Convention Account JF Transfer Memo',
  ...entityCommittee,
  childOf: 'Joint Fundraising Transfer - National Party Pres. Nominating Convention Account',
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const individualNationalPartyConventionJFTransferMemo: ChildTransactionForm = {
  transaction_name: 'Individual National Party Pres. Nominating Convention Account JF Transfer Memo',
  ...entityCommittee,
  childOf: 'Joint Fundraising Transfer - National Party Pres. Nominating Convention Account',
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const tribalNationalPartyConventionJFTransferMemo: ChildTransactionForm = {
  transaction_name: 'Tribal National Party Pres. Nominating Convention Account JF Transfer Memo',
  ...entityCommittee,
  childOf: 'Joint Fundraising Transfer - National Party Pres. Nominating Convention Account',
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const jointFundraisingTransfer: TransactionForm = {
  transaction_name: 'Joint Fundraising Transfer',
  transaction_category: 'TRANSFERS',
  ...entityCommittee,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
  childTransactions: [
    pacJointFundraisingTransferMemo,
    individualJointFundraisingTransferMemo,
    tribalJointFundraisingTransferMemo,
    partyJointFundraisingTransferMemo,
  ],
};

const jointFundraisingTransferNationalPartyRecount: TransactionForm = {
  transaction_name: 'Joint Fundraising Transfer - National Party Recount Account',
  transaction_category: 'TRANSFERS',
  ...entityCommittee,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
  childTransactions: [pacNPRJFTransMemo, indvNPRJFTransMemo, tribalNPRJFTransMemo],
};

const jointFundraisingTransferNationalPartyPresNominatingConventionAccount: TransactionForm = {
  transaction_name: 'Joint Fundraising Transfer - National Party Pres. Nominating Convention Account',
  transaction_category: 'TRANSFERS',
  ...entityCommittee,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
  childTransactions: [
    pacNationalPartyConventionJFTransferMemo,
    individualNationalPartyConventionJFTransferMemo,
    tribalNationalPartyConventionJFTransferMemo,
  ],
};

const offsetToOpex: TransactionForm = {
  transaction_name: 'Offsets to Operating Expenditures',
  transaction_category: 'OTHER',
  ...entityAny,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const otherReceipt: TransactionForm = {
  transaction_name: 'Other Receipts',
  transaction_category: 'OTHER',
  ...entityAny,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const transfer: TransactionForm = {
  transaction_name: 'Transfer',
  transaction_category: 'TRANSFERS',
  ...entityCommittee,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const partyReceipt: TransactionForm = {
  transaction_name: 'Party Receipt',
  transaction_category: 'REGISTERED FILERS',
  ...entityCommittee,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const pacReceipt: TransactionForm = {
  transaction_name: 'PAC Receipt',
  transaction_category: 'REGISTERED FILERS',
  ...entityCommittee,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const earmarkReceiptStepOne: ChildTransactionForm = {
  transaction_name: 'Earmark Receipt Step One',
  ...entityIndividual,
  childOf: 'Earmark Receipt',
  fields: {
    ...contributionFields,
    ...memoFields,
  },
};
const earmarkReceiptStepTwo: ChildTransactionForm = {
  transaction_name: 'Earmark Receipt Step Two',
  ...entityIndvOrComm,
  childOf: 'Earmark Receipt',
  fields: {
    contributionDate: TransactionFields['contributionDate'],
    ...memoFields,
  },
};

const earmarkReceipt: PairedTransactionForm = {
  transaction_name: 'Earmark Receipt',
  transaction_category: 'INDIVIDUALS/PERSONS',
  transactionA: earmarkReceiptStepOne,
  transactionB: earmarkReceiptStepTwo,
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
    'Earmark Receipt': earmarkReceipt,
  },
  'REGISTERED FILERS': {
    'Party Receipt': partyReceipt,
    'PAC Receipt': pacReceipt,
  },
  TRANSFERS: {
    Transfer: transfer,
    'Joint Fundraising Transfer': jointFundraisingTransfer,
    'Joint Fundraising Transfer - National Party Recount Account': jointFundraisingTransferNationalPartyRecount,
    'Joint Fundraising Transfer - National Party Pres. Nominating Convention Account':
      jointFundraisingTransferNationalPartyPresNominatingConventionAccount,
  },
  //"REFUNDS":{},
  OTHER: {
    'Offsets to Operating Expenditures': offsetToOpex,
    'Other Receipts': otherReceipt,
    'Business/Labor Organization Receipt - Non-Contribution Account': businessLaborNonContribution,
    'Individual Receipt - Non-Contribution Account': individualNonContribution,
  },
};

export const childTransactionTree = {
  'Earmark Receipt': {
    'Earmark Receipt Step One': earmarkReceiptStepOne,
    'Earmark Receipt Step Two': earmarkReceiptStepTwo,
  },
  'Joint Fundraising Transfer': {
    'Tribal Joint Fundraising Transfer Memo': tribalJointFundraisingTransferMemo,
    'PAC Joint Fundraising Transfer Memo': pacJointFundraisingTransferMemo,
    'Party Joint Fundraising Transfer Memo': partyJointFundraisingTransferMemo,
    'Individual Joint Fundraising Transfer Memo': individualJointFundraisingTransferMemo,
  },
};
