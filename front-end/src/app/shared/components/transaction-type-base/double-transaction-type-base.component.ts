import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { NavigationEvent } from 'app/shared/models/transaction-navigation-controls.model';
import { Transaction, ScheduleTransaction } from 'app/shared/models/transaction.model';
import { ValidateService } from 'app/shared/services/validate.service';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { SelectItem } from 'primeng/api';
import { Contact, ContactTypeLabels, ContactTypes } from '../../models/contact.model';
import { TransactionTypeBaseComponent } from './transaction-type-base.component';
import { TransactionFormUtils } from './transaction-form.utils';
import { TransactionContactUtils } from './transaction-contact.utils';
import { TransactionTemplateMapType } from 'app/shared/models/transaction-type.model';

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
  childTransaction?: Transaction;
  childContactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels);
  childForm: FormGroup = this.fb.group({});
  childValidateService: ValidateService = new ValidateService();
  childContactId$: Subject<string> = new BehaviorSubject<string>('');
  childPurposeDescriptionLabel = '';
  childNegativeAmountValueOnly = false;
  childTemplateMap: TransactionTemplateMapType = {} as TransactionTemplateMapType;

  override ngOnInit(): void {
    // Initialize primary form.
    super.ngOnInit();

    // Initialize child form.
    this.childForm = this.fb.group(this.childValidateService.getFormGroupFields(this.childFormProperties));
    if (this.transaction?.children) {
      this.childTransaction = this.transaction?.children[0];
      if (this.childTransaction.transactionType?.templateMap) {
        this.childTemplateMap = this.childTransaction.transactionType.templateMap;
      } else {
        throw new Error('Fecfile: Template map not found for double transaction component');
      }
      TransactionFormUtils.onInit(
        this,
        this.childForm,
        this.childValidateService,
        this.childTransaction,
        this.childContactId$
      );
      this.childOnInit();
    }
  }

  childOnInit() {
    // Override contact type options if present in transactionType
    this.childContactTypeOptions = LabelUtils.getPrimeOptions(
      ContactTypeLabels,
      this.childTransaction?.transactionType?.contactTypeOptions
    );

    const amountProperty = this.childTemplateMap.amount;
    const amount_schema = this.childTransaction?.transactionType?.schema.properties[amountProperty];
    if (amount_schema?.exclusiveMaximum === 0) {
      this.childNegativeAmountValueOnly = true;
      this.childForm
        .get(amountProperty)
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((amount) => {
          if (+amount > 0) {
            this.childForm.patchValue({ amount: -1 * amount });
          }
        });
    }

    if (this.childTransaction?.transactionType?.generatePurposeDescriptionLabel) {
      this.childPurposeDescriptionLabel = this.childTransaction.transactionType.generatePurposeDescriptionLabel();
    }

    // Default the child entity type to Committee
    if (!this.childTransaction?.id) {
      this.childForm.get('entity_type')?.setValue(ContactTypes.COMMITTEE);
    }

    // Parent contribution purpose description updates with child contributor name updates.
    this.childForm
      .get(this.childTemplateMap.organization_name)
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        const key = this.childTemplateMap.organization_name as keyof ScheduleTransaction;
        ((this.childTransaction as ScheduleTransaction)[key] as string) = value;
        this.updateParentPurposeDescription();
      });
    this.childForm
      .get(this.childTemplateMap.first_name)
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        const key = this.childTemplateMap.first_name as keyof ScheduleTransaction;
        ((this.childTransaction as ScheduleTransaction)[key] as string) = value;
        this.updateParentPurposeDescription();
      });
    this.childForm
      .get(this.childTemplateMap.last_name)
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        const key = this.childTemplateMap.last_name as keyof ScheduleTransaction;
        ((this.childTransaction as ScheduleTransaction)[key] as string) = value;
        this.updateParentPurposeDescription();
      });

    // Child amount must match parent contribution amount
    this.form
      .get(this.templateMap.amount)
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.childForm.get(this.childTemplateMap.amount)?.setValue(value);
      });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.childContactId$.complete();
  }

  private updateParentPurposeDescription() {
    (this.childTransaction as ScheduleTransaction).entity_type = this.childForm.get('entity_type')?.value;

    if (this.transaction?.transactionType?.generatePurposeDescription) {
      this.form.patchValue({
        [this.templateMap.purpose_description]: this.transaction.transactionType.generatePurposeDescriptionWrapper(
          this.transaction
        ),
      });
    }
  }

  override save(navigationEvent: NavigationEvent) {
    this.formSubmitted = true;

    if (this.form.invalid || this.childForm.invalid) {
      return;
    }

    const payload: Transaction = TransactionFormUtils.getPayloadTransaction(
      this.transaction,
      this.validateService,
      this.form,
      this.formProperties
    );
    payload.children = [
      TransactionFormUtils.getPayloadTransaction(
        this.childTransaction,
        this.childValidateService,
        this.childForm,
        this.childFormProperties
      ),
    ];
    payload.children[0].report_id = payload.report_id;

    // Confirm save for parent transaction
    this.confirmSave(payload, this.form, this.childConfirmSave, navigationEvent, payload);
  }

  private childConfirmSave(navigationEvent: NavigationEvent, payload: Transaction) {
    if (payload.children?.length === 1) {
      this.confirmSave(payload.children[0], this.childForm, this.doSave, navigationEvent, payload, 'childDialog');
    } else {
      throw new Error('Fecfile: Parent transaction missing child transaction when trying to confirm save.');
    }
  }

  override resetForm() {
    this.formSubmitted = false;
    TransactionFormUtils.resetForm(this.form, this.transaction, this.contactTypeOptions);
    TransactionFormUtils.resetForm(this.childForm, this.childTransaction, this.childContactTypeOptions);
  }

  childOnContactLookupSelect(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.onContactLookupSelect(
      selectItem,
      this.childForm,
      this.childTransaction,
      this.childContactId$
    );
  }
}
