import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Transaction } from '../../models/transaction.model';
import { SchATransaction } from '../../models/scha-transaction.model';
import { SchBTransaction } from '../../models/schb-transaction.model';
import { ReattributionToUtils } from './reattribution-to.utils';
import { ReattributionFromUtils } from './reattribution-from.utils';
import { Subject } from 'rxjs';
import { RedesignationToUtils } from './redesignation-to.utils';
import { RedesignationFromUtils } from './redesignation-from.utils';
import { MemoText } from '../../models/memo-text.model';
import { cloneDeep } from 'lodash';

export enum ReattRedesTypes {
  REATTRIBUTED = 'REATTRIBUTED',
  REDESIGNATED = 'REDESIGNATED',
  REATTRIBUTION_FROM = 'REATTRIBUTION_FROM',
  REATTRIBUTION_TO = 'REATTRIBUTION_TO',
  REDESIGNATION_FROM = 'REDESIGNATION_FROM',
  REDESIGNATION_TO = 'REDESIGNATION_TO',
}

export class ReattRedesUtils {
  public static readonly selectReportDialogSubject = new Subject<[Transaction, ReattRedesTypes]>();

  public static isReattRedes(transaction: Transaction | undefined, types: ReattRedesTypes[] = []): boolean {
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

  public static isAtAmountLimit(transaction: Transaction | undefined): boolean {
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

  /**
   * New validation rules for the transaction amount of reattribution from and redesignation from transactions.
   * These rules supplant the original rules for a given transaction.
   * @param transaction
   * @param mustBeNegative
   * @returns
   */
  public static amountValidator(transaction: SchATransaction | SchBTransaction, mustBeNegative = false): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const amount = control.value;

      if (amount !== null) {
        if (mustBeNegative && amount >= 0) {
          return { exclusiveMax: { exclusiveMax: 0 } };
        }
        if (!mustBeNegative && amount < 0) {
          return { exclusiveMin: { exclusiveMin: 0 } };
        }

        const amountKey = transaction.transactionType.templateMap.amount;
        const originalAmount =
          ((transaction.reatt_redes as SchATransaction | SchBTransaction)[
            amountKey as keyof (SchATransaction | SchBTransaction)
          ] as number) ?? 0;
        const reattRedesTotal = (transaction.reatt_redes as SchATransaction | SchBTransaction)?.reatt_redes_total ?? 0;
        let limit = originalAmount - reattRedesTotal;
        if (transaction.id) limit += +(transaction[amountKey as keyof (SchATransaction | SchBTransaction)] as number); // If editing, add value back into limit restriction.
        if (Math.abs(amount) > Math.abs(limit)) {
          return {
            max: {
              max: limit,
              msgPrefix: 'The absolute value of the amount must be less than or equal to',
            },
          };
        }
      }

      return null;
    };
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
        report_id: transaction?.report_id,
        text_prefix: prefix,
        text4000: prefix,
      });
    }
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

  private static clone(payload: SchATransaction | SchBTransaction): SchATransaction | SchBTransaction {
    if (!payload.reatt_redes?.transaction_type_identifier) {
      throw Error('Fecfile online: originating transaction type not found.');
    }

    const clone =
      payload instanceof SchATransaction
        ? (cloneDeep(payload.reatt_redes) as SchATransaction)
        : (cloneDeep(payload.reatt_redes) as SchBTransaction);
    if (clone.memo_text) {
      clone.memo_text.id = undefined;
      clone.memo_text.report_id = payload.report_id;
      clone.memo_text.transaction_id_number = undefined;
      clone.memo_text.transaction_uuid = undefined;
      clone.memo_text_id = undefined;
    }

    clone.reatt_redes_id = payload.reatt_redes.id;
    clone.report_id = payload.report_id;
    clone.id = undefined;
    clone.report = undefined;
    clone.memo_code = true;
    clone.force_unaggregated = true;
    clone.children = []; // Children of original transaction do not copy over.

    return clone;
  }
}
