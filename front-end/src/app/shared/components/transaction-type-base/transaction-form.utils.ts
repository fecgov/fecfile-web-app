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
import { TransactionMemoUtils } from './transaction-memo.utils';
import { TransactionTypeBaseComponent } from './transaction-type-base.component';

export class TransactionFormUtils {
  /**
   * The parameters after the "component" parameter need to be set to either the primary (parent)
   * component values or, if they are the second transaction type of a "double" transaction
   * input screen, those parameters need to be set to the "child" properties of the
   * child transaction type defined in the DoubleTransactionTypeBase class.
   * @param component
   * @param form - parent or child (i.e. form or childForm)
   * @param transaction - parent or child
   * @param contactId$ - parent or child (i.e. contactId$ or childContactId$)
   */
  static onInit(
    component: TransactionTypeBaseComponent | DoubleTransactionTypeBaseComponent,
    form: FormGroup,
    transaction: Transaction | undefined,
    contactId$: Subject<string>
  ): void {
    if (transaction && transaction.id) {
      form.patchValue({ ...transaction });

      TransactionMemoUtils.patchMemoText(transaction, form);

      form.get('entity_type')?.disable();
      contactId$.next(transaction.contact_1_id || '');
    } else {
      component.resetForm();
      form.get('entity_type')?.enable();
      contactId$.next('');
    }

    const templateMap = transaction?.transactionType?.templateMap;
    if (!templateMap) {
      throw new Error('Fecfile: Cannot find template map when initializing transaction form');
    }

    form
      .get('entity_type')
      ?.valueChanges.pipe(takeUntil(component.destroy$))
      .subscribe((value: string) => {
        if (value === ContactTypes.INDIVIDUAL || value === ContactTypes.CANDIDATE) {
          form.get(templateMap.organization_name)?.reset();
        }
        if (value === ContactTypes.ORGANIZATION || value === ContactTypes.COMMITTEE) {
          form.get(templateMap.last_name)?.reset();
          form.get(templateMap.first_name)?.reset();
          form.get(templateMap.middle_name)?.reset();
          form.get(templateMap.prefix)?.reset();
          form.get(templateMap.suffix)?.reset();
          form.get(templateMap.employer)?.reset();
          form.get(templateMap.occupation)?.reset();
        }
      });

    if ((transaction as SchATransaction).aggregation_group) {
      form
        ?.get(templateMap.aggregate)
        ?.valueChanges.pipe(takeUntil(component.destroy$))
        .subscribe(() => {
          form.get(templateMap.employer)?.updateValueAndValidity();
          form.get(templateMap.occupation)?.updateValueAndValidity();
        });
    } else {
      form
        ?.get(templateMap.amount)
        ?.valueChanges.pipe(takeUntil(component.destroy$))
        .subscribe(() => {
          form.get(templateMap.employer)?.updateValueAndValidity();
          form.get(templateMap.occupation)?.updateValueAndValidity();
        });
    }

    if (transaction.transactionType?.showAggregate) {
      const previous_transaction$: Observable<Transaction | undefined> =
        form.get(templateMap.date)?.valueChanges.pipe(
          startWith(form.get(templateMap.date)?.value),
          combineLatestWith(contactId$),
          switchMap(([contribution_date, contactId]) => {
            return component.transactionService.getPreviousTransaction(transaction, contactId, contribution_date);
          })
        ) || of(undefined);
      form
        .get(templateMap.amount)
        ?.valueChanges.pipe(
          startWith(form.get(templateMap.amount)?.value),
          combineLatestWith(previous_transaction$, of(transaction)),
          takeUntil(component.destroy$)
        )
        .subscribe(([amount, previous_transaction, transaction]) => {
          this.updateAggregate(form, templateMap, transaction, previous_transaction, amount);
        });
    }

    const schema = transaction.transactionType?.schema;
    if (schema) {
      ValidateUtils.addJsonSchemaValidators(form, schema, false, transaction);
    }
  }

  static updateAggregate(
    form: FormGroup,
    templateMap: TransactionTemplateMapType,
    transaction: Transaction,
    previousTransaction: Transaction | undefined,
    amount: number
  ) {
    const key = previousTransaction?.transactionType?.templateMap.aggregate as keyof ScheduleTransaction;
    const previousAggregate = previousTransaction ? +((previousTransaction as ScheduleTransaction)[key] || 0) : 0;
    if (transaction.transactionType?.isRefund) {
      form.get(templateMap.aggregate)?.setValue(previousAggregate - +amount);
    } else {
      form.get(templateMap.aggregate)?.setValue(previousAggregate + +amount);
    }
  }

  static getPayloadTransaction(
    transaction: Transaction | undefined,
    form: FormGroup,
    formProperties: string[]
  ): Transaction {
    if (!transaction) {
      throw new Error('Fecfile: Payload transaction not found');
    }

    // Remove parent transaction links within the parent-child hierarchy in the
    // transaction objects to avoid a recursion overflow from the class-transformer
    // plainToClass() converter
    if (transaction?.children) {
      transaction.children.forEach((child) => {
        child.parent_transaction = undefined;
      });
    }

    let formValues = ValidateUtils.getFormValues(form, transaction.transactionType?.schema, formProperties);
    formValues = TransactionMemoUtils.retrieveMemoText(transaction, form, formValues);

    let payload: ScheduleTransaction = getFromJSON({
      ...transaction,
      ...formValues,
    });
    if (payload.children) {
      payload.children = payload.updateChildren();
    }
    // Reorganize the payload if this transaction type can update its parent transaction
    // This will break the scenario where the user creates a grandparent, then child, then tries
    // to create a grandchild transaction because we won't know which child transaction of the grandparent
    // was the original transaction it's id was generated on the api.  the middle child's
    // id is necessary to generate the url for creating the grandchild.
    if (transaction.transactionType?.updateParentOnSave) {
      payload = payload.getUpdatedParent() as ScheduleTransaction;
    }
    return payload;
  }

  static resetForm(form: FormGroup, transaction: Transaction | undefined, contactTypeOptions: PrimeOptions) {
    form.reset();
    form.markAsPristine();
    form.markAsUntouched();

    const defaultContactTypeOption: string = contactTypeOptions[0]?.value;

    if (transaction?.transactionType) {
      form.patchValue({
        entity_type: defaultContactTypeOption,
        [transaction.transactionType.templateMap.aggregate]: '0',
        memo_code: this.getMemoCodeConstant(transaction?.transactionType),
        [transaction.transactionType.templateMap.purpose_description]:
          transaction?.transactionType?.generatePurposeDescriptionWrapper(transaction),
      });
    }
  }

  static getMemoCodeConstant(transactionType?: TransactionType): boolean | undefined {
    /** Look at validation schema to determine if the memo_code has a constant value.
     * If there is a constant value, return it, otherwise undefined
     */
    const memoCodeSchema = transactionType?.schema.properties['memo_code'];
    return memoCodeSchema?.const as boolean | undefined;
  }

  static isMemoCodeReadOnly(transactionType?: TransactionType): boolean {
    // Memo Code is read-only if there is a constant value in the schema.  Otherwise, it's mutable
    return TransactionFormUtils.getMemoCodeConstant(transactionType) !== undefined;
  }
}
