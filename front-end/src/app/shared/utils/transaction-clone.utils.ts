import { MemoText } from '../models/memo-text.model';
import type { ScheduleTransaction } from '../models/transaction/schedule-transaction.model';
import { cloneInstance } from '../models/transaction/transaction-model.utils';
import type { TransactionType } from '../models/transaction/transaction-type.model';
import type { Transaction } from '../models/transaction/transaction.model';

export type CloneEligibilityTransaction = {
  transactionType: TransactionType;
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

export function isCloneable(transaction: CloneEligibilityTransaction | undefined): boolean {
  return (
    !!transaction?.transactionType.isCloneableTransactionType &&
    !transaction.transactionType.dependentChildTransactionTypes?.length &&
    !transaction.parent_transaction_id &&
    !transaction.loan_id &&
    !transaction.debt_id &&
    !transaction.reatt_redes_id &&
    !transaction.reattribution_redesignation_tag
  );
}

export function buildClonedTransaction(source: ScheduleTransaction, reportId: string): Transaction {
  if (!isCloneable(source)) {
    throw new Error(`FECfile+: This transaction (${source.transaction_type_identifier}) is not eligible for cloning.`);
  }
  const clone = source.transactionType.getNewTransaction();
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

  clone.setMetaProperties(source.transactionType);

  return clone;
}
