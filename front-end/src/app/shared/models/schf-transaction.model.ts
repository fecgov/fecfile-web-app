import { plainToInstance, Transform } from 'class-transformer';
import { AggregationGroups, Transaction } from './transaction.model';
import { LabelList } from '../utils/label.utils';
import { BaseModel } from './base.model';
import { getFromJSON, TransactionTypeUtils } from '../utils/transaction-type.utils';

export class SchFTransaction extends Transaction {
  coordinated_expenditures: boolean | undefined;
  designated_committee_id_number: string | undefined;
  designating_committee_name: string | undefined;
  subordinate_committee_id_number: string | undefined;
  subordinate_committee_name: string | undefined;
  subordinate_street_1: string | undefined;
  subordinate_street_2: string | undefined;
  subordinate_city: string | undefined;
  subordinate_state: string | undefined;
  subordinate_zip: string | undefined;
  entity_type: string | undefined;
  payee_organization_name: string | undefined;
  payee_last_name: string | undefined;
  payee_first_name: string | undefined;
  payee_middle_name: string | undefined;
  payee_prefix: string | undefined;
  payee_suffix: string | undefined;
  payee_street_1: string | undefined;
  payee_street_2: string | undefined;
  payee_city: string | undefined;
  payee_state: string | undefined;
  payee_zip: string | undefined;
  @Transform(BaseModel.dateTransform) expenditure_date: Date | undefined;
  expenditure_amount: number | undefined;
  aggregate_general_elect_expended: number | undefined;
  expenditure_purpose_description: string | undefined;
  category_code: string | undefined;
  payee_committee_id_number: string | undefined;
  payee_candidate_id_number: string | undefined;
  payee_candidate_last_name: string | undefined;
  payee_candidate_first_name: string | undefined;
  payee_candidate_middle_name: string | undefined;
  payee_candidate_prefix: string | undefined;
  payee_candidate_suffix: string | undefined;
  payee_candidate_office: string | undefined;
  payee_candidate_state: string | undefined;
  payee_candidate_district: string | undefined;
  memo_code: boolean | undefined;
  memo_text_description: string | undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: any, depth = 2): SchFTransaction {
    let transaction = plainToInstance(SchFTransaction, json);
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
    return transaction;
  }

  override getFieldsNotToValidate(): string[] {
    return ['back_reference_tran_id_number', 'back_reference_sched_name', ...super.getFieldsNotToValidate()];
  }
}

export enum ScheduleFTransactionGroups {
  CONTRIBUTIONS_FROM_INDIVIDUALS_PERSONS = 'CONTRIBUTIONS FROM INDIVIDUALS/PERSONS',
  CONTRIBUTIONS_FROM_REGISTERED_FILERS = 'CONTRIBUTIONS FROM REGISTERED FILERS',
  TRANSFERS = 'TRANSFERS',
  REFUNDS = 'REFUNDS',
  OTHER = 'OTHER',
}

export type ScheduleFTransactionGroupsType =
  | ScheduleFTransactionGroups.CONTRIBUTIONS_FROM_INDIVIDUALS_PERSONS
  | ScheduleFTransactionGroups.CONTRIBUTIONS_FROM_REGISTERED_FILERS
  | ScheduleFTransactionGroups.TRANSFERS
  | ScheduleFTransactionGroups.REFUNDS
  | ScheduleFTransactionGroups.OTHER;

