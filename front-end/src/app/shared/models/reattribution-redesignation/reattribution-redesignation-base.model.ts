import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { SchATransaction } from '../scha-transaction.model';
import { SchBTransaction } from '../schb-transaction.model';

export enum ReattRedesTypes {
  REATTRIBUTED = 'REATTRIBUTED',
  REDESIGNATED = 'REDESIGNATED',
  REATTRIBUTION_FROM = 'REATTRIBUTION_FROM',
  REATTRIBUTION_TO = 'REATTRIBUTION_TO',
  REDESIGNATION_FROM = 'REDESIGNATION_FROM',
  REDESIGNATION_TO = 'REDESIGNATION_TO',
}

export abstract class ReattributionRedesignationBase {
  /**
   * New validation rules for the transaction amount of reattribution from and redesignation from transactions.
   * These rules supplant the original rules for a given transaction.
   * @param originatingTransaction
   * @returns
   */
  amountValidator(originatingTransaction: SchATransaction | SchBTransaction, mustBeNegative = false): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const amount = control.value;

      if (amount !== null) {
        if (mustBeNegative && amount >= 0) {
          return { exclusiveMax: { exclusiveMax: 0 } };
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
}
