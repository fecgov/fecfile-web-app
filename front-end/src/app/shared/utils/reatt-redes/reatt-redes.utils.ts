import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';
import { Transaction } from '../../models/transaction.model';
import { SchATransaction } from '../../models/scha-transaction.model';
import { SchBTransaction } from '../../models/schb-transaction.model';
import { ReattributionToUtils } from './reattribution-to.utils';
import { ReattributionFromUtils } from './reattribution-from.utils';

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
  }

  /**
   * New validation rules for the transaction amount of reattribution from and redesignation from transactions.
   * These rules supplant the original rules for a given transaction.
   * @param originatingTransaction
   * @returns
   */
  public static amountValidator(
    originatingTransaction: SchATransaction | SchBTransaction,
    mustBeNegative = false
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const amount = control.value;

      if (amount !== null) {
        if (mustBeNegative && amount >= 0) {
          return { exclusiveMax: { exclusiveMax: 0 } };
        }
        if (!mustBeNegative && amount < 0) {
          return { exclusiveMin: { exclusiveMin: 0 } };
        }

        const key = originatingTransaction.transactionType.templateMap.amount;
        if (originatingTransaction) {
          const originatingAmount = originatingTransaction[key as keyof (SchATransaction | SchBTransaction)] ?? 0;
          if (Math.abs(amount) > Math.abs(originatingAmount as number)) {
            return {
              max: {
                max: originatingAmount,
                msgPrefix: 'The absolute value of the amount must be less than or equal to',
              },
            };
          }
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
}
