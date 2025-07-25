import { plainToInstance, Transform } from 'class-transformer';
import { AggregationGroups, Transaction } from './transaction.model';
import { LabelList } from '../utils/label.utils';
import { BaseModel } from './base.model';
import { getFromJSON, TransactionTypeUtils } from '../utils/transaction-type.utils';
import { ReattRedesTypes } from '../utils/reatt-redes/reatt-redes.utils';
import { ReattributionToUtils } from '../utils/reatt-redes/reattribution-to.utils';
import { ReattributionFromUtils } from '../utils/reatt-redes/reattribution-from.utils';
import { ReattributedUtils } from '../utils/reatt-redes/reattributed.utils';

export class SchATransaction extends Transaction {
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
  conduit_street_1: string | undefined;
  conduit_street_2: string | undefined;
  conduit_city: string | undefined;
  conduit_state: string | undefined;
  conduit_zip: string | undefined;
  memo_code: boolean | undefined;
  memo_text_description: string | undefined;
  reference_to_si_or_sl_system_code_that_identifies_the_account: string | undefined;
  reattribution_redesignation_tag: string | undefined;
  reatt_redes_total?: number; // Amount of total money that has been reattributed for a transaction.

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: any, depth = 2): SchATransaction {
    let transaction = plainToInstance(SchATransaction, json);
    if (transaction.transaction_type_identifier) {
      const transactionType = TransactionTypeUtils.factory(transaction.transaction_type_identifier);
      transaction.setMetaProperties(transactionType);
    }
    if (depth > 0 && transaction.parent_transaction) {
      transaction.parent_transaction = getFromJSON(transaction.parent_transaction, depth - 1);
    }
    if (depth > 0 && transaction.children) {
      transaction.children = transaction.children.map(function (child) {
        return getFromJSON(child, depth - 1);
      });
    }
    switch (transaction.reattribution_redesignation_tag) {
      case ReattRedesTypes.REATTRIBUTED: {
        transaction = ReattributedUtils.overlayTransactionProperties(transaction);
        break;
      }
      case ReattRedesTypes.REATTRIBUTION_TO: {
        transaction = ReattributionToUtils.overlayTransactionProperties(transaction);
        break;
      }
      case ReattRedesTypes.REATTRIBUTION_FROM: {
        transaction = ReattributionFromUtils.overlayTransactionProperties(transaction);
        break;
      }
    }
    if (depth > 0 && transaction.reatt_redes) {
      transaction.reatt_redes = getFromJSON(transaction.reatt_redes, depth - 1);
    }
    return transaction;
  }

  override getFieldsNotToValidate(): string[] {
    return ['back_reference_tran_id_number', 'back_reference_sched_name', ...super.getFieldsNotToValidate()];
  }
}

