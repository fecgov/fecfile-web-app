import { plainToClass, Transform } from 'class-transformer';
import { Transaction } from './transaction.model';
import { LabelList } from '../utils/label.utils';
import { BaseModel } from './base.model';

export class SchATransaction extends Transaction {
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

  override apiEndpoint = '/sch-a-transactions';

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
  PARTY_RECEIPT = 'PARTY_RECEIPT',
  PARTY_IN_KIND = 'PARTY_IK_REC',
  RETURNED_BOUNCED_RECEIPT_PARTY = 'PARTY_RET',
  PAC_RECEIPT = 'PAC_RECEIPT',
  PAC_IN_KIND = 'PAC_IK_REC',
  PAC_EARMARK_RECEIPT = 'PAC_EAR_REC',
  PAC_CONDUIT_EARMARK_DEPOSITED = 'PAC_CONDUIT_EARMARK_DEPOSITED',
  PAC_CONDUIT_EARMARK_UNDEPOSITED = 'PAC_CONDUIT_EARMARK_UNDEPOSITED',
  RETURNED_BOUNCED_RECEIPT_PAC = 'PAC_RET',
  // Transfers
  TRANSFER = 'TRANSFER',
  JOINT_FUNDRAISING_TRANSFER = 'JOINT_FUNDRAISING_TRANSFER',
  IN_KIND_TRANSFER = 'IK_TRAN',
  IN_KIND_TRANSFER_FEA = 'IK_TRAN_FEA',
  JF_TRANSFER_NATIONAL_PARTY_CONVENTION_ACCOUNT = 'JF_TRANSFER_NATIONAL_PARTY_CONVENTION_ACCOUNT',
  JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT = 'JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT',
  JF_TRANSFER_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT = 'JF_TRANSFER_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT',
  // Refunds
  REFUNDS_OF_CONTRIBUTIONS_TO_REGISTERED_COMMITTEES = 'REF_TO_FED_CAN',
  REFUNDS_OF_CONTRIBUTIONS_TO_UNREGISTERED_COMMITTEES = 'REF_TO_OTH_CMTE',
  // Other
  OFFSET_TO_OPERATING_EXPENDITURES = 'OFFSET_TO_OPERATING_EXPENDITURES',
  OTHER_RECEIPTS = 'OTHER_RECEIPT',
  INDIVIDUAL_RECEIPT_NON_CONTRIBUTION_ACCOUNT = 'INDIVIDUAL_RECEIPT_NON_CONTRIBUTION_ACCOUNT',
  OTHER_COMMITTEE_RECEIPT_NON_CONTRIBUTION_ACCOUNT = 'OTHER_COMMITTEE_NON_CONTRIBUTION_ACCOUNT',
  BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT = 'BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT',
  INDIVIDUAL_RECOUNT_RECEIPT = 'INDIVIDUAL_RECOUNT_RECEIPT',
  PARTY_RECOUNT_RECEIPT = 'PARTY_RECOUNT_RECEIPT',
  PAC_RECOUNT_RECEIPT = 'PAC_RECOUNT_RECEIPT',
  TRIBAL_RECOUNT_RECEIPT = 'TRIBAL_RECOUNT_RECEIPT',
  INDIVIDUAL_NATIONAL_PARTY_RECOUNT_ACCOUNT = 'INDIVIDUAL_NATIONAL_PARTY_RECOUNT_ACCOUNT',
  PARTY_NATIONAL_PARTY_RECOUNT_ACCOUNT = 'PARTY_NP_RECNT_ACC',
  PAC_NATIONAL_PARTY_RECOUNT_ACCOUNT = 'PAC_NATIONAL_PARTY_RECOUNT_ACCOUNT',
  TRIBAL_NATIONAL_PARTY_RECOUNT_ACCOUNT = 'TRIBAL_NATIONAL_PARTY_RECOUNT_ACCOUNT',
  INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT = 'INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT',
  PARTY_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT = 'PARTY_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT',
  PAC_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT = 'PAC_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT',
  TRIBAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT = 'TRIBAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT',
  PAC_NATIONAL_PARTY_CONVENTION_ACCOUNT = 'PAC_NATIONAL_PARTY_CONVENTION_ACCOUNT',
  INDIVIDUAL_NATIONAL_PARTY_CONVENTION_ACCOUNT = 'INDIVIDUAL_NATIONAL_PARTY_CONVENTION_ACCOUNT',
  PARTY_NATIONAL_PARTY_CONVENTION_ACCOUNT = 'PARTY_NATIONAL_PARTY_CONVENTION_ACCOUNT',
  TRIBAL_NATIONAL_PARTY_CONVENTION_ACCOUNT = 'TRIBAL_NATIONAL_PARTY_CONVENTION_ACCOUNT',
  EARMARK_RECEIPT_FOR_RECOUNT_ACCOUNT_CONTRIBUTION = 'EAR_REC_RECNT_ACC',
  EARMARK_RECEIPT_FOR_CONVENTION_ACCOUNT_CONTRIBUTION = 'EAR_REC_CONVEN_ACC',
  EARMARK_RECEIPT_FOR_HEADQUARTERS_ACCOUNT_CONTRIBUTION = 'EAR_REC_HQ_ACC',
  // Child transactiion types
  EARMARK_MEMO = 'EARMARK_MEMO',
  PAC_JF_TRANSFER_MEMO = 'PAC_JF_TRANSFER_MEMO',
  INDIVIDUAL_JF_TRANSFER_MEMO = 'INDIVIDUAL_JF_TRANSFER_MEMO',
  PARTY_JF_TRANSFER_MEMO = 'PARTY_JF_TRANSFER_MEMO',
  TRIBAL_JF_TRANSFER_MEMO = 'TRIBAL_JF_TRANSFER_MEMO',
  INDIVIDUAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO = 'INDIVIDUAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO',
  PAC_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO = 'PAC_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO',
  TRIBAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO = 'TRIBAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO',
  PARTNERSHIP_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO = 'PARTNERSHIP_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO',
  INDIVIDUAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO = 'INDIVIDUAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO',
  PAC_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO = 'PAC_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO',
  TRIBAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO = 'TRIBAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO',
  INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO = 'INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO',
  PAC_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO = 'PAC_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO',
  TRIBAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO = 'TRIBAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO',
  PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO = 'PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO',
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
  [ScheduleATransactionTypes.TRANSFER, 'Transfer'],
  [ScheduleATransactionTypes.JOINT_FUNDRAISING_TRANSFER, 'Joint Fundraising Transfer'],
  [ScheduleATransactionTypes.INDIVIDUAL_JF_TRANSFER_MEMO, 'Individual Joint Fundraising Transfer Memo'],
  [ScheduleATransactionTypes.PAC_JF_TRANSFER_MEMO, 'PAC Joint Fundraising Transfer Memo'],
  [ScheduleATransactionTypes.PARTY_JF_TRANSFER_MEMO, 'Party Joint Fundraising Transfer Memo'],
  [ScheduleATransactionTypes.TRIBAL_JF_TRANSFER_MEMO, 'Tribal Joint Fundraising Transfer Memo'],
  [ScheduleATransactionTypes.IN_KIND_TRANSFER, 'In-Kind Transfer'],
  [ScheduleATransactionTypes.IN_KIND_TRANSFER_FEA, 'In-Kind Transfer - Federal Election Activity'],
  [
    ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT,
    'Joint Fundraising Transfer - National Party Recount/Legal Proceedings Account',
  ],
  [
    ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_CONVENTION_ACCOUNT,
    'Joint Fundraising Transfer - National Party Pres. Nominating Convention Account',
  ],
  [
    ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    'Joint Fundraising Transfer - National Party Headquarters Buildings Account',
  ],
  [
    ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO,
    'Individual National Party Pres. Nominating Convention Account JF Transfer Memo',
  ],
  [
    ScheduleATransactionTypes.PAC_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO,
    'PAC National Party Pres. Nominating Convention Account JF Transfer Memo',
  ],
  [
    ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO,
    'Tribal National Party Pres. Nominating Convention Account JF Transfer Memo',
  ],
  [
    ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO,
    'Partnership Receipt Pres. Nominating Convention Account JF Transfer Memo',
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
  [
    ScheduleATransactionTypes.INDIVIDUAL_RECEIPT_NON_CONTRIBUTION_ACCOUNT,
    'Individual Receipt - Non-Contribution Account',
  ],
  [
    ScheduleATransactionTypes.OTHER_COMMITTEE_RECEIPT_NON_CONTRIBUTION_ACCOUNT,
    'Other Committee Receipt - Non-Contribution Account',
  ],
  [
    ScheduleATransactionTypes.BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT,
    'Business/Labor Organization Receipt - Non-Contribution Account',
  ],
  [ScheduleATransactionTypes.INDIVIDUAL_RECOUNT_RECEIPT, 'Individual Recount Receipt'],
  [ScheduleATransactionTypes.PARTY_RECOUNT_RECEIPT, 'Party Recount Receipt'],
  [ScheduleATransactionTypes.PAC_RECOUNT_RECEIPT, 'PAC Recount Receipt'],
  [ScheduleATransactionTypes.TRIBAL_RECOUNT_RECEIPT, 'Tribal Recount Receipt'],
  [
    ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_RECOUNT_ACCOUNT,
    'Individual National Party Recount/Legal Proceedings Account',
  ],
  [
    ScheduleATransactionTypes.PARTY_NATIONAL_PARTY_RECOUNT_ACCOUNT,
    'Party National Party Recount/Legal Proceedings Account',
  ],
  [
    ScheduleATransactionTypes.PAC_NATIONAL_PARTY_RECOUNT_ACCOUNT,
    'PAC National Party Recount/Legal Proceedings Account',
  ],
  [
    ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_RECOUNT_ACCOUNT,
    'Tribal National Party Recount/Legal Proceedings Account',
  ],
  [
    ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    'Individual National Party Headquarters Buildings Account',
  ],
  [
    ScheduleATransactionTypes.PARTY_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    'Party National Party Headquarters Buildings Account',
  ],
  [
    ScheduleATransactionTypes.PAC_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    'PAC National Party Headquarters Buildings Account',
  ],
  [
    ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    'Tribal National Party Headquarters Buildings Account',
  ],
  [
    ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_CONVENTION_ACCOUNT,
    'Individual National Party Pres. Nominating Convention Account',
  ],
  [
    ScheduleATransactionTypes.PARTY_NATIONAL_PARTY_CONVENTION_ACCOUNT,
    'Party National Party Pres. Nominating Convention Account',
  ],
  [
    ScheduleATransactionTypes.PAC_NATIONAL_PARTY_CONVENTION_ACCOUNT,
    'PAC National Party Pres. Nominating Convention Account',
  ],
  [
    ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_CONVENTION_ACCOUNT,
    'Tribal National Party Pres. Nominating Convention Account',
  ],
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
  [
    ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO,
    'Individual National Party Recount/Legal Proceedings Account JF Transfer Memo',
  ],
  [
    ScheduleATransactionTypes.PAC_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO,
    'PAC National Party Recount/Legal Proceedings Account JF Transfer Memo',
  ],
  [
    ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO,
    'Tribal National Party Recount/Legal Proceedings Account JF Transfer Memo',
  ],
  [
    ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO,
    'Individual National Party Headquarters Buildings Account JF Transfer Memo',
  ],
  [
    ScheduleATransactionTypes.PAC_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO,
    'PAC National Party Headquarters Buildings Account JF Transfer Memo',
  ],
  [
    ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO,
    'Tribal National Party Headquarters Buildings Account JF Transfer Memo',
  ],
  [
    ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO,
    'Partnership Receipt Headquarters Buildings Account JF Transfer Memo',
  ],
];

export enum AggregationGroups {
  GENERAL = 'GENERAL',
  LINE_15 = 'LINE_15',
  LINE_16 = 'LINE_16',
  NATIONAL_PARTY_CONVENTION_ACCOUNT = 'NATIONAL_PARTY_CONVENTION_ACCOUNT',
  NATIONAL_PARTY_HEADQUARTERS_ACCOUNT = 'NATIONAL_PARTY_HEADQUARTERS_ACCOUNT',
  NATIONAL_PARTY_RECOUNT_ACCOUNT = 'NATIONAL_PARTY_RECOUNT_ACCOUNT',
  NON_CONTRIBUTION_ACCOUNT = 'NON_CONTRIBUTION_ACCOUNT',
  OTHER_RECEIPTS = 'OTHER_RECEIPTS',
  RECOUNT_ACCOUNT = 'RECOUNT_ACCOUNT',
}
