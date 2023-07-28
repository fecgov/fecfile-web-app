import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationAction, NavigationEvent } from 'app/shared/models/transaction-navigation-controls.model';
import {
  TemplateMapKeyType,
  TransactionTemplateMapType,
  TransactionType,
} from 'app/shared/models/transaction-type.model';
import { ScheduleTransaction, Transaction } from 'app/shared/models/transaction.model';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { getContactTypeOptions } from 'app/shared/utils/transaction-type-properties';
import { ValidateUtils } from 'app/shared/utils/validate.utils';
import { SelectItem } from 'primeng/api';
import { BehaviorSubject, Subject, forkJoin, of, takeUntil } from 'rxjs';
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
  childFormProperties: string[] = [];
  childTransactionType?: TransactionType;
  childTransaction?: Transaction;
  childContactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels);
  childForm: FormGroup = this.fb.group({});
  childContactId$: Subject<string> = new BehaviorSubject<string>('');
  childPurposeDescriptionLabel = '';
  childTemplateMap: TransactionTemplateMapType = {} as TransactionTemplateMapType;
  useParentContact = false;
  childMemoCodeCheckboxLabel$ = of('');

  override ngOnInit(): void {
    // Initialize primary form.
    super.ngOnInit();

    // Initialize child form.
    this.childTransaction = (this.transaction?.children ?? [])[0];
    this.childTransactionType = this.childTransaction?.transactionType;
    if (!this.childTransactionType?.templateMap) {
      throw new Error('Fecfile: Template map not found for double transaction component');
    }
    this.childTemplateMap = this.childTransactionType.templateMap;
    this.childContactTypeOptions = getContactTypeOptions(this.childTransactionType.contactTypeOptions ?? []);
    this.childFormProperties = this.childTransactionType.getFormControlNames(this.childTemplateMap);
    this.childForm = this.fb.group(ValidateUtils.getFormGroupFields(this.childFormProperties));

    if (
      this.childTransactionType?.inheritedFields?.includes('memo_code' as TemplateMapKeyType) &&
      this.transactionType
    ) {
      this.childMemoCodeCheckboxLabel$ = this.memoCodeCheckboxLabel$;
    } else {
      this.childMemoCodeCheckboxLabel$ = this.getMemoCodeCheckboxLabel$(this.childForm, this.childTransactionType);
    }

    TransactionFormUtils.onInit(this, this.childForm, this.childTransaction, this.childContactId$);
    this.childOnInit();
  }

  childOnInit() {
    // Determine if amount should always be negative and then force it to be so if needed
    if (this.childTransactionType?.negativeAmountValueOnly && this.childTemplateMap?.amount) {
      this.childForm
        .get(this.childTemplateMap.amount)
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((amount) => {
          if (+amount > 0) {
            this.childForm.get(this.childTemplateMap.amount)?.setValue(-1 * amount);
          }
        });
    }

    if (this.childTransactionType?.generatePurposeDescriptionLabel) {
      this.childPurposeDescriptionLabel = this.childTransactionType?.generatePurposeDescriptionLabel();
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
    this.childTransactionType?.parentTriggerFields?.forEach((triggerField) => {
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

    this.useParentContact = !!this.childTransactionType?.useParentContact;

    // Inheritted fields must match parent values
    this.childTransactionType?.inheritedFields?.forEach((inherittedField) => {
      this.form
        .get(this.templateMap[inherittedField])
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((value) => {
          this.childForm.get(this.childTemplateMap[inherittedField])?.setValue(value);
        });
      this.childForm.get(this.childTemplateMap[inherittedField])?.disable();
    });
  }

  override onContactLookupSelect(selectItem: SelectItem<Contact>): void {
    super.onContactLookupSelect(selectItem);
    if (this.useParentContact && this.childTransaction && this.transaction?.contact_1) {
      this.childTransaction.contact_1 = this.transaction.contact_1;
      this.childForm.get('entity_type')?.setValue(selectItem.value.type);
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
        [this.childTemplateMap.purpose_description]: this.childTransactionType?.generatePurposeDescriptionWrapper(
          this.childTransaction
        ),
      });
    }
  }

  override save(navigationEvent: NavigationEvent) {
    this.formSubmitted = true;

    // update all contacts with changes from form.
    TransactionContactUtils.updateContactWithForm(this.transaction!, this.templateMap, this.form);
    TransactionContactUtils.updateContactWithForm(this.childTransaction!, this.childTemplateMap, this.childForm);

    const payload: Transaction = TransactionFormUtils.getPayloadTransaction(
      this.transaction,
      this.form,
      this.formProperties
    );

    payload.children = [
      TransactionFormUtils.getPayloadTransaction(this.childTransaction, this.childForm, this.childFormProperties),
    ];
    payload.children[0].report_id = payload.report_id;

    if (payload.transaction_type_identifier) {
      const responseFromApi = this.writeToApi(payload);
      responseFromApi.subscribe((transaction) => {
        navigationEvent.transaction = this.transactionType?.updateParentOnSave ? payload : transaction;
        this.navigateTo(navigationEvent);
      });
    }
  }

  override handleNavigate(navigationEvent: NavigationEvent): void {
    if (navigationEvent.action === NavigationAction.SAVE) {
      if (this.childForm.invalid || this.form.invalid || !this.transaction || !this.childTransaction) {
        return;
      }
      const confirmations$ = [...this.confirmWithUser(this.transaction, this.form)];
      if (!this.childTransactionType?.useParentContact) {
        confirmations$.push(...this.confirmWithUser(this.childTransaction, this.childForm, 'childDialog'));
      }
      if (confirmations$.length > 0) {
        forkJoin(confirmations$).subscribe((confirmations: boolean[]) => {
          // if every confirmation was accepted
          if (confirmations.every((confirmation) => confirmation)) this.save(navigationEvent);
        });
      } else {
        this.save(navigationEvent);
      }
    } else {
      this.navigateTo(navigationEvent);
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
    this.childTransactionType?.inheritedFields?.forEach((inherittedField) => {
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
