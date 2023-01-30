import { FormGroup } from '@angular/forms';
import { TransactionType } from 'app/shared/models/transaction-types/transaction-type.model';
import { SchATransaction } from 'app/shared/models/scha-transaction.model';
import { Transaction } from 'app/shared/models/transaction.model';
import { ValidateService } from 'app/shared/services/validate.service';
import { PrimeOptions } from 'app/shared/utils/label.utils';
import { combineLatestWith, Observable, of, startWith, Subject, switchMap, takeUntil } from 'rxjs';
import { ContactTypes } from '../../models/contact.model';
import { TransactionMemoUtils } from './transaction-memo.utils';
import { TransactionTypeBaseComponent } from './transaction-type-base.component';
import { DoubleTransactionTypeBaseComponent } from './double-transaction-type-base.component';

export class TransactionFormUtils {
  /**
   * The parameters after the "component" parameter need to be set to either the primary (parent)
   * component values or, if they are the second transaction type of a "double" transaction
   * input screen, those parameters need to be set to the "child" properties of the
   * child transaction type defined in the DoubleTransactionTypeBase class.
   * @param component
   * @param form - parent or child (i.e. form or childForm)
   * @param contactTypeOptions - parent or child (i.e. contactTypeOptions or childContactTypeOptions)
   * @param validateService - parent or child (i.e. validateService or childValidateService)
   * @param transactionType - parent or child (i.e. transactionType or transactionType?.childTransactionType)
   * @param contactId$ - parent or child (i.e. contactId$ or childContactId$)
   */
  static onInit(
    component: TransactionTypeBaseComponent | DoubleTransactionTypeBaseComponent,
    form: FormGroup,
    validateService: ValidateService,
    transactionType: TransactionType | undefined,
    contactId$: Subject<string>
  ): void {
    // Initialize validation tracking of current JSON schema and form data
    validateService.formValidatorSchema = transactionType?.schema;
    validateService.formValidatorForm = form;

    // Intialize form values
    function isExisting(transaction: Transaction | undefined) {
      return !!transaction?.id;
    }

    if (isExisting(transactionType?.transaction)) {
      const txn = { ...transactionType?.transaction } as SchATransaction;
      form.patchValue({ ...txn });

      TransactionMemoUtils.patchMemoText(transactionType, form);

      form.get('entity_type')?.disable();
      contactId$.next(txn.contact_id || '');
    } else {
      component.resetForm();
      form.get('entity_type')?.enable();
      contactId$.next('');
    }

    form
      .get('entity_type')
      ?.valueChanges.pipe(takeUntil(component.destroy$))
      .subscribe((value: string) => {
        if (value === ContactTypes.INDIVIDUAL || value === ContactTypes.CANDIDATE) {
          form.get('contributor_organization_name')?.reset();
        }
        if (value === ContactTypes.ORGANIZATION || value === ContactTypes.COMMITTEE) {
          form.get('contributor_last_name')?.reset();
          form.get('contributor_first_name')?.reset();
          form.get('contributor_middle_name')?.reset();
          form.get('contributor_prefix')?.reset();
          form.get('contributor_suffix')?.reset();
          form.get('contributor_employer')?.reset();
          form.get('contributor_occupation')?.reset();
        }
      });

    form
      ?.get('contribution_aggregate')
      ?.valueChanges.pipe(takeUntil(component.destroy$))
      .subscribe(() => {
        form.get('contributor_employer')?.updateValueAndValidity();
        form.get('contributor_occupation')?.updateValueAndValidity();
      });

    const previous_transaction$: Observable<Transaction | undefined> =
      form.get('contribution_date')?.valueChanges.pipe(
        startWith(form.get('contribution_date')?.value),
        combineLatestWith(contactId$),
        switchMap(([contribution_date, contactId]) => {
          return component.transactionService.getPreviousTransaction(transactionType, contactId, contribution_date);
        })
      ) || of(undefined);
    form
      .get('contribution_amount')
      ?.valueChanges.pipe(
        startWith(form.get('contribution_amount')?.value),
        combineLatestWith(previous_transaction$),
        takeUntil(component.destroy$)
      )
      .subscribe(([contribution_amount, previous_transaction]) => {
        const previousAggregate = +((previous_transaction as SchATransaction)?.contribution_aggregate || 0);
        form.get('contribution_aggregate')?.setValue(+contribution_amount + previousAggregate);
      });
  }

  static getPayloadTransaction(
    transactionType: TransactionType | undefined,
    validateService: ValidateService,
    form: FormGroup,
    formProperties: string[]
  ): SchATransaction {
    let formValues = validateService.getFormValues(form, formProperties);
    if (transactionType) formValues = TransactionMemoUtils.retrieveMemoText(transactionType, form, formValues);

    const payload: SchATransaction = SchATransaction.fromJSON({
      ...transactionType?.transaction,
      ...formValues,
    });
    if (payload.children) {
      payload.children = payload.updateChildren();
    }

    return payload;
  }

  static resetForm(form: FormGroup, transactionType: TransactionType | undefined, contactTypeOptions: PrimeOptions) {
    form.reset();
    form.markAsPristine();
    form.markAsUntouched();

    form.patchValue({
      entity_type: contactTypeOptions[0]?.code,
      contribution_aggregate: '0',
      memo_code: this.getMemoCodeConstant(transactionType),
      contribution_purpose_descrip: transactionType?.generatePurposeDescription?.() || '',
    });
  }

  static getMemoCodeConstant(transactionType?: TransactionType): boolean | undefined {
    /** Look at validation schema to determine if the memo_code has a constant value.
     * If there is a constant value, return it, otherwise undefined
     */
    const memoCodeSchema = transactionType?.schema.properties['memo_code'];
    return memoCodeSchema?.const as boolean | undefined;
  }
}
