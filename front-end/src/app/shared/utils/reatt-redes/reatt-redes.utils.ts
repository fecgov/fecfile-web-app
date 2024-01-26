import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Transaction } from '../../models/transaction.model';
import { SchATransaction } from '../../models/scha-transaction.model';
import { SchBTransaction } from '../../models/schb-transaction.model';
import { ReattributionToUtils } from './reattribution-to.utils';
import { ReattributionFromUtils } from './reattribution-from.utils';
import { RedesignationToUtils } from './redesignation-to.utils';
import { RedesignationFromUtils } from './redesignation-from.utils';
import { MemoText } from 'app/shared/models/memo-text.model';

export enum ReattRedesTypes {
  REATTRIBUTED = 'REATTRIBUTED',
  REDESIGNATED = 'REDESIGNATED',
  REATTRIBUTION_FROM = 'REATTRIBUTION_FROM',
  REATTRIBUTION_TO = 'REATTRIBUTION_TO',
  REDESIGNATION_FROM = 'REDESIGNATION_FROM',
  REDESIGNATION_TO = 'REDESIGNATION_TO',
}

export class ReattRedesUtils {
  public static isReattRedes(transaction: Transaction | undefined, types: ReattRedesTypes[] = []): boolean {
    if (!transaction || !('reattribution_redesignation_tag' in transaction)) return false;
    if (types.length === 0) return !!transaction.reattribution_redesignation_tag;
    return types.includes(transaction.reattribution_redesignation_tag as ReattRedesTypes);
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
    fromTransaction: SchATransaction | SchBTransaction
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

  public static getPayloads(payload: Transaction): (SchATransaction | SchBTransaction)[] {
    const reattributed = payload.reatt_redes as SchATransaction | SchBTransaction;
    const to = payload as SchATransaction | SchBTransaction; // The FROM transaction is in the TO children[]
    return [reattributed, to];
  }

  public static overlayTransactionProperties(
    transaction: SchATransaction | SchBTransaction,
    activeReportId?: string
  ): SchATransaction | SchBTransaction {
    if (!transaction.reattribution_redesignation_tag) {
      const purpose_descrip =
        (transaction as SchATransaction).contribution_purpose_descrip ??
        (transaction as SchBTransaction).expenditure_purpose_descrip;

      if (purpose_descrip) {
        const prefix = `[Original purpose description: ${purpose_descrip}] `;
        if (transaction.memo_text) {
          transaction.memo_text.text_prefix = prefix;
          transaction.memo_text.text4000 = prefix + transaction?.memo_text?.text4000;
        } else {
          transaction.memo_text = MemoText.fromJSON({
            text_prefix: prefix,
            text4000: prefix,
          });
        }
      }

      if (transaction.report_id === activeReportId) {
        if (transaction instanceof SchATransaction) {
          transaction.contribution_purpose_descrip = 'See reattribution below.';
        } else if (transaction instanceof SchBTransaction) {
          transaction.expenditure_purpose_descrip = 'See redesignation below.';
        }
      } else {
        alert('Not implemented yet. Only implement transactions in the current report.');
        return transaction;
      }

      if (transaction instanceof SchATransaction) {
        transaction.reattribution_redesignation_tag = ReattRedesTypes.REATTRIBUTED;
      } else if (transaction instanceof SchBTransaction) {
        transaction.reattribution_redesignation_tag = ReattRedesTypes.REDESIGNATED;
      }
    }

    const purpose_field =
      transaction instanceof SchATransaction ? 'contribution_purpose_descrip' : 'expenditure_purpose_descrip';

    transaction.fields_to_validate = transaction.fields_to_validate?.filter((field) => field !== purpose_field);

    return transaction;
  }
}
