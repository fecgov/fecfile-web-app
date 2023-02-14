import { FormGroup } from '@angular/forms';
import { TransactionType } from 'app/shared/models/transaction-types/transaction-type.model';
import { Transaction, ScheduleTransaction } from 'app/shared/models/transaction.model';
import { ValidateService } from 'app/shared/services/validate.service';
import { PrimeOptions } from 'app/shared/utils/label.utils';
import { combineLatestWith, Observable, of, startWith, Subject, switchMap, takeUntil } from 'rxjs';
import { ContactTypes } from '../../models/contact.model';
import { TransactionMemoUtils } from './transaction-memo.utils';
import { TransactionTypeBaseComponent } from './transaction-type-base.component';
import { DoubleTransactionTypeBaseComponent } from './double-transaction-type-base.component';
import { getFromJSON } from 'app/shared/utils/transaction-type.utils';

export class TransactionFormUtils {
  /**
   * The parameters after the "component" parameter need to be set to either the primary (parent)
   * component values or, if they are the second transaction type of a "double" transaction
   * input screen, those parameters need to be set to the "child" properties of the
   * child transaction type defined in the DoubleTransactionTypeBase class.
   * @param component
   * @param form - parent or child (i.e. form or childForm)
   * @param validateService - parent or child (i.e. validateService or childValidateService)
   * @param transaction - parent or child
   * @param contactId$ - parent or child (i.e. contactId$ or childContactId$)
   */
  static onInit(
    component: TransactionTypeBaseComponent | DoubleTransactionTypeBaseComponent,
    form: FormGroup,
    validateService: ValidateService,
    transaction: Transaction | undefined,
    contactId$: Subject<string>
  ): void {
    // Initialize validation tracking of current JSON schema and form data
    validateService.formValidatorSchema = transaction?.transactionType?.schema;
    validateService.formValidatorForm = form;

    // Intialize form values
    function isExisting(transaction: Transaction | undefined) {
      return !!transaction?.id;
    }

    if (isExisting(transaction)) {
      const txn = { ...transaction } as Transaction;
      form.patchValue({ ...txn });

      TransactionMemoUtils.patchMemoText(transaction, form);

      form.get('entity_type')?.disable();
      contactId$.next(txn.contact_id || '');
    } else {
      component.resetForm();
      form.get('entity_type')?.enable();
      contactId$.next('');
    }

    const templateMap = transaction?.transactionType?.templateMap;
    if (!templateMap) {
      throw new Error('Cannot find template map when initializing transaction form');
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

    form
      ?.get(templateMap.aggregate)
      ?.valueChanges.pipe(takeUntil(component.destroy$))
      .subscribe(() => {
        form.get(templateMap.employer)?.updateValueAndValidity();
        form.get(templateMap.occupation)?.updateValueAndValidity();
      });

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
        combineLatestWith(previous_transaction$),
        takeUntil(component.destroy$)
      )
      .subscribe(([amount, previous_transaction]) => {
        const key = templateMap.aggregate as keyof ScheduleTransaction;
        const previousAggregate = previous_transaction ? +((previous_transaction as ScheduleTransaction)[key] || 0) : 0;
        form.get(templateMap.aggregate)?.setValue(+amount + previousAggregate);
      });
  }

  static getPayloadTransaction(
    transaction: Transaction | undefined,
    validateService: ValidateService,
    form: FormGroup,
    formProperties: string[]
  ): Transaction {
    if (!transaction) {
      throw new Error('Payload transaction not found');
    }

    let formValues = validateService.getFormValues(form, formProperties);
    formValues = TransactionMemoUtils.retrieveMemoText(transaction, form, formValues);

    const payload: ScheduleTransaction = getFromJSON({
      ...transaction,
      ...formValues,
    });
    if (payload.children) {
      payload.children = payload.updateChildren();
    }

    return payload;
  }

  static resetForm(form: FormGroup, transaction: Transaction | undefined, contactTypeOptions: PrimeOptions) {
    form.reset();
    form.markAsPristine();
    form.markAsUntouched();

    // Override the default entity_type value if called for by the defaultContactTypeOption
    // in the TransactionType
    let defaultContactTypeOption: string = contactTypeOptions[0]?.code;
    if (transaction?.transactionType?.defaultContactTypeOption) {
      defaultContactTypeOption = transaction.transactionType.defaultContactTypeOption;
    }

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
}
