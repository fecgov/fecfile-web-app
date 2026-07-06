import { FormGroup } from '@angular/forms';
import { cloneInstance, Transaction, TransactionTypes } from '../../models/transaction.model';
import { ContactTypes } from '../../models/contact.model';
import { SchATransaction, ScheduleATransactionTypes } from '../../models/scha-transaction.model';
import { SchBTransaction } from '../../models/schb-transaction.model';
import { ReattributionToUtils } from './reattribution-to.utils';
import { ReattributionFromUtils } from './reattribution-from.utils';
import { Subject } from 'rxjs';
import { RedesignationToUtils } from './redesignation-to.utils';
import { RedesignationFromUtils } from './redesignation-from.utils';
import { MemoText } from '../../models/memo-text.model';
import { TransactionListRecord } from 'app/shared/models/transaction-list-record.model';
import { ReportTypes } from '../../models/reports/report.model';

export enum ReattRedesTypes {
  REATTRIBUTED = 'REATTRIBUTED',
  REDESIGNATED = 'REDESIGNATED',
  REATTRIBUTION_FROM = 'REATTRIBUTION_FROM',
  REATTRIBUTION_TO = 'REATTRIBUTION_TO',
  REDESIGNATION_FROM = 'REDESIGNATION_FROM',
  REDESIGNATION_TO = 'REDESIGNATION_TO',
}

export class ReattRedesUtils {
  private static F3F3X_REATTRIBUTION_ALLOWED_TRANSACTION_TYPES: Set<TransactionTypes> | undefined;

  private static getF3F3XReattributionAllowedTransactionTypes(): Set<TransactionTypes> {
    if (!ReattRedesUtils.F3F3X_REATTRIBUTION_ALLOWED_TRANSACTION_TYPES) {
      ReattRedesUtils.F3F3X_REATTRIBUTION_ALLOWED_TRANSACTION_TYPES = new Set<TransactionTypes>([
        ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
        ScheduleATransactionTypes.EARMARK_RECEIPT,
        ScheduleATransactionTypes.INDIVIDUAL_RECEIPT_NON_CONTRIBUTION_ACCOUNT,
        ScheduleATransactionTypes.INDIVIDUAL_RECOUNT_RECEIPT,
        ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_RECOUNT_ACCOUNT,
        ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
        ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_CONVENTION_ACCOUNT,
        ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_RECOUNT_ACCOUNT_CONTRIBUTION,
        ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_CONVENTION_ACCOUNT_CONTRIBUTION,
        ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_HEADQUARTERS_ACCOUNT_CONTRIBUTION,
      ]);
    }
    return ReattRedesUtils.F3F3X_REATTRIBUTION_ALLOWED_TRANSACTION_TYPES;
  }

  public static readonly selectReportDialogSubject = new Subject<
    [TransactionListRecord, ReattRedesTypes] | undefined
  >();

  public static isReattRedes(
    transaction: Transaction | TransactionListRecord | undefined,
    types: ReattRedesTypes[] = [],
  ): boolean {
    if (!transaction || !('reattribution_redesignation_tag' in transaction)) return false;
    if (types.length === 0) return !!transaction.reattribution_redesignation_tag;
    return types.includes(transaction.reattribution_redesignation_tag as ReattRedesTypes);
  }

  public static isReattribute(type: ReattRedesTypes | undefined): boolean {
    return (
      type === ReattRedesTypes.REATTRIBUTED ||
      type === ReattRedesTypes.REATTRIBUTION_TO ||
      type === ReattRedesTypes.REATTRIBUTION_FROM
    );
  }

  public static canReattribute(
    transaction: Transaction | TransactionListRecord | undefined,
    reportType?: ReportTypes | string,
  ): boolean {
    if (!transaction) return false;
    if (!transaction.transactionType?.isReattributable) return false;
    if (
      ReattRedesUtils.isReattRedes(transaction, [ReattRedesTypes.REATTRIBUTION_FROM, ReattRedesTypes.REATTRIBUTION_TO])
    )
      return false;
    if (ReattRedesUtils.isAtAmountLimit(transaction)) return false;

    if (reportType === ReportTypes.F3 || reportType === ReportTypes.F3X) {
      if (
        transaction.transaction_type_identifier &&
        !ReattRedesUtils.getF3F3XReattributionAllowedTransactionTypes().has(
          transaction.transaction_type_identifier as TransactionTypes,
        )
      ) {
        return false;
      }
    }

    const transactionWithOptionalFields = transaction as TransactionListRecord & {
      entity_type?: string;
      amount?: number | string;
    };

    const entityType = 'entity_type' in transaction ? transactionWithOptionalFields.entity_type : undefined;
    if (entityType !== undefined && entityType !== ContactTypes.INDIVIDUAL) return false;

    const amount = 'amount' in transaction ? transactionWithOptionalFields.amount : undefined;
    if (typeof amount === 'number' && amount < 0) return false;
    if (typeof amount === 'string' && Number(amount) < 0) return false;

    return true;
  }

