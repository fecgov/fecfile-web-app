import { MemoText } from '../models/memo-text.model';
import { ScheduleATransactionTypes } from '../models/scha-transaction.model';
import { ScheduleBTransactionTypes } from '../models/schb-transaction.model';
import { ScheduleETransactionTypes } from '../models/sche-transaction.model';
import { ScheduleFTransactionTypes } from '../models/schf-transaction.model';
import { cloneInstance, ScheduleTransaction, Transaction, TransactionTypes } from '../models/transaction.model';
import { TransactionTypeUtils } from './transaction-type.utils';

export type CloneEligibilityTransaction = {
  transaction_type_identifier: string | undefined;
  parent_transaction_id?: string;
  loan_id?: string;
  debt_id?: string;
  reatt_redes_id?: string;
  reattribution_redesignation_tag?: string;
};

type CloneMemoResetMode = 'always' | 'whenMemoTextPresent';

type ResetCloneMemoTextOptions = {
  rebuildFromJson?: boolean;
  resetMemoTextId?: CloneMemoResetMode;
};

/**
 * Reset baseline fields that both clone workflows clear.
 */
export function resetCloneCoreFields(clone: Transaction, forceUnaggregated: boolean | undefined): void {
  clone.id = undefined;
  clone.reports = undefined;
  clone.force_unaggregated = forceUnaggregated;
  clone.children = [];
}

/**
 * Reset memo text identifiers and optional report binding on a cloned transaction.
 */
export function resetCloneMemoText(
  clone: Transaction,
  reportId: string | undefined,
  options: ResetCloneMemoTextOptions = {},
): void {
  const { rebuildFromJson = true, resetMemoTextId = 'always' } = options;

  if (!clone.memo_text) {
    if (resetMemoTextId === 'always') {
      clone.memo_text_id = undefined;
    }
    return;
  }

  if (rebuildFromJson) {
    clone.memo_text = MemoText.fromJSON(clone.memo_text.toJson());
  }

  clone.memo_text.id = undefined;
  clone.memo_text.report_id = reportId;
  clone.memo_text.transaction_id_number = undefined;
  clone.memo_text.transaction_uuid = undefined;
  clone.memo_text_id = undefined;
}

let cloneableTransactionTypes: Set<TransactionTypes> | undefined;

