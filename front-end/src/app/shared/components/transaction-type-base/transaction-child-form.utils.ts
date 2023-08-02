import { FormGroup } from '@angular/forms';
import { SchATransaction } from 'app/shared/models/scha-transaction.model';
import { TransactionTemplateMapType, TransactionType } from 'app/shared/models/transaction-type.model';
import { ScheduleTransaction, Transaction } from 'app/shared/models/transaction.model';
import { PrimeOptions } from 'app/shared/utils/label.utils';
import { getFromJSON } from 'app/shared/utils/transaction-type.utils';
import { ValidateUtils } from 'app/shared/utils/validate.utils';
import { combineLatestWith, Observable, of, startWith, Subject, switchMap, takeUntil } from 'rxjs';
import { ContactTypes } from '../../models/contact.model';
import { DoubleTransactionTypeBaseComponent } from './double-transaction-type-base.component';
import { TripleTransactionTypeBaseComponent } from './triple-transaction-type-base.component';
import { TransactionContactUtils } from './transaction-contact.utils';
import { TransactionMemoUtils } from './transaction-memo.utils';
import { TransactionTypeBaseComponent } from './transaction-type-base.component';

export class TransactionChildFormUtils {
  static childOnInit(
    component: DoubleTransactionTypeBaseComponent | TripleTransactionTypeBaseComponent,
    childForm: FormGroup,
    childTransaction: Transaction
  ) {
    // Determine if amount should always be negative and then force it to be so if needed
    if (
      childTransaction.transactionType?.negativeAmountValueOnly &&
      childTransaction.transactionType.templateMap?.amount
    ) {
      childForm
        .get(childTransaction.transactionType.templateMap.amount)
        ?.valueChanges.pipe(takeUntil(component.destroy$))
        .subscribe((amount) => {
          if (+amount > 0 && childTransaction.transactionType) {
            childForm.get(childTransaction.transactionType.templateMap.amount)?.setValue(-1 * amount);
          }
        });
    }

    // Parent contribution purpose description updates with configured child fields update.
    component.transaction?.transactionType?.childTriggerFields?.forEach((triggerField) => {
      if (childTransaction.transactionType) {
        childForm
          .get(childTransaction.transactionType.templateMap[triggerField])
          ?.valueChanges.pipe(takeUntil(component.destroy$))
          .subscribe((value) => {
            /** Before updating the parent description, manually update the child
             * fields because they will not be updated by the time this hook is called
             **/
            const key = childTransaction.transactionType?.templateMap[triggerField] as keyof ScheduleTransaction;
            ((childTransaction as ScheduleTransaction)[key] as string) = value;
            (childTransaction as ScheduleTransaction).entity_type = childForm.get('entity_type')?.value;
            this.updateParentPurposeDescription();
          });
      }
    });

    // Child contribution purpose description updates with configured parent fields update.
    childTransaction.transactionType?.parentTriggerFields?.forEach((triggerField) => {
      component.form
        .get(component.templateMap[triggerField])
        ?.valueChanges.pipe(takeUntil(component.destroy$))
        .subscribe((value) => {
          /** Before updating the parent description, manually update the child
           * fields because they will not be updated by the time this hook is called
           **/
          const key = component.templateMap[triggerField] as keyof ScheduleTransaction;
          ((component.transaction as ScheduleTransaction)[key] as string) = value;
          (component.transaction as ScheduleTransaction).entity_type = component.form.get('entity_type')?.value;
          this.updateChildPurposeDescription();
        });
    });

    // Inheritted fields must match parent values
    childTransaction.transactionType?.inheritedFields?.forEach((inherittedField) => {
      if (childTransaction.transactionType) {
        component.form
          .get(component.templateMap[inherittedField])
          ?.valueChanges.pipe(takeUntil(component.destroy$))
          .subscribe((value) => {
            if (childTransaction.transactionType) {
              childForm.get(childTransaction.transactionType.templateMap[inherittedField])?.setValue(value);
            }
          });
        childForm.get(childTransaction.transactionType.templateMap[inherittedField])?.disable();
      } else {
        throw new Error('Fecfile: Template map not found for transaction component');
      }
    });
  }
}