export enum ScheduleATransactionTypes {
  // Contributions from Individuals/Persons
  INDIVIDUAL_RECEIPT = 'INDIVIDUAL_RECEIPT',
  TRIBAL_RECEIPT = 'TRIBAL_RECEIPT',
  PARTNERSHIP_RECEIPT = 'PARTNERSHIP_RECEIPT',
  IN_KIND_RECEIPT = 'IN_KIND_RECEIPT',
  RETURNED_BOUNCED_RECEIPT_INDIVIDUAL = 'RETURN_RECEIPT',
  EARMARK_RECEIPT = 'EARMARK_RECEIPT',
  CONDUIT_EARMARK_RECEIPT = 'CONDUIT_EARMARK_RECEIPT',
  CONDUIT_EARMARK_RECEIPT_DEPOSITED = 'CONDUIT_EARMARK_RECEIPT_DEPOSITED',
  CONDUIT_EARMARK_RECEIPT_UNDEPOSITED = 'CONDUIT_EARMARK_RECEIPT_UNDEPOSITED',
  RECEIPT_FROM_UNREGISTERED_ENTITY = 'RECEIPT_FROM_UNREGISTERED_ENTITY',
  RECEIPT_FROM_UNREGISTERED_ENTITY_RETURN = 'RECEIPT_FROM_UNREGISTERED_ENTITY_RETURN',
  // Contributions from Registered Filers
  PARTY_RECEIPT = 'PARTY_RECEIPT',
  PARTY_IN_KIND_RECEIPT = 'PARTY_IN_KIND_RECEIPT',
  PARTY_RETURN = 'PARTY_RETURN',
  PAC_RECEIPT = 'PAC_RECEIPT',
  PAC_IN_KIND_RECEIPT = 'PAC_IN_KIND_RECEIPT',
  PAC_EARMARK_RECEIPT = 'PAC_EARMARK_RECEIPT',
  PAC_CONDUIT_EARMARK = 'PAC_CONDUIT_EARMARK',
  PAC_CONDUIT_EARMARK_RECEIPT_DEPOSITED = 'PAC_CONDUIT_EARMARK_RECEIPT_DEPOSITED',
  PAC_CONDUIT_EARMARK_RECEIPT_UNDEPOSITED = 'PAC_CONDUIT_EARMARK_RECEIPT_UNDEPOSITED',
  PAC_RETURN = 'PAC_RETURN',
  // Transfers
  TRANSFER = 'TRANSFER',
  JOINT_FUNDRAISING_TRANSFER = 'JOINT_FUNDRAISING_TRANSFER',
  IN_KIND_TRANSFER = 'IN_KIND_TRANSFER',
  IN_KIND_TRANSFER_FEDERAL_ELECTION_ACTIVITY = 'IN_KIND_TRANSFER_FEDERAL_ELECTION_ACTIVITY',
  JF_TRANSFER_NATIONAL_PARTY_CONVENTION_ACCOUNT = 'JF_TRANSFER_NATIONAL_PARTY_CONVENTION_ACCOUNT',
  JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT = 'JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT',
  JF_TRANSFER_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT = 'JF_TRANSFER_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT',
  // Refunds
  REFUND_TO_FEDERAL_CANDIDATE = 'REFUND_TO_FEDERAL_CANDIDATE',
  REFUND_TO_OTHER_POLITICAL_COMMITTEE = 'REFUND_TO_OTHER_POLITICAL_COMMITTEE',
  REFUND_TO_UNREGISTERED_COMMITTEE = 'REFUND_TO_UNREGISTERED_COMMITTEE',
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
  PARTY_NATIONAL_PARTY_RECOUNT_ACCOUNT = 'PARTY_NATIONAL_PARTY_RECOUNT_ACCOUNT',
  INDIVIDUAL_NATIONAL_PARTY_RECOUNT_ACCOUNT = 'INDIVIDUAL_NATIONAL_PARTY_RECOUNT_ACCOUNT',
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
  EARMARK_RECEIPT_FOR_RECOUNT_ACCOUNT_CONTRIBUTION = 'EARMARK_RECEIPT_RECOUNT_ACCOUNT',
  EARMARK_RECEIPT_FOR_CONVENTION_ACCOUNT_CONTRIBUTION = 'EARMARK_RECEIPT_CONVENTION_ACCOUNT',
  EARMARK_RECEIPT_FOR_HEADQUARTERS_ACCOUNT_CONTRIBUTION = 'EARMARK_RECEIPT_HEADQUARTERS_ACCOUNT',
  PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT = 'PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT',
  PARTNERSHIP_NATIONAL_PARTY_CONVENTION_ACCOUNT = 'PARTNERSHIP_NATIONAL_PARTY_CONVENTION_ACCOUNT',
  PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT = 'PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT',
  PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT = 'PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT',
  // Child transactiion types
  PAC_EARMARK_MEMO = 'PAC_EARMARK_MEMO',
  EARMARK_MEMO = 'EARMARK_MEMO',
  PAC_JF_TRANSFER_MEMO = 'PAC_JF_TRANSFER_MEMO',
  INDIVIDUAL_JF_TRANSFER_MEMO = 'INDIVIDUAL_JF_TRANSFER_MEMO',
  PARTY_JF_TRANSFER_MEMO = 'PARTY_JF_TRANSFER_MEMO',
  TRIBAL_JF_TRANSFER_MEMO = 'TRIBAL_JF_TRANSFER_MEMO',
  PARTNERSHIP_JF_TRANSFER_MEMO = 'PARTNERSHIP_JF_TRANSFER_MEMO',
  PARTNERSHIP_ATTRIBUTION_JF_TRANSFER_MEMO = 'PARTNERSHIP_ATTRIBUTION_JF_TRANSFER_MEMO',
  PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO = 'PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO',
  INDIVIDUAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO = 'INDIVIDUAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO',
  PAC_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO = 'PAC_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO',
  TRIBAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO = 'TRIBAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO',
  INDIVIDUAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO = 'INDIVIDUAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO',
  PAC_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO = 'PAC_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO',
  TRIBAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO = 'TRIBAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO',
  INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO = 'INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO',
  PAC_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO = 'PAC_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO',
  TRIBAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO = 'TRIBAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO',
  PARTNERSHIP_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO = 'PARTNERSHIP_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO',
  PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO = 'PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO',
  PARTNERSHIP_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO = 'PARTNERSHIP_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO',
  PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_RECOUNT_ACCOUNT_MEMO = 'PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_RECOUNT_ACCOUNT_MEMO',
  PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_CONVENTION_ACCOUNT_MEMO = 'PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_CONVENTION_ACCOUNT_MEMO',
  PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT_MEMO = 'PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT_MEMO',
  PARTNERSHIP_ATTRIBUTION = 'PARTNERSHIP_ATTRIBUTION',
  PARTNERSHIP_ATTRIBUTION_RECOUNT_ACCOUNT_RECEIPT_MEMO = 'PARTNERSHIP_ATTRIBUTION_RECOUNT_ACCOUNT_RECEIPT_MEMO',
  EARMARK_MEMO_HEADQUARTERS_ACCOUNT = 'EARMARK_MEMO_HEADQUARTERS_ACCOUNT',
  EARMARK_MEMO_CONVENTION_ACCOUNT = 'EARMARK_MEMO_CONVENTION_ACCOUNT',
  EARMARK_MEMO_RECOUNT_ACCOUNT = 'EARMARK_MEMO_RECOUNT_ACCOUNT',
  PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO = 'PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO',
  PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO = 'PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO',
  LOAN_RECEIVED_FROM_INDIVIDUAL_RECEIPT = 'LOAN_RECEIVED_FROM_INDIVIDUAL_RECEIPT',
  LOAN_RECEIVED_FROM_BANK_RECEIPT = 'LOAN_RECEIVED_FROM_BANK_RECEIPT',
  LOAN_REPAYMENT_RECEIVED = 'LOAN_REPAYMENT_RECEIVED',
}

