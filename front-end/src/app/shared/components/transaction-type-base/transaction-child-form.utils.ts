import { FormGroup } from '@angular/forms';
import { ScheduleTransaction, Transaction } from 'app/shared/models/transaction.model';
import { DoubleTransactionTypeBaseComponent } from './double-transaction-type-base.component';
import { TripleTransactionTypeBaseComponent } from './triple-transaction-type-base.component';
import { SignalFormControl } from 'app/shared/utils/signal-form-control';
import { Injector, effect, runInInjectionContext } from '@angular/core';

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
    injector: Injector, // 👈 you'll need to pass this in now
  ) {
    const transactionType = childTransaction.transactionType;
    const templateMap = transactionType?.templateMap;

    if (!transactionType || !templateMap) {
      throw new Error('Fecfile: Missing transactionType or templateMap');
    }

    runInInjectionContext(injector, () => {
      // --- 1. Enforce negative amount logic ---
      if (transactionType.negativeAmountValueOnly && templateMap.amount) {
        const amountControl = childForm.get(templateMap.amount) as SignalFormControl<number>;
        effect(() => {
          const amount = amountControl.valueChangeSignal();
          if (+amount > 0) {
            amountControl.setValue(-1 * amount);
          }
        });
      }

      // --- 2. Trigger parent purpose description when child fields change ---
      component.transaction()?.transactionType?.childTriggerFields?.forEach((triggerField) => {
        const control = childForm.get(templateMap[triggerField]) as SignalFormControl<string>;
        if (control) {
          effect(() => {
            const value = control.valueChangeSignal();
            const key = templateMap[triggerField] as keyof ScheduleTransaction;

            ((childTransaction as ScheduleTransaction)[key] as string) = value;
            (childTransaction as ScheduleTransaction).entity_type = childForm.get('entity_type')?.value;

            if (component.transaction()) {
              updatePurposeDescription(component.form(), component.transaction()!);
            } else {
              throw new Error('Fecfile: Parent transaction not found for component');
            }
          });
        }
      });

      // --- 3. Trigger child purpose description when parent fields change ---
      transactionType.parentTriggerFields?.forEach((triggerField) => {
        const key = component.templateMap()![triggerField] as keyof ScheduleTransaction;
        const control = component.form().get(key) as SignalFormControl<string>;

        if (control) {
          effect(() => {
            const value = control.valueChangeSignal();

            ((component.transaction() as ScheduleTransaction)[key] as string) = value;
            (component.transaction() as ScheduleTransaction).entity_type = component.form().get('entity_type')?.value;

            updatePurposeDescription(childForm, childTransaction);
          });
        }
      });

      // --- 4. Sync inherited fields from parent -> child ---
      transactionType.getInheritedFields(childTransaction)?.forEach((inheritedField) => {
        const parentControl = component.form().get(component.templateMap()![inheritedField]) as SignalFormControl;
        const childControl = childForm.get(templateMap[inheritedField]) as SignalFormControl;

        if (!parentControl || !childControl) {
          throw new Error('Fecfile: Missing inherited field control');
        }

        effect(() => {
          const value = parentControl.valueChangeSignal();
          childControl.setValue(value);
        });

        childControl.disable();
      });
    });
  }
}