function getCloneableTransactionTypes(): Set<TransactionTypes> {
  if (cloneableTransactionTypes) {
    return cloneableTransactionTypes;
  }

  cloneableTransactionTypes = new Set<TransactionTypes>([
    ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
    ScheduleATransactionTypes.TRIBAL_RECEIPT,
    ScheduleATransactionTypes.RETURNED_BOUNCED_RECEIPT_INDIVIDUAL,
    ScheduleATransactionTypes.RECEIPT_FROM_UNREGISTERED_ORGANIZATION,
    ScheduleATransactionTypes.RECEIPT_FROM_UNREGISTERED_ORGANIZATION_RETURN,
    ScheduleATransactionTypes.PARTY_RECEIPT,
    ScheduleATransactionTypes.PARTY_RETURN,
    ScheduleATransactionTypes.PAC_RECEIPT,
    ScheduleATransactionTypes.PAC_RETURN,
    ScheduleATransactionTypes.CONTRIBUTION_FROM_CANDIDATE,
    ScheduleATransactionTypes.TRANSFER,
    ScheduleATransactionTypes.REFUND_TO_FEDERAL_CANDIDATE,
    ScheduleATransactionTypes.REFUND_TO_OTHER_POLITICAL_COMMITTEE,
    ScheduleATransactionTypes.REFUND_TO_UNREGISTERED_COMMITTEE,
    ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
    ScheduleATransactionTypes.OTHER_RECEIPTS,
    ScheduleATransactionTypes.INDIVIDUAL_RECEIPT_NON_CONTRIBUTION_ACCOUNT,
    ScheduleATransactionTypes.OTHER_COMMITTEE_RECEIPT_NON_CONTRIBUTION_ACCOUNT,
    ScheduleATransactionTypes.BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT,
    ScheduleATransactionTypes.INDIVIDUAL_RECOUNT_RECEIPT,
    ScheduleATransactionTypes.PARTY_RECOUNT_RECEIPT,
    ScheduleATransactionTypes.PAC_RECOUNT_RECEIPT,
    ScheduleATransactionTypes.TRIBAL_RECOUNT_RECEIPT,
    ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_RECOUNT_ACCOUNT,
    ScheduleATransactionTypes.PARTY_NATIONAL_PARTY_RECOUNT_ACCOUNT,
    ScheduleATransactionTypes.PAC_NATIONAL_PARTY_RECOUNT_ACCOUNT,
    ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_RECOUNT_ACCOUNT,
    ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    ScheduleATransactionTypes.PARTY_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    ScheduleATransactionTypes.PAC_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_CONVENTION_ACCOUNT,
    ScheduleATransactionTypes.PARTY_NATIONAL_PARTY_CONVENTION_ACCOUNT,
    ScheduleATransactionTypes.PAC_NATIONAL_PARTY_CONVENTION_ACCOUNT,
    ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_CONVENTION_ACCOUNT,
    ScheduleATransactionTypes.FEDERAL_COMMITTEE_RECOUNT_DONATION,
    ScheduleATransactionTypes.UNREGISTERED_RECOUNT_DONATION_FROM_ORGANIZATION,
    ScheduleBTransactionTypes.OPERATING_EXPENDITURE,
    ScheduleBTransactionTypes.OPERATING_EXPENDITURE_VOID,
    ScheduleBTransactionTypes.TRANSFER_TO_AFFILIATES,
    ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE,
    ScheduleBTransactionTypes.IN_KIND_CONTRIBUTION_TO_CANDIDATE,
    ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE_VOID,
    ScheduleBTransactionTypes.CONTRIBUTION_TO_OTHER_COMMITTEE,
    ScheduleBTransactionTypes.IN_KIND_CONTRIBUTION_TO_OTHER_COMMITTEE,
    ScheduleBTransactionTypes.CONTRIBUTION_TO_OTHER_COMMITTEE_VOID,
    ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE,
    ScheduleETransactionTypes.MULTISTATE_INDEPENDENT_EXPENDITURE,
    ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_VOID,
    ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE,
    ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE_VOID,
    ScheduleBTransactionTypes.OTHER_DISBURSEMENT,
    ScheduleBTransactionTypes.OTHER_DISBURSEMENT_VOID,
    ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_DISBURSEMENT,
    ScheduleBTransactionTypes.INDIVIDUAL_REFUND_NON_CONTRIBUTION_ACCOUNT,
    ScheduleBTransactionTypes.OTHER_COMMITTEE_REFUND_NON_CONTRIBUTION_ACCOUNT,
    ScheduleBTransactionTypes.BUSINESS_LABOR_REFUND_NON_CONTRIBUTION_ACCOUNT,
    ScheduleBTransactionTypes.RECOUNT_ACCOUNT_DISBURSEMENT,
    ScheduleBTransactionTypes.NATIONAL_PARTY_RECOUNT_ACCOUNT_DISBURSEMENT,
    ScheduleBTransactionTypes.NATIONAL_PARTY_HEADQUARTERS_ACCOUNT_DISBURSEMENT,
    ScheduleBTransactionTypes.NATIONAL_PARTY_CONVENTION_ACCOUNT_DISBURSEMENT,
    ScheduleBTransactionTypes.INDIVIDUAL_REFUND_NP_HEADQUARTERS_ACCOUNT,
    ScheduleBTransactionTypes.OTHER_COMMITTEE_REFUND_REFUND_NP_HEADQUARTERS_ACCOUNT,
    ScheduleBTransactionTypes.TRIBAL_REFUND_NP_HEADQUARTERS_ACCOUNT,
    ScheduleBTransactionTypes.INDIVIDUAL_REFUND_NP_CONVENTION_ACCOUNT,
    ScheduleBTransactionTypes.OTHER_COMMITTEE_REFUND_REFUND_NP_CONVENTION_ACCOUNT,
    ScheduleBTransactionTypes.TRIBAL_REFUND_NP_CONVENTION_ACCOUNT,
    ScheduleBTransactionTypes.INDIVIDUAL_REFUND_NP_RECOUNT_ACCOUNT,
    ScheduleBTransactionTypes.OTHER_COMMITTEE_REFUND_REFUND_NP_RECOUNT_ACCOUNT,
    ScheduleBTransactionTypes.TRIBAL_REFUND_NP_RECOUNT_ACCOUNT,
    ScheduleBTransactionTypes.REFUND_INDIVIDUAL_CONTRIBUTION,
    ScheduleBTransactionTypes.REFUND_INDIVIDUAL_CONTRIBUTION_VOID,
    ScheduleBTransactionTypes.REFUND_PARTY_CONTRIBUTION,
    ScheduleBTransactionTypes.REFUND_PARTY_CONTRIBUTION_VOID,
    ScheduleBTransactionTypes.REFUND_PAC_CONTRIBUTION,
    ScheduleBTransactionTypes.REFUND_PAC_CONTRIBUTION_VOID,
    ScheduleBTransactionTypes.REFUND_RECEIPT_FROM_UNREGISTERED_ORGANIZATION,
    ScheduleBTransactionTypes.REFUND_RECEIPT_FROM_UNREGISTERED_ORGANIZATION_VOID,
    ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_100PCT_PAYMENT,
    ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_VOID,
  ]);

  return cloneableTransactionTypes;
}

