import _ from 'lodash';
import { contributionAmount, contributionAmountNegative, date, randomString } from './generators/generators.spec';

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
  | 'Unregistered Receipt from Person'
  | 'Joint Fundraising Transfer'
  | 'Offsets to Operating Expenditures'
  | 'Other Committee Receipt - Non-Contribution Account'
  | 'Other Receipts'
  | 'Party Receipt'
  | 'PAC Receipt'
  | 'Transfer'
  | 'Individual Recount Receipt'
  | 'Tribal Recount Receipt'
  | 'PAC Recount Receipt'
  | 'Party Recount Receipt'
  | 'Earmark Receipt'
  | 'Business/Labor Organization Receipt - Non-Contribution Account'
  | 'Individual Receipt - Non-Contribution Account'
  | 'Joint Fundraising Transfer - National Party Recount/Legal Proceedings Account'
  | 'Joint Fundraising Transfer - National Party Pres. Nominating Convention Account'
  | 'Joint Fundraising Transfer - National Party Headquarters Buildings Account'
  | 'PAC National Party Recount/Legal Proceedings Account'
  | 'Individual National Party Headquarters Buildings Account'
  | 'PAC National Party Headquarters Buildings Account'
  | 'PAC National Party Pres. Nominating Convention Account'
  | 'Party National Party Headquarters Buildings Account'
  | 'Tribal National Party Headquarters Buildings Account'
  | 'Tribal National Party Pres. Nominating Convention Account'
  | 'Party National Party Recount/Legal Proceedings Account'
  | 'Individual National Party Recount/Legal Proceedings Account'
  | 'Individual National Party Pres. Nominating Convention Account'
  | 'Party National Party Pres. Nominating Convention Account'
  | 'Tribal National Party Recount/Legal Proceedings Account'
  | 'Unregistered Receipt from Person - Returned/Bounced Receipt'
  | 'Party Returned/Bounced Receipt';

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
  | 'Tribal National Party Headquarters Buildings Account JF Transfer Memo'
  | 'Tribal National Party Pres. Nominating Convention Account JF Transfer Memo'
  | 'Partnership Receipt Pres. Nominating Convention Account JF Transfer Memo'
  | 'Individual National Party Headquarters Buildings Account JF Transfer Memo'
  | 'PAC National Party Headquarters Buildings Account JF Transfer Memo';

export type TransactionGroup = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'AG';

export type AggregationGroup =
  | 'GENERAL'
  | 'LINE_15'
  | 'LINE_16'
  | 'NATIONAL_PARTY_CONVENTION_ACCOUNT'
  | 'NATIONAL_PARTY_HEADQUARTERS_ACCOUNT'
  | 'NATIONAL_PARTY_RECOUNT_ACCOUNT'
  | 'NON_CONTRIBUTION_ACCOUNT'
  | 'OTHER_RECEIPTS'
  | 'RECOUNT_ACCOUNT';

export type TransactionNavTree = {
  [category in TransactionCategory]?: {
    [transactionName in SchATransactionName]?: TransactionForm | PairedTransactionForm;
  };
};

export type PairedTransactionForm = {
  transaction_name: SchATransactionName;
  transaction_category: TransactionCategory;
  transaction_group: TransactionGroup;
  aggregation_group: AggregationGroup;
  transactionA: ChildTransactionForm;
  transactionB: ChildTransactionForm;
};

export type TransactionForm = {
  entity_type: TransactionField;
  transaction_name: SchATransactionName;
  transaction_category: TransactionCategory;
  transaction_group: TransactionGroup;
  aggregation_group: AggregationGroup;
  fields: {
    [fieldName: string]: TransactionField;
  };
  childTransactions?: ChildTransactionForm[];
};

