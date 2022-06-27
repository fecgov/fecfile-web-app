import { BaseModel } from './base.model';
import { Transaction } from '../interfaces/transaction.interface';
import { plainToClass } from 'class-transformer';
import { LabelList } from '../utils/label.utils';

export class SchATransaction extends BaseModel implements Transaction {
  id: number | null = null;

  form_type: string | null = null;
  filer_committee_id_number: string | null = null;
  transaction_id: string | null = null;
  back_reference_tran_id_number: string | null = null;
  back_reference_sched_name: string | null = null;
  entity_type: string | null = null;
  contributor_organization_name: string | null = null;
  contributor_last_name: string | null = null;
  contributor_first_name: string | null = null;
  contributor_middle_name: string | null = null;
  contributor_prefix: string | null = null;
  contributor_suffix: string | null = null;
  contributor_street_1: string | null = null;
  contributor_street_2: string | null = null;
  contributor_city: string | null = null;
  contributor_state: string | null = null;
  contributor_zip: string | null = null;
  election_code: string | null = null;
  election_other_description: string | null = null;
  contribution_date: string | null = null;
  contribution_amount: number | null = null;
  contribution_aggregate: number | null = null;
  contribution_purpose_descrip: string | null = null;
  contributor_employer: string | null = null;
  contributor_occupation: string | null = null;
  donor_committee_fec_id: string | null = null;
  donor_committee_name: string | null = null;
  donor_candidate_fec_id: string | null = null;
  donor_candidate_last_name: string | null = null;
  donor_candidate_first_name: string | null = null;
  donor_candidate_middle_name: string | null = null;
  donor_candidate_prefix: string | null = null;
  donor_candidate_suffix: string | null = null;
  donor_candidate_office: string | null = null;
  donor_candidate_state: string | null = null;
  donor_candidate_district: string | null = null;
  conduit_name: string | null = null;
  conduit_street1: string | null = null;
  conduit_street2: string | null = null;
  conduit_city: string | null = null;
  conduit_state: string | null = null;
  conduit_zip: string | null = null;
  memo_code: boolean | null = null;
  memo_text_description: string | null = null;
  reference_to_si_or_sl_system_code_that_identifies_the_account: string | null = null;
  transaction_type_identifier: string | null = null;
  parent_transaction: number | null = null; // Foreign key to the SchATransaction model

  created: string | null = null;
  updated: string | null = null;
  deleted: string | null = null;

  report_id: number | null = null; // Foreign key to the F3XSummary model

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
  INDIVIDUAL_RECEIPT = 'INDV_REC',
  TRIBAL_RECEIPT = 'TRIB_REC',
  PARTNERSHIP_RECEIPT = 'PARTN_REC',
  REATTRIBUTION = 'REATT_FROM',
  IN_KIND_RECEIPT = 'IK_REC',
  RETURNED_BOUNCED_RECEIPT_INDIVIDUAL = 'RET_REC',
  EARMARK_RECEIPT = 'EAR_REC',
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
  JF_TRANSFERS = 'JF_TRAN',
  JF_TRAN_PAC_MEMO = 'JF_TRAN_PAC_MEMO',
  IN_KIND_TRANSFER = 'IK_TRAN',
  IN_KIND_TRANSFER_FEA = 'IK_TRAN_FEA',
  JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT = 'JF_TRAN_NP_RECNT_ACC',
  JF_TRANSFER_NATIONAL_PARTY_CONVENTION_ACCOUNT = 'JF_TRAN_NP_CONVEN_ACC',
  JF_TRANSFER_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT = 'JF_TRAN_NP_HQ_ACC',
  // Refunds
  REFUNDS_OF_CONTRIBUTIONS_TO_REGISTERED_COMMITTEES = 'REF_TO_FED_CAN',
  REFUNDS_OF_CONTRIBUTIONS_TO_UNREGISTERED_COMMITTEES = 'REF_TO_OTH_CMTE',
  // Other
  OFFSETS_TO_OPERATING_EXPENDITURES = 'OFFSET_TO_OPEX',
  OTHER_RECEIPTS = 'OTH_REC',
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
  [ScheduleATransactionTypes.JF_TRANSFERS, 'JF Transfers'],
  [ScheduleATransactionTypes.JF_TRAN_PAC_MEMO, 'JF Transfer PAC Memos'],
  [ScheduleATransactionTypes.IN_KIND_TRANSFER, 'In-Kind Transfer'],
  [ScheduleATransactionTypes.IN_KIND_TRANSFER_FEA, 'In-Kind Transfer-FEA'],
  [
    ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT,
    'JF Transfer - National Party Recount Account',
  ],
  [
    ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_CONVENTION_ACCOUNT,
    'JF Transfer - National Party Convention Account',
  ],
  [
    ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    'JF Transfer - National Party Headquarters Account',
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
  [ScheduleATransactionTypes.OFFSETS_TO_OPERATING_EXPENDITURES, 'Offsets to Operating Expenditures'],
  [ScheduleATransactionTypes.OTHER_RECEIPTS, 'Other Receipts'],
  [ScheduleATransactionTypes.IND_RECEIPT_NON_CONTRIBUTION_ACCOUNT, 'Ind. Receipt - Non-Contribution Account'],
  [
    ScheduleATransactionTypes.OTHER_COMMITTEE_RECEIPT_NON_CONTRIBUTION_ACCOUNT,
    'Other Committee Receipt - Non-Contribution Account',
  ],
  [
    ScheduleATransactionTypes.BUSINESS_LABOR_ORG_RECEIPT_NON_CONTRIBUTION_ACCOUNT,
    'Business/Labor Org. Receipt - Non-Contribution Account',
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
