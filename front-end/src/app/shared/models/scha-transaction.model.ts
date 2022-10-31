import { plainToClass, Transform } from 'class-transformer';
import { Transaction } from '../interfaces/transaction.interface';
import { LabelList } from '../utils/label.utils';
import { BaseModel } from './base.model';
import { Contact } from './contact.model';

export class SchATransaction extends BaseModel implements Transaction {
  id: string | undefined;

  form_type: string | undefined;
  filer_committee_id_number: string | undefined;
  transaction_id: string | null = null; // This is a required field and must exist
  back_reference_tran_id_number: string | undefined;
  back_reference_sched_name: string | undefined;
  entity_type: string | undefined;
  contributor_organization_name: string | undefined;
  contributor_last_name: string | undefined;
  contributor_first_name: string | undefined;
  contributor_middle_name: string | undefined;
  contributor_prefix: string | undefined;
  contributor_suffix: string | undefined;
  contributor_street_1: string | undefined;
  contributor_street_2: string | undefined;
  contributor_city: string | undefined;
  contributor_state: string | undefined;
  contributor_zip: string | undefined;
  election_code: string | undefined;
  election_other_description: string | undefined;
  @Transform(BaseModel.dateTransform) contribution_date: Date | undefined;
  contribution_amount: number | undefined;
  contribution_aggregate: number | undefined;
  aggregation_group: AggregationGroups | undefined;
  contribution_purpose_descrip: string | undefined;
  contributor_employer: string | undefined;
  contributor_occupation: string | undefined;
  donor_committee_fec_id: string | undefined;
  donor_committee_name: string | undefined;
  donor_candidate_fec_id: string | undefined;
  donor_candidate_last_name: string | undefined;
  donor_candidate_first_name: string | undefined;
  donor_candidate_middle_name: string | undefined;
  donor_candidate_prefix: string | undefined;
  donor_candidate_suffix: string | undefined;
  donor_candidate_office: string | undefined;
  donor_candidate_state: string | undefined;
  donor_candidate_district: string | undefined;
  conduit_name: string | undefined;
  conduit_street1: string | undefined;
  conduit_street2: string | undefined;
  conduit_city: string | undefined;
  conduit_state: string | undefined;
  conduit_zip: string | undefined;
  memo_code: boolean | undefined;
  memo_text_description: string | undefined;
  reference_to_si_or_sl_system_code_that_identifies_the_account: string | undefined;
  transaction_type_identifier: string | undefined;

  parent_transaction: Transaction | undefined;
  parent_transaction_id: string | undefined; // Foreign key to the SchATransaction model

  created: string | undefined;
  updated: string | undefined;
  deleted: string | undefined;

  report_id: string | undefined; // Foreign key to the F3XSummary model

  contact: Contact | undefined;
  contact_id: string | undefined; // Foreign key to the Contact model

  children: Transaction[] | undefined;

  fields_to_validate: string[] | undefined; // Fields to run through validation in the API when creating or updating a transaction

  // prettier-ignore
  static fromJSON(json: any): SchATransaction { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToClass(SchATransaction, json);
  }
}

export enum ScheduleATransactionGroups {
  CONTRIBUTIONS_FROM_INDIVIDUALS_PERSONS = 'CONTRIBUTIONS FROM INDIVIDUALS/PERSONS',
  CONTRIBUTIONS_FROM_REGISTERED_FILERS = 'CONTRIBUTIONS FROM REGISTERED FILERS',
  TRANSFERS = 'TRANSFERS',
  REFUNDS = 'REFUNDS',
  OTHER = 'OTHER',
}

export type ScheduleATransactionGroupsType =
  | ScheduleATransactionGroups.CONTRIBUTIONS_FROM_INDIVIDUALS_PERSONS
  | ScheduleATransactionGroups.CONTRIBUTIONS_FROM_REGISTERED_FILERS
  | ScheduleATransactionGroups.TRANSFERS
  | ScheduleATransactionGroups.REFUNDS
  | ScheduleATransactionGroups.OTHER;

