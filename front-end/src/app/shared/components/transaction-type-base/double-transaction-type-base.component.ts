import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationEvent } from 'app/shared/models/transaction-navigation-controls.model';
import { TransactionTemplateMapType } from 'app/shared/models/transaction-type.model';
import { ScheduleTransaction, Transaction } from 'app/shared/models/transaction.model';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { ValidateUtils } from 'app/shared/utils/validate.utils';
import { SelectItem } from 'primeng/api';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { Contact, ContactTypeLabels } from '../../models/contact.model';
import { TransactionContactUtils } from './transaction-contact.utils';
import { TransactionFormUtils } from './transaction-form.utils';
import { TransactionTypeBaseComponent } from './transaction-type-base.component';

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
  childContactId$: Subject<string> = new BehaviorSubject<string>('');
  childPurposeDescriptionLabel = '';
  childTemplateMap: TransactionTemplateMapType = {} as TransactionTemplateMapType;
  useParentContact = false;

  override ngOnInit(): void {
    // Initialize primary form.
    super.ngOnInit();

    // Initialize child form.
    this.childForm = this.fb.group(ValidateUtils.getFormGroupFields(this.childFormProperties));
    if (this.transaction?.children) {
      this.childTransaction = this.transaction?.children[0];
      if (this.childTransaction.transactionType?.templateMap) {
        this.childTemplateMap = this.childTransaction.transactionType.templateMap;
      } else {
        throw new Error('Fecfile: Template map not found for double transaction component');
      }
      TransactionFormUtils.onInit(this, this.childForm, this.childTransaction, this.childContactId$);
      this.childOnInit();
    }
  }

  childOnInit() {
    // Override contact type options if present in transactionType
    if (this.childTransaction?.transactionType?.contactTypeOptions) {
      this.childContactTypeOptions = LabelUtils.getPrimeOptions(
        ContactTypeLabels,
        this.childTransaction?.transactionType?.contactTypeOptions
      );
    }

    // Determine if amount should always be negative and then force it to be so if needed
    if (this.childTransaction?.transactionType?.negativeAmountValueOnly && this.childTemplateMap?.amount) {
      this.childForm
        .get(this.childTemplateMap.amount)
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((amount) => {
          if (+amount > 0) {
            this.form.patchValue({ [this.childTemplateMap.amount]: -1 * amount });
          }
        });
    }

    if (this.childTransaction?.transactionType?.generatePurposeDescriptionLabel) {
      this.childPurposeDescriptionLabel = this.childTransaction.transactionType.generatePurposeDescriptionLabel();
    }

    // Parent contribution purpose description updates with configured child fields update.
    this.transaction?.transactionType?.childTriggerFields?.forEach((triggerField) => {
      this.childForm
        .get(this.childTemplateMap[triggerField])
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((value) => {
          /** Before updating the parent description, manually update the child
           * fields because they will not be updated by the time this hook is called
           **/
          const key = this.childTemplateMap[triggerField] as keyof ScheduleTransaction;
          ((this.childTransaction as ScheduleTransaction)[key] as string) = value;
          (this.childTransaction as ScheduleTransaction).entity_type = this.childForm.get('entity_type')?.value;
          this.updateParentPurposeDescription();
        });
    });

    // Child contribution purpose description updates with configured parent fields update.
    this.childTransaction?.transactionType?.parentTriggerFields?.forEach((triggerField) => {
      this.form
        .get(this.templateMap[triggerField])
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((value) => {
          /** Before updating the parent description, manually update the child
           * fields because they will not be updated by the time this hook is called
           **/
          const key = this.templateMap[triggerField] as keyof ScheduleTransaction;
          ((this.transaction as ScheduleTransaction)[key] as string) = value;
          (this.transaction as ScheduleTransaction).entity_type = this.form.get('entity_type')?.value;
          this.updateChildPurposeDescription();
        });
    });

    this.useParentContact = !!this.childTransaction?.transactionType?.useParentContact;

    // Inheritted fields must match parent values
    this.childTransaction?.transactionType?.inheritedFields?.forEach((inherittedField) => {
      this.form
        .get(this.templateMap[inherittedField])
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((value) => {
          this.childForm.get(this.childTemplateMap[inherittedField])?.setValue(value);
        });
      this.childForm.get(inherittedField)?.disable();
    });
  }

  override onContactLookupSelect(selectItem: SelectItem<Contact>): void {
    super.onContactLookupSelect(selectItem);
    if (this.useParentContact && this.childTransaction && this.transaction?.contact_1) {
      this.childTransaction.contact_1 = this.transaction.contact_1;
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.childContactId$.complete();
  }

  private updateParentPurposeDescription() {
    if (this.transaction?.transactionType?.generatePurposeDescription) {
      this.form.patchValue({
        [this.templateMap.purpose_description]: this.transaction.transactionType.generatePurposeDescriptionWrapper(
          this.transaction
        ),
      });
    }
  }

  private updateChildPurposeDescription() {
    if (this.childTransaction?.transactionType?.generatePurposeDescription) {
      this.childForm.patchValue({
        [this.childTemplateMap.purpose_description]:
          this.childTransaction.transactionType.generatePurposeDescriptionWrapper(this.childTransaction),
      });
    }
  }

  override save(navigationEvent: NavigationEvent) {
    this.formSubmitted = true;

    if (this.form.invalid || this.childForm.invalid) {
      return;
    }

    // Remove parent transaction links within the parent-child hierarchy in the
    // transaction objects to avoid a recursion overflow from the class-transformer
    // plainToClass() converter.
    if (this.transaction?.children) {
      this.transaction.children[0].parent_transaction = undefined;
    }
    if (this.childTransaction?.parent_transaction) {
      this.childTransaction.parent_transaction = undefined;
    }

    const payload: Transaction = TransactionFormUtils.getPayloadTransaction(
      this.transaction,
      this.form,
      this.formProperties
    );
    payload.children = [
      TransactionFormUtils.getPayloadTransaction(this.childTransaction, this.childForm, this.childFormProperties),
    ];
    payload.children[0].report_id = payload.report_id;

    // Confirm save for parent transaction
    // No need to confirm child contact changes if it uses the parent contact info
    const saveCallback = this.childTransaction?.transactionType?.useParentContact ? this.doSave : this.childConfirmSave;
    this.confirmSave(payload, this.form, saveCallback, navigationEvent, payload);
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

    // Some inheritted fields (such as memo_code) cannot be set before the components are initialized.
    // This happens most reliably when the user selects a contact for the child transaction.
    // Afterwards, inheritted fields are updated to match parent values.
    this.childTransaction?.transactionType?.inheritedFields?.forEach((inherittedField) => {
      const childFieldControl = this.childForm.get(this.childTemplateMap[inherittedField]);
      childFieldControl?.enable();
      const value = this.form.get(this.templateMap[inherittedField])?.value;
      if (value !== undefined) {
        childFieldControl?.setValue(value);
        childFieldControl?.updateValueAndValidity();
      }
      childFieldControl?.disable();
    });
  }

  childOnSecondaryContactLookupSelect(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.onSecondaryContactLookupSelect(selectItem, this.childForm, this.childTransaction);
  }
}
