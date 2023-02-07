import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ScheduleAFormTemplateMap } from 'app/shared/models/scha-transaction.model';
import { NavigationDestination } from 'app/shared/models/transaction-navigation-controls.model';
import {
  Transaction,
  ScheduleTransaction,
  ScheduleFormTemplateMapType,
  ScheduleTransactionTypes,
} from 'app/shared/models/transaction.model';
import { ValidateService } from 'app/shared/services/validate.service';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { SelectItem } from 'primeng/api';
import { Contact, ContactTypeLabels, ContactTypes } from '../../models/contact.model';
import { TransactionTypeBaseComponent } from './transaction-type-base.component';
import { TransactionFormUtils } from './transaction-form.utils';
import { TransactionContactUtils } from './transaction-contact.utils';

/**
 * This component is to help manage a form that contains 2 transactions that the
 * user needs to fill out and submit to the back end.
 *
 * The primany transaction code is inherited from the TransactionTypeBaseComponent. This
 * abstract component class adds a child transaction that is defined in the parent
 * transaction's TransactionType class. (e.g. TransactionType.childTransactionType)
 *
 * See the transaction-group-ag component for an example of how to implement a
 * two-transaction input form.
 */
@Component({
  template: '',
})
export abstract class DoubleTransactionTypeBaseComponent
  extends TransactionTypeBaseComponent
  implements OnInit, OnDestroy
{
  abstract childFormProperties: string[];
  childContactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels);
  childForm: FormGroup = this.fb.group({});
  childValidateService: ValidateService = new ValidateService();
  childContactId$: Subject<string> = new BehaviorSubject<string>('');
  childContributionPurposeDescriptionLabel = '';
  childNegativeAmountValueOnly = false;
  childFormTemplateMap: ScheduleFormTemplateMapType = ScheduleAFormTemplateMap; // Text strings and fields specific to a particular schedule to map into the transaction input form templates

  override ngOnInit(): void {
    // Initialize primary form.
    super.ngOnInit();

    // Initialize child form.
    this.childForm = this.fb.group(this.childValidateService.getFormGroupFields(this.childFormProperties));
    this.childFormTemplateMap = Transaction.getFormTemplateMap(this.transactionType?.childTransactionType);
    TransactionFormUtils.onInit(
      this,
      this.childForm,
      this.childValidateService,
      this.transactionType?.childTransactionType,
      this.childContactId$,
      this.childFormTemplateMap
    );

    this.childOnInit();
  }

  childOnInit() {
    // Override contact type options if present in transactionType
    if (this.transactionType?.childTransactionType && this.transactionType.childTransactionType.contactTypeOptions) {
      this.childContactTypeOptions = LabelUtils.getPrimeOptions(
        ContactTypeLabels,
        this.transactionType.childTransactionType.contactTypeOptions
      );
    }

    const amountProperty = this.childFormTemplateMap.amount;
    const amount_schema = this.transactionType?.childTransactionType?.schema.properties[amountProperty];
    if (amount_schema?.exclusiveMaximum === 0) {
      this.childNegativeAmountValueOnly = true;
      this.childForm
        .get(amountProperty)
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((amount) => {
          if (typeof amount === 'number' && amount > 0) {
            this.childForm.patchValue({ amount: -1 * amount });
          }
        });
    }

    if (this.transactionType?.childTransactionType?.generatePurposeDescriptionLabel) {
      this.childContributionPurposeDescriptionLabel =
        this.transactionType.childTransactionType.generatePurposeDescriptionLabel();
    }

    // Default the child entity type to Committee
    if (!this.transactionType?.childTransactionType?.transaction?.id) {
      this.childForm.get('entity_type')?.setValue(ContactTypes.COMMITTEE);
    }

    // Parent contribution purpose description updates with child contributor name updates.
    this.childForm
      .get(this.childFormTemplateMap.organization_name)
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (this.transactionType?.childTransactionType?.transaction) {
          const key = this.childFormTemplateMap.organization_name as keyof ScheduleTransaction;
          ((this.transactionType.childTransactionType.transaction as ScheduleTransaction)[key] as string) = value;
        }
        this.updatePurposeDescription();
      });
    this.childForm
      .get(this.childFormTemplateMap.first_name)
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (this.transactionType?.childTransactionType?.transaction) {
          const key = this.childFormTemplateMap.first_name as keyof ScheduleTransaction;
          ((this.transactionType.childTransactionType.transaction as ScheduleTransaction)[key] as string) = value;
        }
        this.updatePurposeDescription();
      });
    this.childForm
      .get(this.childFormTemplateMap.last_name)
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (this.transactionType?.childTransactionType?.transaction) {
          const key = this.childFormTemplateMap.last_name as keyof ScheduleTransaction;
          ((this.transactionType.childTransactionType.transaction as ScheduleTransaction)[key] as string) = value;
        }
        this.updatePurposeDescription();
      });

    // Child amount must match parent contribution amount
    this.form
      .get(this.childFormTemplateMap.amount)
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.childForm.get(this.childFormTemplateMap.amount)?.setValue(value);
      });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.childContactId$.complete();
  }

  private updatePurposeDescription() {
    const childTransaction: ScheduleTransaction = this.transactionType?.childTransactionType
      ?.transaction as ScheduleTransaction;
    childTransaction.entity_type = this.childForm.get('entity_type')?.value;

    if (this.transactionType?.generatePurposeDescription) {
      this.form.patchValue({
        [this.childFormTemplateMap.purpose_descrip]: this.transactionType.generatePurposeDescriptionWrapper(),
      });
    }
  }

  override save(navigateTo: NavigationDestination, transactionTypeToAdd?: ScheduleTransactionTypes) {
    this.formSubmitted = true;

    if (this.form.invalid || this.childForm.invalid) {
      return;
    }

    const payload: Transaction = TransactionFormUtils.getPayloadTransaction(
      this.transactionType,
      this.validateService,
      this.form,
      this.formProperties
    );
    payload.children = [
      TransactionFormUtils.getPayloadTransaction(
        this.transactionType?.childTransactionType,
        this.childValidateService,
        this.childForm,
        this.childFormProperties
      ),
    ];
    payload.children[0].report_id = payload.report_id;

    // Confirm save for parent transaction
    this.confirmSave(payload, this.form, this.childConfirmSave, navigateTo, payload, transactionTypeToAdd);
  }

  private childConfirmSave(
    navigateTo: NavigationDestination,
    payload: Transaction,
    transactionTypeToAdd?: ScheduleTransactionTypes
  ) {
    if (payload.children?.length === 1) {
      this.confirmSave(
        payload.children[0],
        this.childForm,
        this.doSave,
        navigateTo,
        payload,
        transactionTypeToAdd,
        'childDialog'
      );
    } else {
      throw new Error('Parent transaction missing child transaction when trying to confirm save.');
    }
  }

  override resetForm() {
    this.formSubmitted = false;
    TransactionFormUtils.resetForm(this.form, this.transactionType, this.contactTypeOptions);
    TransactionFormUtils.resetForm(
      this.childForm,
      this.transactionType?.childTransactionType,
      this.childContactTypeOptions
    );
  }

  childOnContactLookupSelect(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.onContactLookupSelect(
      selectItem,
      this.childForm,
      this.transactionType?.childTransactionType,
      this.childContactId$,
      this.childFormTemplateMap
    );
  }
}
