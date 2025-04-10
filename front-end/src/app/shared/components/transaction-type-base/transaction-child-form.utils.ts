import { FormGroup } from '@angular/forms';
import { ScheduleTransaction, Transaction } from 'app/shared/models/transaction.model';
import { DoubleTransactionTypeBaseComponent } from './double-transaction-type-base.component';
import { TripleTransactionTypeBaseComponent } from './triple-transaction-type-base.component';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';

function updatePurposeDescription(form: FormGroup, transaction: Transaction) {
  if (transaction?.transactionType?.generatePurposeDescription) {
    form.patchValue({
      [transaction.transactionType.templateMap.purpose_description]:
        transaction.transactionType.generatePurposeDescriptionWrapper(transaction),
    });
  }
}

export class TransactionChildFormUtils {
  static childOnInit(
    component: DoubleTransactionTypeBaseComponent | TripleTransactionTypeBaseComponent,
    childForm: FormGroup,
    childTransaction: Transaction,
  ) {
    // Determine if amount should always be negative and then force it to be so if needed
    if (
      childTransaction.transactionType?.negativeAmountValueOnly &&
      childTransaction.transactionType.templateMap?.amount
    ) {
      (childForm.get(childTransaction.transactionType.templateMap.amount) as SubscriptionFormControl)?.addSubscription(
        (amount) => {
          if (+amount > 0 && childTransaction.transactionType) {
            childForm.get(childTransaction.transactionType.templateMap.amount)?.setValue(-1 * amount);
          }
        },
        component.destroy$,
      );
    }

    // Parent contribution purpose description updates with configured child fields update.
    component.transaction()?.transactionType?.childTriggerFields?.forEach((triggerField) => {
      if (childTransaction.transactionType) {
        const control = childForm.get(childTransaction.transactionType.templateMap[triggerField]);
        (control as SubscriptionFormControl)?.addSubscription((value) => {
          /** Before updating the parent description, manually update the child
           * fields because they will not be updated by the time this hook is called
           **/
          const key = childTransaction.transactionType?.templateMap[triggerField] as keyof ScheduleTransaction;
          ((childTransaction as ScheduleTransaction)[key] as string) = value;
          (childTransaction as ScheduleTransaction).entity_type = childForm.get('entity_type')?.value;
          if (component.transaction()) {
            updatePurposeDescription(component.form, component.transaction()!);
          } else {
            throw new Error('Fecfile: Parent transaction not found for component');
          }
        }, component.destroy$);
      }
    });

    // Child contribution purpose description updates with configured parent fields update.
    childTransaction.transactionType?.parentTriggerFields?.forEach((triggerField) => {
      const key = component.templateMap()![triggerField] as keyof ScheduleTransaction;
      const control = component.form.get(key) as SubscriptionFormControl;
      control?.addSubscription((value) => {
        /** Before updating the parent description, manually update the child
         * fields because they will not be updated by the time this hook is called
         **/
        ((component.transaction() as ScheduleTransaction)[key] as string) = value;
        (component.transaction() as ScheduleTransaction).entity_type = component.form.get('entity_type')?.value;
        updatePurposeDescription(childForm, childTransaction);
      }, component.destroy$);
    });

    // Inheritted fields must match parent values
    childTransaction.transactionType?.getInheritedFields(childTransaction)?.forEach((inherittedField) => {
      if (childTransaction.transactionType) {
        (component.form.get(component.templateMap()![inherittedField]) as SubscriptionFormControl)?.addSubscription(
          (value) => {
            if (childTransaction.transactionType) {
              childForm.get(childTransaction.transactionType.templateMap[inherittedField])?.setValue(value);
            }
          },
          component.destroy$,
        );
        childForm.get(childTransaction.transactionType.templateMap[inherittedField])?.disable();
      } else {
        throw new Error('Fecfile: Template map not found for transaction component');
      }
    });
  }
}
