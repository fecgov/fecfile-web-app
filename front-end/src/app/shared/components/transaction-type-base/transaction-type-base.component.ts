import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { JsonSchema } from 'app/shared/interfaces/json-schema.interface';
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
  @Input() title: string | undefined;
  @Input() schema: JsonSchema | undefined;
  @Input() transaction: Transaction | undefined;
  @Input() contributionPurposeDescrip: string | undefined;

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
  ) { }

  ngOnInit(): void {
    // Intialize FormGroup, this must be done here. Not working when initialized only above the constructor().
    this.form = this.fb.group(this.validateService.getFormGroupFields(this.formProperties));

    // Initialize validation tracking of current JSON schema and form data
    this.validateService.formValidatorSchema = this.schema;
    this.validateService.formValidatorForm = this.form;

    // Intialize form on "Individual" entity type
    if (this.transaction?.id) {
      const txn = { ...this.transaction } as SchATransaction;
      this.form.patchValue({ ...txn });
      this.form.get('entity_type')?.disable();
    } else {
      this.resetForm();
      this.form.get('entity_type')?.enable();
    }

    this.form
      ?.get('entity_type')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => {
        if (value === ContactTypes.INDIVIDUAL || value === ContactTypes.CANDIDATE) {
          this.form.get('contributor_organization_name')?.reset();
        }
        if (value === ContactTypes.ORGANIZATION || value === ContactTypes.COMMITTEE) {
          this.form.get('contributor_last_name')?.reset();
          this.form.get('contributor_first_name')?.reset();
          this.form.get('contributor_middle_name')?.reset();
          this.form.get('contributor_prefix')?.reset();
          this.form.get('contributor_suffix')?.reset();
          this.form.get('contributor_employer')?.reset();
          this.form.get('contributor_occupation')?.reset();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  save(navigateTo: 'list' | 'add another' | 'add-sub-tran', transactionTypeToAdd?: string) {
    this.formSubmitted = true;

    if (this.form.invalid) {
      return;
    }

    const payload: SchATransaction = SchATransaction.fromJSON({
      ...this.transaction,
      ...this.validateService.getFormValues(this.form, this.formProperties),
    });

    if (this.transaction?.transaction_type_identifier) {
      let fieldsToValidate: string[] = this.validateService.getSchemaProperties(this.schema);
      // Remove properties populated in the back-end from list of properties to validate
      fieldsToValidate = fieldsToValidate.filter((p) => p !== 'transaction_id' && p !== 'donor_committee_name');

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
      this.resetForm();
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

  protected resetForm() {
    this.formSubmitted = false;
    this.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.patchValue({
      entity_type: this.contactTypeOptions[0]?.code,
      contribution_aggregate: '0',
      memo_code: false,
      contribution_purpose_descrip: this.contributionPurposeDescrip,
    });
  }

  onContactLookupSelect(selectItem: SelectItem<Contact>) {
    if (selectItem) {
      const value = selectItem.value;
      if (value && value.type === ContactTypes.INDIVIDUAL) {
        this.form.get('contributor_last_name')?.setValue(value.last_name);
        this.form.get('contributor_first_name')?.setValue(value.first_name);
        this.form.get('contributor_middle_name')?.setValue(value.middle_name);
        this.form.get('contributor_prefix')?.setValue(value.prefix);
        this.form.get('contributor_suffix')?.setValue(value.suffix);
        this.form.get('contributor_employer')?.setValue(value.employer);
        this.form.get('contributor_occupation')?.setValue(value.occupation);
      }
      this.form.get('contributor_street_1')?.setValue(value.street_1);
      this.form.get('contributor_street_2')?.setValue(value.street_2);
      this.form.get('contributor_city')?.setValue(value.city);
      this.form.get('contributor_state')?.setValue(value.state);
      this.form.get('contributor_zip')?.setValue(value.zip);
    }
  }

}