export type ChildTransactionForm = {
  entity_type: TransactionField;
  transaction_name: ChildTransactionName;
  transaction_group: TransactionGroup;
  aggregation_group: AggregationGroup;
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
  contributionAmountNegative: {
    fieldName: 'contribution_amount',
    fieldType: 'P-InputNumber',
    generator: contributionAmountNegative,
    required: true,
    maxLength: 12,
  },
  contributionPurposeDescriptionRequired: {
    fieldName: 'contribution_purpose_descrip',
    fieldType: 'Textarea',
    generator: randomString,
    genArgs: [100, 'special'],
    required: true,
    maxLength: 100,
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

const purposeDescriptionFieldsRequired: { [key: string]: TransactionField } = {
  contributionPurposeDescriptionRequired: TransactionFields['contributionPurposeDescriptionRequired'],
};

const contributionFields: { [key: string]: TransactionField } = {
  contributionDate: TransactionFields['contributionDate'],
  contributionAmount: TransactionFields['contributionAmount'],
};

const contributionFieldsNegative: { [key: string]: TransactionField } = {
  contributionDate: TransactionFields['contributionDate'],
  contributionAmount: TransactionFields['contributionAmountNegative'],
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
  transaction_group: 'A',
  aggregation_group: 'GENERAL',
  ...entityIndividual,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const tribalReceipt: TransactionForm = {
  transaction_name: 'Tribal Receipt',
  transaction_category: 'INDIVIDUALS/PERSONS',
  transaction_group: 'D',
  aggregation_group: 'GENERAL',
  ...entityOrganization,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const unregisteredReceiptFromPerson: TransactionForm = {
  transaction_name: 'Unregistered Receipt from Person',
  transaction_category: 'INDIVIDUALS/PERSONS',
  transaction_group: 'D',
  aggregation_group: 'GENERAL',
  ...entityOrganization,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const businessLaborNonContribution: TransactionForm = {
  transaction_name: 'Business/Labor Organization Receipt - Non-Contribution Account',
  transaction_category: 'OTHER',
  transaction_group: 'D',
  aggregation_group: 'NON_CONTRIBUTION_ACCOUNT',
  ...entityOrganization,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const individualNonContribution: TransactionForm = {
  transaction_name: 'Individual Receipt - Non-Contribution Account',
  transaction_category: 'OTHER',
  transaction_group: 'A',
  aggregation_group: 'NON_CONTRIBUTION_ACCOUNT',
  ...entityIndividual,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const pacJointFundraisingTransferMemo: ChildTransactionForm = {
  transaction_name: 'PAC Joint Fundraising Transfer Memo',
  transaction_group: 'F',
  aggregation_group: 'GENERAL',
  ...entityCommittee,
  childOf: 'Joint Fundraising Transfer',
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const partyJointFundraisingTransferMemo: ChildTransactionForm = {
  transaction_name: 'Party Joint Fundraising Transfer Memo',
  transaction_group: 'F',
  aggregation_group: 'GENERAL',
  ...entityCommittee,
  childOf: 'Joint Fundraising Transfer',
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const individualJointFundraisingTransferMemo: ChildTransactionForm = {
  transaction_name: 'Individual Joint Fundraising Transfer Memo',
  transaction_group: 'A',
  aggregation_group: 'GENERAL',
  ...entityIndividual,
  childOf: 'Joint Fundraising Transfer',
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const tribalJointFundraisingTransferMemo: ChildTransactionForm = {
  transaction_name: 'Tribal Joint Fundraising Transfer Memo',
  transaction_group: 'D',
  aggregation_group: 'GENERAL',
  ...entityOrganization,
  childOf: 'Joint Fundraising Transfer',
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const indvNPRJFTransMemo: ChildTransactionForm = {
  transaction_name: 'Individual National Party Recount/Legal Proceedings Account JF Transfer Memo',
  transaction_group: 'A',
  aggregation_group: 'NATIONAL_PARTY_RECOUNT_ACCOUNT',
  ...entityIndividual,
  childOf: 'Joint Fundraising Transfer - National Party Recount/Legal Proceedings Account',
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const tribalNationalPartyRecountAccount: TransactionForm = {
  transaction_name: 'Tribal National Party Recount/Legal Proceedings Account',
  transaction_category: 'OTHER',
  transaction_group: 'D',
  aggregation_group: 'NATIONAL_PARTY_RECOUNT_ACCOUNT',
  ...entityOrganization,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const tribalNPRJFTransMemo: ChildTransactionForm = {
  transaction_name: 'Tribal National Party Recount/Legal Proceedings Account JF Transfer Memo',
  transaction_group: 'D',
  aggregation_group: 'NATIONAL_PARTY_RECOUNT_ACCOUNT',
  ...entityOrganization,
  childOf: 'Joint Fundraising Transfer - National Party Recount/Legal Proceedings Account',
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const pacNPRJFTransMemo: ChildTransactionForm = {
  transaction_name: 'PAC National Party Recount/Legal Proceedings Account JF Transfer Memo',
  transaction_group: 'F',
  aggregation_group: 'NATIONAL_PARTY_RECOUNT_ACCOUNT',
  ...entityCommittee,
  childOf: 'Joint Fundraising Transfer - National Party Recount/Legal Proceedings Account',
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const pacNationalPartyConventionJFTransferMemo: ChildTransactionForm = {
  transaction_name: 'PAC National Party Pres. Nominating Convention Account JF Transfer Memo',
  transaction_group: 'F',
  aggregation_group: 'NATIONAL_PARTY_CONVENTION_ACCOUNT',
  ...entityCommittee,
  childOf: 'Joint Fundraising Transfer - National Party Pres. Nominating Convention Account',
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const individualNationalPartyConventionJFTransferMemo: ChildTransactionForm = {
  transaction_name: 'Individual National Party Pres. Nominating Convention Account JF Transfer Memo',
  transaction_group: 'A',
  aggregation_group: 'NATIONAL_PARTY_CONVENTION_ACCOUNT',
  ...entityIndividual,
  childOf: 'Joint Fundraising Transfer - National Party Pres. Nominating Convention Account',
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const tribalNationalPartyConventionJFTransferMemo: ChildTransactionForm = {
  transaction_name: 'Tribal National Party Pres. Nominating Convention Account JF Transfer Memo',
  transaction_group: 'D',
  aggregation_group: 'NATIONAL_PARTY_CONVENTION_ACCOUNT',
  ...entityOrganization,
  childOf: 'Joint Fundraising Transfer - National Party Pres. Nominating Convention Account',
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const individualNationalPartyRecountAccount: TransactionForm = {
  transaction_name: 'Individual National Party Recount/Legal Proceedings Account',
  transaction_category: 'OTHER',
  transaction_group: 'A',
  aggregation_group: 'NATIONAL_PARTY_RECOUNT_ACCOUNT',
  ...entityIndividual,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const individualRecountReceipt: TransactionForm = {
  transaction_name: 'Individual Recount Receipt',
  transaction_category: 'OTHER',
  transaction_group: 'A',
  aggregation_group: 'RECOUNT_ACCOUNT',
  ...entityIndividual,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const tribalRecountReceipt: TransactionForm = {
  transaction_name: 'Tribal Recount Receipt',
  transaction_category: 'OTHER',
  transaction_group: 'D',
  aggregation_group: 'RECOUNT_ACCOUNT',
  ...entityOrganization,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const PACRecountReceipt: TransactionForm = {
  transaction_name: 'PAC Recount Receipt',
  transaction_category: 'OTHER',
  transaction_group: 'F',
  aggregation_group: 'RECOUNT_ACCOUNT',
  ...entityCommittee,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const partyRecountReceipt: TransactionForm = {
  transaction_name: 'Party Recount Receipt',
  transaction_category: 'OTHER',
  transaction_group: 'F',
  aggregation_group: 'RECOUNT_ACCOUNT',
  ...entityCommittee,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const jointFundraisingTransfer: TransactionForm = {
  transaction_name: 'Joint Fundraising Transfer',
  transaction_category: 'TRANSFERS',
  transaction_group: 'E',
  aggregation_group: 'GENERAL',
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
  transaction_name: 'Joint Fundraising Transfer - National Party Recount/Legal Proceedings Account',
  transaction_category: 'TRANSFERS',
  transaction_group: 'E',
  aggregation_group: 'NATIONAL_PARTY_RECOUNT_ACCOUNT',
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
  transaction_group: 'E',
  aggregation_group: 'NATIONAL_PARTY_CONVENTION_ACCOUNT',
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
  transaction_group: 'B',
  aggregation_group: 'LINE_15',
  ...entityAny,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const individualNationalPartyHeadquartersBuildingsAccount: TransactionForm = {
  transaction_name: 'Individual National Party Headquarters Buildings Account',
  transaction_category: 'OTHER',
  transaction_group: 'A',
  aggregation_group: 'NATIONAL_PARTY_HEADQUARTERS_ACCOUNT',
  ...entityIndividual,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const tribalNationalPartyHeadquartersJFTransferMemo: ChildTransactionForm = {
  transaction_name: 'Tribal National Party Headquarters Buildings Account JF Transfer Memo',
  transaction_group: 'A',
  aggregation_group: 'NATIONAL_PARTY_HEADQUARTERS_ACCOUNT',
  ...entityIndividual,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
  childOf: 'Joint Fundraising Transfer - National Party Headquarters Buildings Account',
};

const indvNationalPartyHeadquartersJFTransferMemo: ChildTransactionForm = {
  transaction_name: 'Individual National Party Headquarters Buildings Account JF Transfer Memo',
  transaction_group: 'A',
  aggregation_group: 'NATIONAL_PARTY_HEADQUARTERS_ACCOUNT',
  ...entityIndividual,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
  childOf: 'Joint Fundraising Transfer - National Party Headquarters Buildings Account',
};

const pacNationalPartyHeadquartersJFTransferMemo: ChildTransactionForm = {
  transaction_name: 'PAC National Party Headquarters Buildings Account JF Transfer Memo',
  transaction_group: 'E',
  aggregation_group: 'NATIONAL_PARTY_HEADQUARTERS_ACCOUNT',
  ...entityCommittee,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
  childOf: 'Joint Fundraising Transfer - National Party Headquarters Buildings Account',
};

const jointFundraisingTransferNationalPartyHeadquartersBuildingsAccount: TransactionForm = {
  transaction_name: 'Joint Fundraising Transfer - National Party Headquarters Buildings Account',
  transaction_category: 'TRANSFERS',
  transaction_group: 'E',
  aggregation_group: 'NATIONAL_PARTY_HEADQUARTERS_ACCOUNT',
  ...entityCommittee,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
  childTransactions: [
    tribalNationalPartyHeadquartersJFTransferMemo,
    indvNationalPartyHeadquartersJFTransferMemo,
    pacNationalPartyHeadquartersJFTransferMemo,
  ],
};

const otherCommitteeReceiptNonContributionAccount: TransactionForm = {
  transaction_name: 'Other Committee Receipt - Non-Contribution Account',
  transaction_category: 'OTHER',
  transaction_group: 'F',
  aggregation_group: 'NON_CONTRIBUTION_ACCOUNT',
  ...entityCommittee,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const otherReceipt: TransactionForm = {
  transaction_name: 'Other Receipts',
  transaction_category: 'OTHER',
  transaction_group: 'C',
  aggregation_group: 'OTHER_RECEIPTS',
  ...entityAny,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const transfer: TransactionForm = {
  transaction_name: 'Transfer',
  transaction_category: 'TRANSFERS',
  transaction_group: 'F',
  aggregation_group: 'GENERAL',
  ...entityCommittee,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const partyReceipt: TransactionForm = {
  transaction_name: 'Party Receipt',
  transaction_category: 'REGISTERED FILERS',
  transaction_group: 'F',
  aggregation_group: 'GENERAL',
  ...entityCommittee,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const pacReceipt: TransactionForm = {
  transaction_name: 'PAC Receipt',
  transaction_category: 'REGISTERED FILERS',
  transaction_group: 'F',
  aggregation_group: 'GENERAL',
  ...entityCommittee,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const earmarkReceiptStepOne: ChildTransactionForm = {
  transaction_name: 'Earmark Receipt Step One',
  transaction_group: 'AG',
  aggregation_group: 'GENERAL',
  ...entityIndividual,
  childOf: 'Earmark Receipt',
  fields: {
    ...contributionFields,
    ...memoFields,
  },
};
const earmarkReceiptStepTwo: ChildTransactionForm = {
  transaction_name: 'Earmark Receipt Step Two',
  transaction_group: 'AG',
  aggregation_group: 'GENERAL',
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
  transaction_group: 'AG',
  aggregation_group: 'GENERAL',
  transactionA: earmarkReceiptStepOne,
  transactionB: earmarkReceiptStepTwo,
};

const pacNationalPartyRecountAccount: TransactionForm = {
  transaction_name: 'PAC National Party Recount/Legal Proceedings Account',
  transaction_category: 'OTHER',
  transaction_group: 'F',
  aggregation_group: 'NATIONAL_PARTY_RECOUNT_ACCOUNT',
  ...entityCommittee,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const pacNationalPartyConventionAccount: TransactionForm = {
  transaction_name: 'PAC National Party Pres. Nominating Convention Account',
  transaction_category: 'OTHER',
  transaction_group: 'F',
  aggregation_group: 'NATIONAL_PARTY_CONVENTION_ACCOUNT',
  ...entityCommittee,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const pacNationalPartyHeadquartersReceipt: TransactionForm = {
  transaction_name: 'PAC National Party Headquarters Buildings Account',
  transaction_category: 'OTHER',
  transaction_group: 'F',
  aggregation_group: 'NATIONAL_PARTY_HEADQUARTERS_ACCOUNT',
  ...entityCommittee,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const tribalNationalPartyHeadquartersBuildingsAccount: TransactionForm = {
  transaction_name: 'Tribal National Party Headquarters Buildings Account',
  transaction_category: 'OTHER',
  transaction_group: 'D',
  aggregation_group: 'NATIONAL_PARTY_HEADQUARTERS_ACCOUNT',
  ...entityOrganization,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const partyNationalPartyHeadquartersReceipt: TransactionForm = {
  transaction_name: 'Party National Party Headquarters Buildings Account',
  transaction_category: 'OTHER',
  transaction_group: 'F',
  aggregation_group: 'NATIONAL_PARTY_HEADQUARTERS_ACCOUNT',
  ...entityCommittee,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const partyNationalPartyRecountAccount: TransactionForm = {
  transaction_name: 'Party National Party Recount/Legal Proceedings Account',
  transaction_category: 'OTHER',
  transaction_group: 'F',
  aggregation_group: 'NATIONAL_PARTY_RECOUNT_ACCOUNT',
  ...entityIndividual,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const individualNationalPartyConventionAccount: TransactionForm = {
  transaction_name: 'Individual National Party Pres. Nominating Convention Account',
  transaction_category: 'OTHER',
  transaction_group: 'A',
  aggregation_group: 'NATIONAL_PARTY_CONVENTION_ACCOUNT',
  ...entityIndividual,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const partyNationalPartyConventionAccount: TransactionForm = {
  transaction_name: 'Party National Party Pres. Nominating Convention Account',
  transaction_category: 'OTHER',
  transaction_group: 'F',
  aggregation_group: 'NATIONAL_PARTY_CONVENTION_ACCOUNT',
  ...entityCommittee,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const tribalNationalPartyPresNominatingConventionAccount: TransactionForm = {
  transaction_name: 'Tribal National Party Pres. Nominating Convention Account',
  transaction_category: 'OTHER',
  transaction_group: 'D',
  aggregation_group: 'NATIONAL_PARTY_CONVENTION_ACCOUNT',
  ...entityOrganization,
  fields: {
    ...memoFields,
    ...contributionFields,
  },
};

const unregisteredReceiptFromPersonReturn: TransactionForm = {
  transaction_name: 'Unregistered Receipt from Person - Returned/Bounced Receipt',
  transaction_category: 'INDIVIDUALS/PERSONS',
  transaction_group: 'D',
  aggregation_group: 'GENERAL',
  ...entityOrganization,
  fields: {
    ...memoFields,
    ...contributionFieldsNegative,
    ...purposeDescriptionFieldsRequired,
  },
};

const partyReturn: TransactionForm = {
  transaction_name: 'Party Returned/Bounced Receipt',
  transaction_category: 'REGISTERED FILERS',
  transaction_group: 'F',
  aggregation_group: 'GENERAL',
  ...entityCommittee,
  fields: {
    ...memoFields,
    ...contributionFieldsNegative,
    ...purposeDescriptionFieldsRequired,
  },
};

/*
 *          Group A Transaction Navigation Tree
 * Every entry in this object represents a path that an E2E test
 * can take in generating a valid transaction.
 *
 */

export const schedANavTree: TransactionNavTree = {
  //Commented out lines are branches that have not yet been implemented
  'INDIVIDUALS/PERSONS': {
    'Individual Receipt': individualReceipt,
    'Tribal Receipt': tribalReceipt,
    'Earmark Receipt': earmarkReceipt,
    'Unregistered Receipt from Person': unregisteredReceiptFromPerson,
    'Unregistered Receipt from Person - Returned/Bounced Receipt': unregisteredReceiptFromPersonReturn,
  },
  'REGISTERED FILERS': {
    'Party Receipt': partyReceipt,
    'PAC Receipt': pacReceipt,
    'Party Returned/Bounced Receipt': partyReceipt,
  },
  TRANSFERS: {
    Transfer: transfer,
    'Joint Fundraising Transfer': jointFundraisingTransfer,
    'Joint Fundraising Transfer - National Party Recount/Legal Proceedings Account':
      jointFundraisingTransferNationalPartyRecount,
    'Joint Fundraising Transfer - National Party Pres. Nominating Convention Account':
      jointFundraisingTransferNationalPartyPresNominatingConventionAccount,
    // The children of this screen to not have the standard "Back to Joint Fundraising Transfer" button
    // on the screen so it is being commented out until the button layout for those screens
    // is finalized and implemented. At that time, be sure to uncomment this screen to include
    // it in the e2e tests (12/20/2022)
    // 'Joint Fundraising Transfer - National Party Headquarters Buildings Account':
    //   jointFundraisingTransferNationalPartyHeadquartersBuildingsAccount,
  },
  //"REFUNDS":{},
  OTHER: {
    'Offsets to Operating Expenditures': offsetToOpex,
    'Other Committee Receipt - Non-Contribution Account': otherCommitteeReceiptNonContributionAccount,
    'Other Receipts': otherReceipt,
    'Individual Recount Receipt': individualRecountReceipt,
    'Tribal Recount Receipt': tribalRecountReceipt,
    'PAC Recount Receipt': PACRecountReceipt,
    'Party Recount Receipt': partyRecountReceipt,
    'Business/Labor Organization Receipt - Non-Contribution Account': businessLaborNonContribution,
    'Individual Receipt - Non-Contribution Account': individualNonContribution,
    'PAC National Party Recount/Legal Proceedings Account': pacNationalPartyRecountAccount,
    'Individual National Party Headquarters Buildings Account': individualNationalPartyHeadquartersBuildingsAccount,
    'PAC National Party Headquarters Buildings Account': pacNationalPartyHeadquartersReceipt,
    'PAC National Party Pres. Nominating Convention Account': pacNationalPartyConventionAccount,
    'Party National Party Headquarters Buildings Account': partyNationalPartyHeadquartersReceipt,
    'Tribal National Party Headquarters Buildings Account': tribalNationalPartyHeadquartersBuildingsAccount,
    'Individual National Party Pres. Nominating Convention Account': individualNationalPartyConventionAccount,
    'Tribal National Party Pres. Nominating Convention Account': tribalNationalPartyPresNominatingConventionAccount,
    'Party National Party Recount/Legal Proceedings Account': partyNationalPartyRecountAccount,
    'Individual National Party Recount/Legal Proceedings Account': individualNationalPartyRecountAccount,
    'Party National Party Pres. Nominating Convention Account': partyNationalPartyConventionAccount,
    'Tribal National Party Recount/Legal Proceedings Account': tribalNationalPartyRecountAccount,
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