  public static isAtAmountLimit(transaction: Transaction | TransactionListRecord | undefined): boolean {
    const txn = transaction as SchATransaction | SchBTransaction;
    if (
      ReattRedesUtils.isReattRedes(txn, [ReattRedesTypes.REATTRIBUTED, ReattRedesTypes.REDESIGNATED]) &&
      txn.reatt_redes_total !== undefined
    ) {
      if (
        +txn.reatt_redes_total >=
        +(txn[txn.transactionType.templateMap.amount as keyof (SchATransaction | SchBTransaction)] ?? 0)
      ) {
        return true;
      }
    }
    return false;
  }

  public static overlayForms(
    toForm: FormGroup,
    toTransaction: SchATransaction | SchBTransaction,
    fromForm: FormGroup,
    fromTransaction: SchATransaction | SchBTransaction,
  ): void {
    if (toTransaction.reattribution_redesignation_tag === ReattRedesTypes.REATTRIBUTION_TO) {
      ReattributionToUtils.overlayForm(toForm, toTransaction as SchATransaction);
      ReattributionFromUtils.overlayForm(fromForm, fromTransaction as SchATransaction, toForm);
    }
    if (toTransaction.reattribution_redesignation_tag === ReattRedesTypes.REDESIGNATION_TO) {
      RedesignationToUtils.overlayForm(toForm, toTransaction as SchBTransaction);
      RedesignationFromUtils.overlayForm(fromForm, fromTransaction as SchBTransaction, toForm);
    }
  }

  public static getPayloads(
    payload: SchATransaction | SchBTransaction,
    pullForward: boolean,
  ): (SchATransaction | SchBTransaction)[] {
    let reattRedes: SchATransaction | SchBTransaction;
    const to = payload; // The FROM transaction is in the TO children[]

    if (pullForward) {
      reattRedes = this.clone(payload);
      payload.reatt_redes_id = undefined;
      payload.reatt_redes = reattRedes;
    } else {
      reattRedes = payload.reatt_redes as SchATransaction | SchBTransaction;
    }

    return [reattRedes, to];
  }

  static updateMemo(transaction: SchATransaction | SchBTransaction, prefix: string) {
    if (transaction.memo_text) {
      if (!transaction.memo_text.text_prefix) {
        transaction.memo_text.text_prefix = prefix;
        transaction.memo_text.text4000 = prefix + transaction?.memo_text?.text4000;
      }
    } else {
      transaction.memo_text = MemoText.fromJSON({
        rec_type: 'TEXT',
        report_id: transaction?.report_ids?.[0],
        text_prefix: prefix,
        text4000: prefix,
      });
    }
  }

  static clone(payload: SchATransaction | SchBTransaction): SchATransaction | SchBTransaction {
    if (!payload.reatt_redes?.transaction_type_identifier) {
      throw Error('FECfile+: originating transaction type not found.');
    }

    const clone =
      payload instanceof SchATransaction
        ? (cloneInstance(payload.reatt_redes) as SchATransaction)
        : (cloneInstance(payload.reatt_redes) as SchBTransaction);
    if (clone.memo_text) {
      clone.memo_text.id = undefined;
      clone.memo_text.report_id = payload.report_ids?.[0];
      clone.memo_text.transaction_id_number = undefined;
      clone.memo_text.transaction_uuid = undefined;
      clone.memo_text_id = undefined;
    }

    clone.reatt_redes_id = payload.reatt_redes.id;
    clone.report_ids = payload.report_ids;
    clone.id = undefined;
    clone.reports = undefined;
    clone.memo_code = true;
    clone.force_unaggregated = true;
    clone.children = []; // Children of original transaction do not copy over.

    return clone;
  }

  /**
   * Return true if this transaction is a pulled-forward copy
   * @param transaction
   * @returns
   */
  static isCopyFromPreviousReport(transaction: Transaction | undefined): boolean {
    if (
      ReattRedesUtils.isReattRedes(transaction, [ReattRedesTypes.REATTRIBUTED, ReattRedesTypes.REDESIGNATED]) &&
      transaction?.reatt_redes_id
    )
      return true;

    return false;
  }
}
