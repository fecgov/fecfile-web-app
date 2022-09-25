import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { JsonSchema } from 'app/shared/interfaces/json-schema.interface';
import { TransactionType } from 'app/shared/interfaces/transaction-type.interface';
import { Transaction } from 'app/shared/interfaces/transaction.interface';
import { SchATransaction } from 'app/shared/models/scha-transaction.model';
import { TransactionService } from 'app/shared/services/transaction.service';
import { ValidateService } from 'app/shared/services/validate.service';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { MessageService, SelectItem } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { Contact, ContactTypeLabels, ContactTypes } from '../../models/contact.model';

@Component({
  template: '',
})
export abstract class TransactionTypeBaseComponent implements OnInit, OnDestroy {
  @Input() transactionType: TransactionType | undefined;
  get title(): string | undefined {
    return this.transactionType?.title;
  }
  get contributionPurposeDescrip(): string | undefined {
    return this.transactionType?.contributionPurposeDescripReadonly();
  }
  get schema(): JsonSchema | undefined {
    return this.transactionType?.schema;
  }
  get transaction(): Transaction | undefined {
    return this.transactionType?.transaction;
  }

  abstract formProperties: string[];

  ContactTypes = ContactTypes;
  contactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels);
  stateOptions: PrimeOptions = LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary());
  destroy$: Subject<boolean> = new Subject<boolean>();
  formSubmitted = false;
  memoItemHelpText = 'The dollar amount in a memo item is not incorporated into the total figure for the schedule.';

  form: FormGroup = this.fb.group({});

  constructor(
    protected messageService: MessageService,
    protected transactionService: TransactionService,
    protected validateService: ValidateService,
    protected fb: FormBuilder,
    protected router: Router
  ) {}

  ngOnInit(): void {
    this.init(this.form, this.formProperties, this.validateService, this.transactionType);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  init(
    form: FormGroup,
    formProperties: string[],
    validateService: ValidateService,
    transactionType: TransactionType | undefined
  ) {
    // Intialize FormGroup, this must be done here. Not working when initialized only above the constructor().
    form = this.fb.group(validateService.getFormGroupFields(formProperties));

    // Initialize validation tracking of current JSON schema and form data.
    validateService.formValidatorSchema = transactionType?.schema;
    validateService.formValidatorForm = form;

    // Disable entity type form input field when editing a record.
    if (this.isExisting(transactionType?.transaction)) {
      const txn = { ...transactionType?.transaction } as SchATransaction;
      form.patchValue({ ...txn });
      form.get('entity_type')?.disable();
    } else {
      this.resetForm(form);
      form.get('entity_type')?.enable();
    }

    form
      ?.get('entity_type')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((entityType: string) => this.resetEntityFields(form, entityType));
  }

  save(navigateTo: 'list' | 'add another' | 'add-sub-tran', transactionTypeToAdd?: string) {
    this.formSubmitted = true;

    if (this.form.invalid) {
      return;
    }

    const payload: SchATransaction = this.getPayload(
      this.form,
      this.formProperties,
      this.validateService,
      this.transactionType
    ) as SchATransaction;

    if (this.transaction?.transaction_type_identifier) {
      const fieldsToValidate: string[] = this.getFieldsToValidate(this.validateService, this.transactionType);

      if (payload.id) {
        this.transactionService
          .update(payload, this.transaction.transaction_type_identifier, fieldsToValidate)
          .subscribe((transaction) => {
            this.navigateTo(navigateTo, transaction.id || undefined, transactionTypeToAdd);
          });
      } else {
        this.transactionService
          .create(payload, this.transaction.transaction_type_identifier, fieldsToValidate)
          .subscribe((transaction) => {
            this.navigateTo(navigateTo, transaction.id || undefined, transactionTypeToAdd);
          });
      }
    }
  }

  getPayload(
    form: FormGroup,
    formProperties: string[],
    validateService: ValidateService,
    transactionType: TransactionType | undefined
  ): Transaction {
    return SchATransaction.fromJSON({
      ...transactionType?.transaction,
      ...validateService.getFormValues(form, formProperties),
    }) as Transaction;
  }

  getFieldsToValidate(validateService: ValidateService, transactionType: TransactionType | undefined): string[] {
    const fieldsToValidate: string[] = validateService.getSchemaProperties(transactionType?.schema);
    // Remove properties populated in the back-end from list of properties to validate
    return fieldsToValidate.filter((p) => p !== 'transaction_id' && p !== 'donor_committee_name');
  }

  navigateTo(
    navigateTo: 'list' | 'add another' | 'add-sub-tran' | 'to-parent',
    transactionId?: string,
    transactionTypeToAdd?: string
  ) {
    if (navigateTo === 'add another') {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Transaction Saved',
        life: 3000,
      });
      this.resetForm(this.form);
    } else if (navigateTo === 'add-sub-tran') {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Parent Transaction Saved',
        life: 3000,
      });
      this.router.navigateByUrl(
        `/transactions/report/${this.transaction?.report_id}/list/edit/${transactionId}/create-sub-transaction/${transactionTypeToAdd}`
      );
    } else if (navigateTo === 'to-parent') {
      this.router.navigateByUrl(
        `/transactions/report/${this.transaction?.report_id}/list/edit/${this.transaction?.parent_transaction_id}`
      );
    } else {
      this.router.navigateByUrl(`/transactions/report/${this.transaction?.report_id}/list`);
    }
  }

  protected resetForm(form: FormGroup) {
    this.formSubmitted = false;
    form.reset();
    form.markAsPristine();
    form.markAsUntouched();
    form.patchValue({
      entity_type: this.contactTypeOptions[0]?.code,
      contribution_aggregate: '0',
      memo_code: false,
      contribution_purpose_descrip: this.contributionPurposeDescrip,
    });
  }

  onContactLookupSelect(selectItem: SelectItem<Contact>, form: FormGroup) {
    if (selectItem) {
      const value = selectItem.value;
      if (value) {
        switch (value.type) {
          case ContactTypes.INDIVIDUAL:
            form.get('contributor_last_name')?.setValue(value.last_name);
            form.get('contributor_first_name')?.setValue(value.first_name);
            form.get('contributor_middle_name')?.setValue(value.middle_name);
            form.get('contributor_prefix')?.setValue(value.prefix);
            form.get('contributor_suffix')?.setValue(value.suffix);
            form.get('contributor_employer')?.setValue(value.employer);
            form.get('contributor_occupation')?.setValue(value.occupation);
            break;
          case ContactTypes.COMMITTEE:
            form.get('donor_committee_fec_id')?.setValue(value.committee_id);
            form.get('contributor_organization_name')?.setValue(value.name);
            break;
          case ContactTypes.ORGANIZATION:
            form.get('contributor_organization_name')?.setValue(value.name);
            break;
        }
        form.get('contributor_street_1')?.setValue(value.street_1);
        form.get('contributor_street_2')?.setValue(value.street_2);
        form.get('contributor_city')?.setValue(value.city);
        form.get('contributor_state')?.setValue(value.state);
        form.get('contributor_zip')?.setValue(value.zip);
      }
    }
  }

  isExisting(transaction: Transaction | undefined) {
    return !!transaction?.id;
  }

  resetEntityFields(form: FormGroup, entityType: string) {
    if (entityType === ContactTypes.INDIVIDUAL) {
      form.get('contributor_organization_name')?.reset();
    }
    if (entityType === ContactTypes.COMMITTEE) {
      const fieldsToReset: string[] = [
        'contributor_last_name',
        'contributor_first_name',
        'contributor_middle_name',
        'contributor_prefix',
        'contributor_suffix',
        'contributor_employer',
        'contributor_occupation',
      ];
      fieldsToReset.forEach((field) => form.get(field)?.reset());
    }
  }
}