export enum ScheduleATransactionTypes {
  // Contributions from Individuals/Persons
  INDIVIDUAL_RECEIPT = 'INDIVIDUAL_RECEIPT',
  TRIBAL_RECEIPT = 'TRIBAL_RECEIPT',
  PARTNERSHIP_RECEIPT = 'PARTN_REC',
  REATTRIBUTION = 'REATT_FROM',
  IN_KIND_RECEIPT = 'IK_REC',
  RETURNED_BOUNCED_RECEIPT_INDIVIDUAL = 'RET_REC',
  EARMARK_RECEIPT = 'EARMARK_RECEIPT',
  CONDUIT_EARMARK_DEPOSITED = 'CONDUIT_EARMARK_DEPOSITED',
  CONDUIT_EARMARK_UNDEPOSITED = 'CONDUIT_EARMARK_UNDEPOSITED',
  UNREGISTERED_RECEIPT_FROM_PERSON = 'PAC_NON_FED_REC',
  UNREGISTERED_RECEIPT_FROM_PERSON_RETURNED_BOUNCED_RECEIPT = 'PAC_NON_FED_RET',
  // Contributions from Registered Filers
  PARTY_RECEIPT = 'PARTY_REC',
  PARTY_IN_KIND = 'PARTY_IK_REC',
  RETURNED_BOUNCED_RECEIPT_PARTY = 'PARTY_RET',
  PAC_RECEIPT = 'PAC_REC',
  PAC_IN_KIND = 'PAC_IK_REC',
  PAC_EARMARK_RECEIPT = 'PAC_EAR_REC',
  PAC_CONDUIT_EARMARK_DEPOSITED = 'PAC_CONDUIT_EARMARK_DEPOSITED',
  PAC_CONDUIT_EARMARK_UNDEPOSITED = 'PAC_CONDUIT_EARMARK_UNDEPOSITED',
  RETURNED_BOUNCED_RECEIPT_PAC = 'PAC_RET',
  // Transfers
  TRANSFERS = 'TRAN',
  JOINT_FUNDRAISING_TRANSFER = 'JOINT_FUNDRAISING_TRANSFER',
  PAC_JF_TRANSFER_MEMO = 'PAC_JF_TRANSFER_MEMO',
  IN_KIND_TRANSFER = 'IK_TRAN',
  IN_KIND_TRANSFER_FEA = 'IK_TRAN_FEA',
  JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT = 'JF_TRAN_NP_RECNT_ACC',
  JF_TRANSFER_NATIONAL_PARTY_CONVENTION_ACCOUNT = 'JF_TRAN_NP_CONVEN_ACC',
  JF_TRANSFER_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT = 'JF_TRAN_NP_HQ_ACC',
  // Refunds
  REFUNDS_OF_CONTRIBUTIONS_TO_REGISTERED_COMMITTEES = 'REF_TO_FED_CAN',
  REFUNDS_OF_CONTRIBUTIONS_TO_UNREGISTERED_COMMITTEES = 'REF_TO_OTH_CMTE',
  // Other
  OFFSET_TO_OPERATING_EXPENDITURES = 'OFFSET_TO_OPERATING_EXPENDITURES',
  OTHER_RECEIPTS = 'OTHER_RECEIPT',
  IND_RECEIPT_NON_CONTRIBUTION_ACCOUNT = 'IND_REC_NON_CONT_ACC',
  OTHER_COMMITTEE_RECEIPT_NON_CONTRIBUTION_ACCOUNT = 'OTH_CMTE_NON_CONT_ACC',
  BUSINESS_LABOR_ORG_RECEIPT_NON_CONTRIBUTION_ACCOUNT = 'BUS_LAB_NON_CONT_ACC',
  INDIVIDUAL_RECOUNT_RECEIPT = 'IND_RECNT_REC',
  PARTY_RECOUNT_RECEIPT = 'PARTY_RECNT_REC',
  PAC_RECOUNT_RECEIPT = 'PAC_RECNT_REC',
  TRIBAL_RECOUNT_RECEIPT = 'TRIB_RECNT_REC',
  INDIVIDUAL_NATIONAL_PARTY_RECOUNT_ACCOUNT = 'IND_NP_RECNT_ACC',
  PARTY_NATIONAL_PARTY_RECOUNT_ACCOUNT = 'PARTY_NP_RECNT_ACC',
  PAC_NATIONAL_PARTY_RECOUNT_ACCOUNT = 'PAC_NP_RECNT_ACC',
  TRIBAL_NATIONAL_PARTY_RECOUNT_ACCOUNT = 'TRIB_NP_RECNT_ACC',
  INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_BUILDINGS_ACCOUNT = 'IND_NP_HQ_ACC',
  PARTY_NATIONAL_PARTY_HEADQUARTERS_BUILDINGS_ACCOUNT = 'PARTY_NP_HQ_ACC',
  PAC_NATIONAL_PARTY_HEADQUARTERS_BUILDINGS_ACCOUNT = 'PAC_NP_HQ_ACC',
  TRIBAL_NATIONAL_PARTY_HEADQUARTERS_BUILDINGS_ACCOUNT = 'TRIB_NP_HQ_ACC',
  INDIVIDUAL_NATIONAL_PARTY_CONVENTION_ACCOUNT = 'IND_NP_CONVEN_ACC',
  PARTY_NATIONAL_PARTY_CONVENTION_ACCOUNT = 'PARTY_NP_CONVEN_ACC',
  PAC_NATIONAL_PARTY_CONVENTION_ACCOUNT = 'PAC_NP_CONVEN_ACC',
  TRIBAL_NATIONAL_PARTY_CONVENTION_ACCOUNT = 'TRIB_NP_CONVEN_ACC',
  EARMARK_RECEIPT_FOR_RECOUNT_ACCOUNT_CONTRIBUTION = 'EAR_REC_RECNT_ACC',
  EARMARK_RECEIPT_FOR_CONVENTION_ACCOUNT_CONTRIBUTION = 'EAR_REC_CONVEN_ACC',
  EARMARK_RECEIPT_FOR_HEADQUARTERS_ACCOUNT_CONTRIBUTION = 'EAR_REC_HQ_ACC',
  // Child transactiion types
  EARMARK_MEMO = 'EARMARK_MEMO',
}