export enum ScheduleFTransactionTypes {
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

export const ScheduleFTransactionTypeLabels: LabelList = [
  // Contributions from Individuals/Persons
  [ScheduleFTransactionTypes.INDIVIDUAL_RECEIPT, 'Individual Receipt'],
  [ScheduleFTransactionTypes.TRIBAL_RECEIPT, 'Tribal Receipt'],
  [ScheduleFTransactionTypes.PARTNERSHIP_RECEIPT, 'Partnership Receipt'],
  [ScheduleFTransactionTypes.IN_KIND_RECEIPT, 'In-kind Receipt'],
  [ScheduleFTransactionTypes.RETURNED_BOUNCED_RECEIPT_INDIVIDUAL, 'Returned/Bounced Receipt'],
  [ScheduleFTransactionTypes.EARMARK_RECEIPT, 'Earmark Receipt'],
  [ScheduleFTransactionTypes.EARMARK_MEMO, 'Earmark Memo'],
  [ScheduleFTransactionTypes.CONDUIT_EARMARK_RECEIPT, 'Conduit Earmark Receipt'],
  [ScheduleFTransactionTypes.CONDUIT_EARMARK_RECEIPT_DEPOSITED, 'Conduit Earmark (Deposited)'],
  [ScheduleFTransactionTypes.CONDUIT_EARMARK_RECEIPT_UNDEPOSITED, 'Conduit Earmark (Undeposited)'],
  [ScheduleFTransactionTypes.RECEIPT_FROM_UNREGISTERED_ENTITY, 'Receipt from Unregistered Entity'],
  [
    ScheduleFTransactionTypes.RECEIPT_FROM_UNREGISTERED_ENTITY_RETURN,
    'Receipt from Unregistered Entity - Returned/Bounced Receipt',
  ],
  // Contributions from Registered Filers
  [ScheduleFTransactionTypes.PARTY_RECEIPT, 'Party Receipt'],
  [ScheduleFTransactionTypes.PARTY_IN_KIND_RECEIPT, 'Party In-kind Receipt'],
  [ScheduleFTransactionTypes.PARTY_RETURN, 'Party Returned/Bounced Receipt'],
  [ScheduleFTransactionTypes.PAC_RECEIPT, 'PAC Receipt'],
  [ScheduleFTransactionTypes.PAC_IN_KIND_RECEIPT, 'PAC In-kind Receipt'],
  [ScheduleFTransactionTypes.PAC_EARMARK_RECEIPT, 'PAC Earmark Receipt'],
  [ScheduleFTransactionTypes.PAC_EARMARK_MEMO, 'PAC Earmark Memo'],
  [ScheduleFTransactionTypes.PAC_CONDUIT_EARMARK, 'PAC Conduit Earmark'],
  [ScheduleFTransactionTypes.PAC_CONDUIT_EARMARK_RECEIPT_DEPOSITED, 'PAC Conduit Earmark (Deposited)'],
  [ScheduleFTransactionTypes.PAC_CONDUIT_EARMARK_RECEIPT_UNDEPOSITED, 'PAC Conduit Earmark (Undeposited)'],
  [ScheduleFTransactionTypes.PAC_RETURN, 'PAC Returned/Bounced Receipt'],
  // Transfers
  [ScheduleFTransactionTypes.TRANSFER, 'Transfer'],
  [ScheduleFTransactionTypes.JOINT_FUNDRAISING_TRANSFER, 'Joint Fundraising Transfer'],
  [ScheduleFTransactionTypes.INDIVIDUAL_JF_TRANSFER_MEMO, 'Individual Joint Fundraising Transfer Memo'],
  [ScheduleFTransactionTypes.PAC_JF_TRANSFER_MEMO, 'PAC Joint Fundraising Transfer Memo'],
  [ScheduleFTransactionTypes.PARTY_JF_TRANSFER_MEMO, 'Party Joint Fundraising Transfer Memo'],
  [ScheduleFTransactionTypes.TRIBAL_JF_TRANSFER_MEMO, 'Tribal Joint Fundraising Transfer Memo'],
  [ScheduleFTransactionTypes.IN_KIND_TRANSFER, 'In-kind Transfer'],
  [
    ScheduleFTransactionTypes.IN_KIND_TRANSFER_FEDERAL_ELECTION_ACTIVITY,
    'In-kind Transfer - Federal Election Activity',
  ],
  [
    ScheduleFTransactionTypes.JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT,
    'Joint Fundraising Transfer - National Party Recount/Legal Proceedings Account',
  ],
  [
    ScheduleFTransactionTypes.JF_TRANSFER_NATIONAL_PARTY_CONVENTION_ACCOUNT,
    'Joint Fundraising Transfer - National Party Pres. Nominating Convention Account',
  ],
  [
    ScheduleFTransactionTypes.JF_TRANSFER_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    'Joint Fundraising Transfer - National Party Headquarters Buildings Account',
  ],
  [
    ScheduleFTransactionTypes.INDIVIDUAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO,
    'Individual National Party Pres. Nominating Convention Account JF Transfer Memo',
  ],
  [
    ScheduleFTransactionTypes.PAC_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO,
    'PAC National Party Pres. Nominating Convention Account JF Transfer Memo',
  ],
  [
    ScheduleFTransactionTypes.TRIBAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO,
    'Tribal National Party Pres. Nominating Convention Account JF Transfer Memo',
  ],
  [
    ScheduleFTransactionTypes.PARTNERSHIP_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO,
    'Partnership Receipt Pres. Nominating Convention Account JF Transfer Memo',
  ],
  // Refunds
  [ScheduleFTransactionTypes.REFUND_TO_FEDERAL_CANDIDATE, 'Refund of Contribution to Federal Candidate'],
  [
    ScheduleFTransactionTypes.REFUND_TO_OTHER_POLITICAL_COMMITTEE,
    'Refund of Contribution to Other Political Committee',
  ],
  [ScheduleFTransactionTypes.REFUND_TO_UNREGISTERED_COMMITTEE, 'Refund of Contribution to Unregistered Committee'],
  // Other
  [ScheduleFTransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES, 'Offsets to Operating Expenditures'],
  [ScheduleFTransactionTypes.OTHER_RECEIPTS, 'Other Receipts'],
  [
    ScheduleFTransactionTypes.INDIVIDUAL_RECEIPT_NON_CONTRIBUTION_ACCOUNT,
    'Individual Receipt - Non-contribution Account',
  ],
  [
    ScheduleFTransactionTypes.OTHER_COMMITTEE_RECEIPT_NON_CONTRIBUTION_ACCOUNT,
    'Other Committee Receipt - Non-contribution Account',
  ],
  [
    ScheduleFTransactionTypes.BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT,
    'Business/Labor Organization Receipt - Non-contribution Account',
  ],
  [ScheduleFTransactionTypes.INDIVIDUAL_RECOUNT_RECEIPT, 'Individual Recount Receipt'],
  [ScheduleFTransactionTypes.PARTY_RECOUNT_RECEIPT, 'Party Recount Receipt'],
  [ScheduleFTransactionTypes.PAC_RECOUNT_RECEIPT, 'PAC Recount Receipt'],
  [ScheduleFTransactionTypes.TRIBAL_RECOUNT_RECEIPT, 'Tribal Recount Receipt'],
  [
    ScheduleFTransactionTypes.INDIVIDUAL_NATIONAL_PARTY_RECOUNT_ACCOUNT,
    'Individual National Party Recount/Legal Proceedings Account',
  ],
  [
    ScheduleFTransactionTypes.PARTY_NATIONAL_PARTY_RECOUNT_ACCOUNT,
    'Party National Party Recount/Legal Proceedings Account',
  ],
  [
    ScheduleFTransactionTypes.PAC_NATIONAL_PARTY_RECOUNT_ACCOUNT,
    'PAC National Party Recount/Legal Proceedings Account',
  ],
  [
    ScheduleFTransactionTypes.TRIBAL_NATIONAL_PARTY_RECOUNT_ACCOUNT,
    'Tribal National Party Recount/Legal Proceedings Account',
  ],
  [
    ScheduleFTransactionTypes.INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    'Individual National Party Headquarters Buildings Account',
  ],
  [
    ScheduleFTransactionTypes.PARTY_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    'Party National Party Headquarters Buildings Account',
  ],
  [
    ScheduleFTransactionTypes.PAC_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    'PAC National Party Headquarters Buildings Account',
  ],
  [
    ScheduleFTransactionTypes.TRIBAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    'Tribal National Party Headquarters Buildings Account',
  ],
  [
    ScheduleFTransactionTypes.INDIVIDUAL_NATIONAL_PARTY_CONVENTION_ACCOUNT,
    'Individual National Party Pres. Nominating Convention Account',
  ],
  [
    ScheduleFTransactionTypes.PARTY_NATIONAL_PARTY_CONVENTION_ACCOUNT,
    'Party National Party Pres. Nominating Convention Account',
  ],
  [
    ScheduleFTransactionTypes.PAC_NATIONAL_PARTY_CONVENTION_ACCOUNT,
    'PAC National Party Pres. Nominating Convention Account',
  ],
  [
    ScheduleFTransactionTypes.TRIBAL_NATIONAL_PARTY_CONVENTION_ACCOUNT,
    'Tribal National Party Pres. Nominating Convention Account',
  ],
  [
    ScheduleFTransactionTypes.EARMARK_RECEIPT_FOR_RECOUNT_ACCOUNT_CONTRIBUTION,
    'Earmark Receipt for Recount/Legal Proceedings Account (Contribution)',
  ],
  [
    ScheduleFTransactionTypes.EARMARK_RECEIPT_FOR_CONVENTION_ACCOUNT_CONTRIBUTION,
    'Earmark Receipt for Pres. Nominating Convention Account (Contribution)',
  ],
  [
    ScheduleFTransactionTypes.EARMARK_RECEIPT_FOR_HEADQUARTERS_ACCOUNT_CONTRIBUTION,
    'Earmark Receipt for Headquarters Buildings Account (Contribution)',
  ],
  [
    ScheduleFTransactionTypes.EARMARK_MEMO_RECOUNT_ACCOUNT,
    'Earmark Memo for Recount/Legal Proceedings Account (Contribution)',
  ],
  [
    ScheduleFTransactionTypes.EARMARK_MEMO_CONVENTION_ACCOUNT,
    'Earmark Memo for Pres. Nominating Convention Account (Contribution)',
  ],
  [
    ScheduleFTransactionTypes.EARMARK_MEMO_HEADQUARTERS_ACCOUNT,
    'Earmark Memo for Headquarters Buildings Account (Contribution)',
  ],
  [
    ScheduleFTransactionTypes.PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT,
    'Partnership National Party Recount/Legal Proceedings Account',
  ],
  [ScheduleFTransactionTypes.PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT, 'Partnership Recount Account Receipt'],
  [
    ScheduleFTransactionTypes.PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    'Partnership National Party Headquarters Buildings Account',
  ],
  [
    ScheduleFTransactionTypes.PARTNERSHIP_NATIONAL_PARTY_CONVENTION_ACCOUNT,
    'Partnership National Party Pres. Nominating Convention Account',
  ],
  [
    ScheduleFTransactionTypes.INDIVIDUAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO,
    'Individual National Party Recount/Legal Proceedings Account JF Transfer Memo',
  ],
  [
    ScheduleFTransactionTypes.PAC_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO,
    'PAC National Party Recount/Legal Proceedings Account JF Transfer Memo',
  ],
  [
    ScheduleFTransactionTypes.TRIBAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO,
    'Tribal National Party Recount/Legal Proceedings Account JF Transfer Memo',
  ],
  [
    ScheduleFTransactionTypes.INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO,
    'Individual National Party Headquarters Buildings Account JF Transfer Memo',
  ],
  [
    ScheduleFTransactionTypes.PAC_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO,
    'PAC National Party Headquarters Buildings Account JF Transfer Memo',
  ],
  [
    ScheduleFTransactionTypes.TRIBAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO,
    'Tribal National Party Headquarters Buildings Account JF Transfer Memo',
  ],
  [
    ScheduleFTransactionTypes.PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO,
    'Partnership Receipt Headquarters Buildings Account JF Transfer Memo',
  ],
  [
    ScheduleFTransactionTypes.PARTNERSHIP_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO,
    'Partnership Receipt Recount/Legal Proceedings Account JF Transfer Memo',
  ],
  [
    ScheduleFTransactionTypes.PARTNERSHIP_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO,
    'Partnership National Party Pres. Nominating Convention Proceedings Account Memo',
  ],
  [
    ScheduleFTransactionTypes.PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_RECOUNT_ACCOUNT_MEMO,
    'Partnership Attribution National Party Recount/Legal Proceedings Account Memo',
  ],
  [
    ScheduleFTransactionTypes.PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_CONVENTION_ACCOUNT_MEMO,
    'Partnership Attribution National Party Pres. Nominating Convention Account Memo',
  ],
  [
    ScheduleFTransactionTypes.PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT_MEMO,
    'Partnership Attribution National Party Headquarters Buildings Account Memo',
  ],
  [ScheduleFTransactionTypes.PARTNERSHIP_ATTRIBUTION, 'Partnership Attribution'],
  [ScheduleFTransactionTypes.PARTNERSHIP_JF_TRANSFER_MEMO, 'Partnership Receipt Joint Fundraising Transfer Memo'],
  [
    ScheduleFTransactionTypes.PARTNERSHIP_ATTRIBUTION_JF_TRANSFER_MEMO,
    'Partnership Attribution Joint Fundraising Transfer Memo',
  ],
  [
    ScheduleFTransactionTypes.PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO,
    'Partnership Attribution Pres. Nominating Convention Account JF Transfer Memo',
  ],
  [
    ScheduleFTransactionTypes.PARTNERSHIP_ATTRIBUTION_RECOUNT_ACCOUNT_RECEIPT_MEMO,
    'Partnership Attribution Recount Account Receipt Memo',
  ],
  [
    ScheduleFTransactionTypes.PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO,
    'Partnership Attribution Recount/Legal Proceedings Account JF Transfer Memo',
  ],
  [
    ScheduleFTransactionTypes.PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO,
    'Partnership Attribution Headquarters Buildings Account JF Transfer Memo',
  ],
  [ScheduleFTransactionTypes.LOAN_RECEIVED_FROM_INDIVIDUAL_RECEIPT, 'Loan Received from Individual'],
  [ScheduleFTransactionTypes.LOAN_RECEIVED_FROM_BANK_RECEIPT, 'Loan Received from Bank'],
  [ScheduleFTransactionTypes.LOAN_REPAYMENT_RECEIVED, 'Loan Repayment Received'],
];

export const UnimplementedTypeEntityCategories: LabelList = [
  [ScheduleFTransactionTypes.PARTNERSHIP_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO, 'Partnership'],
  [ScheduleFTransactionTypes.PARTNERSHIP_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO, 'Partnership'],
];