export const ScheduleATransactionTypeLabels: LabelList = [
  // Contributions from Individuals/Persons
  [ScheduleATransactionTypes.INDIVIDUAL_RECEIPT, 'Individual Receipt'],
  [ScheduleATransactionTypes.TRIBAL_RECEIPT, 'Tribal Receipt'],
  [ScheduleATransactionTypes.PARTNERSHIP_RECEIPT, 'Partnership Receipt'],
  [ScheduleATransactionTypes.IN_KIND_RECEIPT, 'In-kind Receipt'],
  [ScheduleATransactionTypes.RETURNED_BOUNCED_RECEIPT_INDIVIDUAL, 'Returned/Bounced Receipt'],
  [ScheduleATransactionTypes.EARMARK_RECEIPT, 'Earmark Receipt'],
  [ScheduleATransactionTypes.EARMARK_MEMO, 'Earmark Memo'],
  [ScheduleATransactionTypes.CONDUIT_EARMARK_RECEIPT, 'Conduit Earmark Receipt'],
  [ScheduleATransactionTypes.CONDUIT_EARMARK_RECEIPT_DEPOSITED, 'Conduit Earmark (Deposited)'],
  [ScheduleATransactionTypes.CONDUIT_EARMARK_RECEIPT_UNDEPOSITED, 'Conduit Earmark (Undeposited)'],
  [ScheduleATransactionTypes.RECEIPT_FROM_UNREGISTERED_ENTITY, 'Receipt from Unregistered Entity'],
  [
    ScheduleATransactionTypes.RECEIPT_FROM_UNREGISTERED_ENTITY_RETURN,
    'Receipt from Unregistered Entity - Returned/Bounced Receipt',
  ],
  // Contributions from Registered Filers
  [ScheduleATransactionTypes.PARTY_RECEIPT, 'Party Receipt'],
  [ScheduleATransactionTypes.PARTY_IN_KIND_RECEIPT, 'Party In-kind Receipt'],
  [ScheduleATransactionTypes.PARTY_RETURN, 'Party Returned/Bounced Receipt'],
  [ScheduleATransactionTypes.PAC_RECEIPT, 'PAC Receipt'],
  [ScheduleATransactionTypes.PAC_IN_KIND_RECEIPT, 'PAC In-kind Receipt'],
  [ScheduleATransactionTypes.PAC_EARMARK_RECEIPT, 'PAC Earmark Receipt'],
  [ScheduleATransactionTypes.PAC_EARMARK_MEMO, 'PAC Earmark Memo'],
  [ScheduleATransactionTypes.PAC_CONDUIT_EARMARK, 'PAC Conduit Earmark'],
  [ScheduleATransactionTypes.PAC_CONDUIT_EARMARK_RECEIPT_DEPOSITED, 'PAC Conduit Earmark (Deposited)'],
  [ScheduleATransactionTypes.PAC_CONDUIT_EARMARK_RECEIPT_UNDEPOSITED, 'PAC Conduit Earmark (Undeposited)'],
  [ScheduleATransactionTypes.PAC_RETURN, 'PAC Returned/Bounced Receipt'],
  // Transfers
  [ScheduleATransactionTypes.TRANSFER, 'Transfer'],
  [ScheduleATransactionTypes.JOINT_FUNDRAISING_TRANSFER, 'Joint Fundraising Transfer'],
  [ScheduleATransactionTypes.INDIVIDUAL_JF_TRANSFER_MEMO, 'Individual Joint Fundraising Transfer Memo'],
  [ScheduleATransactionTypes.PAC_JF_TRANSFER_MEMO, 'PAC Joint Fundraising Transfer Memo'],
  [ScheduleATransactionTypes.PARTY_JF_TRANSFER_MEMO, 'Party Joint Fundraising Transfer Memo'],
  [ScheduleATransactionTypes.TRIBAL_JF_TRANSFER_MEMO, 'Tribal Joint Fundraising Transfer Memo'],
  [ScheduleATransactionTypes.IN_KIND_TRANSFER, 'In-kind Transfer'],
  [
    ScheduleATransactionTypes.IN_KIND_TRANSFER_FEDERAL_ELECTION_ACTIVITY,
    'In-kind Transfer - Federal Election Activity',
  ],
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
  [ScheduleATransactionTypes.REFUND_TO_FEDERAL_CANDIDATE, 'Refund of Contribution to Federal Candidate'],
  [
    ScheduleATransactionTypes.REFUND_TO_OTHER_POLITICAL_COMMITTEE,
    'Refund of Contribution to Other Political Committee',
  ],
  [ScheduleATransactionTypes.REFUND_TO_UNREGISTERED_COMMITTEE, 'Refund of Contribution to Unregistered Committee'],
  // Other
  [ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES, 'Offsets to Operating Expenditures'],
  [ScheduleATransactionTypes.OTHER_RECEIPTS, 'Other Receipts'],
  [
    ScheduleATransactionTypes.INDIVIDUAL_RECEIPT_NON_CONTRIBUTION_ACCOUNT,
    'Individual Receipt - Non-contribution Account',
  ],
  [
    ScheduleATransactionTypes.OTHER_COMMITTEE_RECEIPT_NON_CONTRIBUTION_ACCOUNT,
    'Other Committee Receipt - Non-contribution Account',
  ],
  [
    ScheduleATransactionTypes.BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT,
    'Business/Labor Organization Receipt - Non-contribution Account',
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
    'Earmark Receipt for Recount/Legal Proceedings Account (Contribution)',
  ],
  [
    ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_CONVENTION_ACCOUNT_CONTRIBUTION,
    'Earmark Receipt for Pres. Nominating Convention Account (Contribution)',
  ],
  [
    ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_HEADQUARTERS_ACCOUNT_CONTRIBUTION,
    'Earmark Receipt for Headquarters Buildings Account (Contribution)',
  ],
  [
    ScheduleATransactionTypes.EARMARK_MEMO_RECOUNT_ACCOUNT,
    'Earmark Memo for Recount/Legal Proceedings Account (Contribution)',
  ],
  [
    ScheduleATransactionTypes.EARMARK_MEMO_CONVENTION_ACCOUNT,
    'Earmark Memo for Pres. Nominating Convention Account (Contribution)',
  ],
  [
    ScheduleATransactionTypes.EARMARK_MEMO_HEADQUARTERS_ACCOUNT,
    'Earmark Memo for Headquarters Buildings Account (Contribution)',
  ],
  [
    ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT,
    'Partnership National Party Recount/Legal Proceedings Account',
  ],
  [ScheduleATransactionTypes.PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT, 'Partnership Recount Account Receipt'],
  [
    ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    'Partnership National Party Headquarters Buildings Account',
  ],
  [
    ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_CONVENTION_ACCOUNT,
    'Partnership National Party Pres. Nominating Convention Account',
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
  [
    ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO,
    'Partnership Receipt Recount/Legal Proceedings Account JF Transfer Memo',
  ],
  [
    ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO,
    'Partnership National Party Pres. Nominating Convention Proceedings Account Memo',
  ],
  [
    ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_RECOUNT_ACCOUNT_MEMO,
    'Partnership Attribution National Party Recount/Legal Proceedings Account Memo',
  ],
  [
    ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_CONVENTION_ACCOUNT_MEMO,
    'Partnership Attribution National Party Pres. Nominating Convention Account Memo',
  ],
  [
    ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT_MEMO,
    'Partnership Attribution National Party Headquarters Buildings Account Memo',
  ],
  [ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION, 'Partnership Attribution'],
  [ScheduleATransactionTypes.PARTNERSHIP_JF_TRANSFER_MEMO, 'Partnership Receipt Joint Fundraising Transfer Memo'],
  [
    ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_JF_TRANSFER_MEMO,
    'Partnership Attribution Joint Fundraising Transfer Memo',
  ],
  [
    ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO,
    'Partnership Attribution Pres. Nominating Convention Account JF Transfer Memo',
  ],
  [
    ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_RECOUNT_ACCOUNT_RECEIPT_MEMO,
    'Partnership Attribution Recount Account Receipt Memo',
  ],
  [
    ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO,
    'Partnership Attribution Recount/Legal Proceedings Account JF Transfer Memo',
  ],
  [
    ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO,
    'Partnership Attribution Headquarters Buildings Account JF Transfer Memo',
  ],
  [ScheduleATransactionTypes.LOAN_RECEIVED_FROM_INDIVIDUAL_RECEIPT, 'Loan Received from Individual'],
  [ScheduleATransactionTypes.LOAN_RECEIVED_FROM_BANK_RECEIPT, 'Loan Received from Bank'],
  [ScheduleATransactionTypes.LOAN_REPAYMENT_RECEIVED, 'Loan Repayment Received'],
];

export const UnimplementedTypeEntityCategories: LabelList = [
  [ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO, 'Partnership'],
  [ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO, 'Partnership'],
];