export const ScheduleATransactionTypeLabels: LabelList = [
  // Contributions from Individuals/Persons
  [ScheduleATransactionTypes.INDIVIDUAL_RECEIPT, 'Individual Receipt'],
  [ScheduleATransactionTypes.TRIBAL_RECEIPT, 'Tribal Receipt'],
  [ScheduleATransactionTypes.PARTNERSHIP_RECEIPT, 'Partnership Receipt'],
  [ScheduleATransactionTypes.REATTRIBUTION, 'Reattribution'],
  [ScheduleATransactionTypes.IN_KIND_RECEIPT, 'In-Kind Receipt'],
  [ScheduleATransactionTypes.RETURNED_BOUNCED_RECEIPT_INDIVIDUAL, 'Returned/Bounced Receipt (Individual)'],
  [ScheduleATransactionTypes.EARMARK_RECEIPT, 'Earmark Receipt'],
  [ScheduleATransactionTypes.CONDUIT_EARMARK_DEPOSITED, 'Conduit Earmark (Deposited)'],
  [ScheduleATransactionTypes.CONDUIT_EARMARK_UNDEPOSITED, 'Conduit Earmark (Undeposited)'],
  [ScheduleATransactionTypes.UNREGISTERED_RECEIPT_FROM_PERSON, 'Unregistered Receipt from Person'],
  [
    ScheduleATransactionTypes.UNREGISTERED_RECEIPT_FROM_PERSON_RETURNED_BOUNCED_RECEIPT,
    'Unregistered Receipt from Person - Returned/Bounced Receipt',
  ],
  // Contributions from Registered Filers
  [ScheduleATransactionTypes.PARTY_RECEIPT, 'Party Receipt'],
  [ScheduleATransactionTypes.PARTY_IN_KIND, 'Party In-Kind'],
  [ScheduleATransactionTypes.RETURNED_BOUNCED_RECEIPT_PARTY, 'Returned/Bounced Receipt (Party)'],
  [ScheduleATransactionTypes.PAC_RECEIPT, 'PAC Receipt'],
  [ScheduleATransactionTypes.PAC_IN_KIND, 'PAC In-Kind'],
  [ScheduleATransactionTypes.PAC_EARMARK_RECEIPT, 'PAC Earmark Receipt'],
  [ScheduleATransactionTypes.PAC_CONDUIT_EARMARK_DEPOSITED, 'PAC Conduit Earmark (Deposited)'],
  [ScheduleATransactionTypes.PAC_CONDUIT_EARMARK_UNDEPOSITED, 'PAC Conduit Earmark (Undeposited)'],
  [ScheduleATransactionTypes.RETURNED_BOUNCED_RECEIPT_PAC, 'Returned/Bounced Receipt (PAC)'],
  // Transfers
  [ScheduleATransactionTypes.TRANSFERS, 'Transfers'],
  [ScheduleATransactionTypes.JOINT_FUNDRAISING_TRANSFER, 'Joint Fundraising Transfer'],
  [ScheduleATransactionTypes.PAC_JF_TRANSFER_MEMO, 'PAC Joint Fundraising Transfer Memo'],
  [ScheduleATransactionTypes.IN_KIND_TRANSFER, 'In-Kind Transfer'],
  [ScheduleATransactionTypes.IN_KIND_TRANSFER_FEA, 'In-Kind Transfer - Federal Election Activity'],
  [
    ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT,
    'Joint Fundraising Transfer - National Party Recount Account',
  ],
  [
    ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_CONVENTION_ACCOUNT,
    'Joint Fundraising Transfer - National Party Convention Account',
  ],
  [
    ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    'Joint Fundraising Transfer - National Party Headquarters Account',
  ],
  // Refunds
  [
    ScheduleATransactionTypes.REFUNDS_OF_CONTRIBUTIONS_TO_REGISTERED_COMMITTEES,
    'Refunds of Contributions to Registered Committees',
  ],
  [
    ScheduleATransactionTypes.REFUNDS_OF_CONTRIBUTIONS_TO_UNREGISTERED_COMMITTEES,
    'Refunds of Contributions to Unregistered Committees',
  ],
  // Other
  [ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES, 'Offsets to Operating Expenditures'],
  [ScheduleATransactionTypes.OTHER_RECEIPTS, 'Other Receipts'],
  [ScheduleATransactionTypes.IND_RECEIPT_NON_CONTRIBUTION_ACCOUNT, 'Individual Receipt - Non-Contribution Account'],
  [
    ScheduleATransactionTypes.OTHER_COMMITTEE_RECEIPT_NON_CONTRIBUTION_ACCOUNT,
    'Other Committee Receipt - Non-Contribution Account',
  ],
  [
    ScheduleATransactionTypes.BUSINESS_LABOR_ORG_RECEIPT_NON_CONTRIBUTION_ACCOUNT,
    'Business/Labor Organization Receipt - Non-Contribution Account',
  ],
  [ScheduleATransactionTypes.INDIVIDUAL_RECOUNT_RECEIPT, 'Individual Recount Receipt'],
  [ScheduleATransactionTypes.PARTY_RECOUNT_RECEIPT, 'Party Recount Receipt'],
  [ScheduleATransactionTypes.PAC_RECOUNT_RECEIPT, 'PAC Recount Receipt'],
  [ScheduleATransactionTypes.TRIBAL_RECOUNT_RECEIPT, 'Tribal Recount Receipt'],
  [ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_RECOUNT_ACCOUNT, 'Individual National Party Recount Account'],
  [ScheduleATransactionTypes.PARTY_NATIONAL_PARTY_RECOUNT_ACCOUNT, 'Party National Party Recount Account'],
  [ScheduleATransactionTypes.PAC_NATIONAL_PARTY_RECOUNT_ACCOUNT, 'PAC National Party Recount Account'],
  [ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_RECOUNT_ACCOUNT, 'Tribal National Party Recount Account'],
  [
    ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_BUILDINGS_ACCOUNT,
    'Individual National Party Headquarters Buildings Account',
  ],
  [
    ScheduleATransactionTypes.PARTY_NATIONAL_PARTY_HEADQUARTERS_BUILDINGS_ACCOUNT,
    'Party National Party Headquarters Buildings Account',
  ],
  [
    ScheduleATransactionTypes.PAC_NATIONAL_PARTY_HEADQUARTERS_BUILDINGS_ACCOUNT,
    'PAC National Party Headquarters Buildings Account',
  ],
  [
    ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_HEADQUARTERS_BUILDINGS_ACCOUNT,
    'Tribal National Party Headquarters Buildings Account',
  ],
  [
    ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_CONVENTION_ACCOUNT,
    'Individual National Party Convention Account',
  ],
  [ScheduleATransactionTypes.PARTY_NATIONAL_PARTY_CONVENTION_ACCOUNT, 'Party National Party Convention Account'],
  [ScheduleATransactionTypes.PAC_NATIONAL_PARTY_CONVENTION_ACCOUNT, 'PAC National Party Convention Account'],
  [ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_CONVENTION_ACCOUNT, 'Tribal National Party Convention Account'],
  [
    ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_RECOUNT_ACCOUNT_CONTRIBUTION,
    'Earmark Receipt for Recount Account (Contribution)',
  ],
  [
    ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_CONVENTION_ACCOUNT_CONTRIBUTION,
    'Earmark Receipt for Convention Account (Contribution)',
  ],
  [
    ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_HEADQUARTERS_ACCOUNT_CONTRIBUTION,
    'Earmark Receipt for Headquarters Account (Contribution)',
  ],
];

export enum AggregationGroups {
  GENERAL = 'GENERAL',
  LINE_15 = 'LINE_15',
  LINE_16 = 'LINE_16',
  NPARTY_CONVENTION = 'NATIONAL_PARTY_CONVENTION_ACCOUNT',
  NPARTY_HEADQUARTERS = 'NATIONAL_PARTY_HEADQUARTERS_ACCOUNT',
  NPARTY_RECOUNT_ACCOUNT = 'NATIONAL_PARTY_RECOUNT_ACCOUNT',
  NON_CONTRIBUTION_ACCOUNT = 'NON_CONTRIBUTION_ACCOUNT',
  OTHER_RECEIPTS = 'OTHER_RECEIPTS',
  RECOUNT_ACCOUNT = 'RECOUNT_ACCOUNT',
}