function isCloneableTransactionType(
  transactionTypeIdentifier: string | undefined,
): transactionTypeIdentifier is TransactionTypes {
  return (
    !!transactionTypeIdentifier && getCloneableTransactionTypes().has(transactionTypeIdentifier as TransactionTypes)
  );
}

export function isCloneable(transaction: CloneEligibilityTransaction | undefined): boolean {
  if (!transaction) return false;

  return (
    isCloneableTransactionType(transaction.transaction_type_identifier) &&
    !transaction.parent_transaction_id &&
    !transaction.loan_id &&
    !transaction.debt_id &&
    !transaction.reatt_redes_id &&
    !transaction.reattribution_redesignation_tag
  );
}

export function buildClonedTransaction(source: ScheduleTransaction, reportId: string): Transaction {
  if (!source.transaction_type_identifier) {
    throw new Error('FECfile+: Cannot clone a transaction without a transaction_type_identifier.');
  }
  if (!isCloneable(source)) {
    throw new Error(`FECfile+: This transaction (${source.transaction_type_identifier}) is not eligible for cloning.`);
  }

  const transactionType = TransactionTypeUtils.factory(source.transaction_type_identifier);
  const clone = transactionType.getNewTransaction();
  const sourceCopy = cloneInstance(source);

  if (sourceCopy) {
    Object.assign(clone, sourceCopy);
  }

  clone.transaction_id = undefined;
  clone.parent_transaction = undefined;
  clone.parent_transaction_id = undefined;
  clone.debt = undefined;
  clone.debt_id = undefined;
  clone.loan = undefined;
  clone.loan_id = undefined;
  clone.reatt_redes = undefined;
  clone.reatt_redes_id = undefined;
  clone.created = undefined;
  clone.updated = undefined;
  clone.deleted = undefined;
  clone.report_ids = [reportId];
  clone.itemized = undefined;
  clone.force_itemized = undefined;
  clone.line_label = undefined;
  clone.can_delete = undefined;
  clone.loan_agreement_id = undefined;
  clone.fields_to_validate = undefined;
  clone.schema_name = undefined;

  resetCloneCoreFields(clone, undefined);

  for (const field of clone.getFieldsNotToSave()) {
    (clone as unknown as Record<string, unknown>)[field] = undefined;
  }

  if ('transaction_id_number' in clone) {
    (clone as unknown as Record<string, unknown>)['transaction_id_number'] = undefined;
  }
  if ('reattribution_redesignation_tag' in clone) {
    (clone as unknown as Record<string, unknown>)['reattribution_redesignation_tag'] = undefined;
  }
  if ('reatt_redes_total' in clone) {
    (clone as unknown as Record<string, unknown>)['reatt_redes_total'] = undefined;
  }

  for (const derivedField of [
    'contribution_aggregate',
    'aggregate_amount',
    'calendar_ytd_per_election_office',
    'aggregate_general_elec_expended',
    'semi_annual_refunded_bundled_amt',
  ]) {
    if (derivedField in clone) {
      (clone as unknown as Record<string, unknown>)[derivedField] = undefined;
    }
  }

  resetCloneMemoText(clone, reportId);

  clone.setMetaProperties(transactionType);

  return clone;
}
