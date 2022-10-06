import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { JsonSchema } from 'app/shared/interfaces/json-schema.interface';
import { TransactionType } from 'app/shared/interfaces/transaction-type.interface';
import { Transaction } from 'app/shared/interfaces/transaction.interface';
import { SchATransaction } from 'app/shared/models/scha-transaction.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { ContactService } from 'app/shared/services/contact.service';
import { TransactionService } from 'app/shared/services/transaction.service';
import { ValidateService } from 'app/shared/services/validate.service';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
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
  get contact(): Contact | undefined {
    return this.transactionType?.contact;
  }
  set contact(contact: Contact | undefined) {
    if (this.transactionType) {
      this.transactionType.contact = contact;
    }
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
    protected contactService: ContactService,
    protected validateService: ValidateService,
    protected confirmationService: ConfirmationService,
    protected fb: FormBuilder,
    protected router: Router,
    protected fecDatePipe: FecDatePipe,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group(this.validateService.getFormGroupFields(this.formProperties));
    this.init(this.form, this.validateService, this.transactionType);
  }

  init(form: FormGroup, validateService: ValidateService, transactionType: TransactionType | undefined) {
    // Initialize validation tracking of current JSON schema and form data
    validateService.formValidatorSchema = transactionType?.schema;
    validateService.formValidatorForm = form;

    // Intialize form on "Individual" entity type
    if (this.isExisting(transactionType?.transaction)) {
      const txn = { ...transactionType?.transaction } as SchATransaction;
      form.patchValue({ ...txn });
      form.get('entity_type')?.disable();
    } else {
      this.resetForm();
      form.get('entity_type')?.enable();
    }

    form
      ?.get('entity_type')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
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
    payload.contact_id = this.contact?.id;

    if (payload.contact_id && this.contact) {
      const transactionContactChanges = this.getFormChangesToTransactionContact();
      if (transactionContactChanges?.length) {
        const confirmationMessage = this.getEditTransactionContactConfirmationMessage(
          transactionContactChanges);
        this.confirmationService.confirm({
          header: 'Confirm',
          icon: 'pi pi-info-circle',
          message: confirmationMessage,
          acceptLabel: 'Continue',
          rejectLabel: 'Cancel',
          accept: () => {
            this.doSave(navigateTo, payload, transactionTypeToAdd);
          },
          reject: () => {
            return;
          },
        });
      } else {
        this.doSave(navigateTo, payload, transactionTypeToAdd);
      }
    } else {
      const confirmationMessage = this.getCreateTransactionContactConfirmationMessage(
        payload.entity_type as ContactTypes);
      this.confirmationService.confirm({
        header: 'Confirm',
        icon: 'pi pi-info-circle',
        message: confirmationMessage,
        acceptLabel: 'Continue',
        rejectLabel: 'Cancel',
        accept: () => {
          this.doSave(navigateTo, payload, transactionTypeToAdd);
        },
        reject: () => {
          return;
        },
      });
    }
  }

  getEditTransactionContactConfirmationMessage(contactChanges: string[]) {
    if (this.contact) {
      const changesMessage = 'Change(s): <ul class="contact-confirm-dialog">'.concat(
        ...contactChanges.map(change => `<li>${change}</li>`, '</ul>'));
      let contactName = this.contact.name;
      if (this.contact.type === ContactTypes.INDIVIDUAL) {
        contactName = `${this.contact.last_name}, ${this.contact.first_name}`;
        contactName += this.contact.middle_name ? ' ' + this.contact.middle_name : '';
      }
      const dateReceived = this.fecDatePipe.transform(
        this.form.get('contribution_date')?.value);
      return `By saving this transaction, you are also updating the contact for ` +
        `<b>${contactName}</b>. This change will only affect transactions with ` +
        `receipt date on or after ${dateReceived}.<br><br>${changesMessage}`;
    }
    return undefined;
  }

  getCreateTransactionContactConfirmationMessage(contactType: ContactTypes) {
    let confirmationContactTitle = '';
    switch (contactType) {
      case ContactTypes.INDIVIDUAL:
        confirmationContactTitle =
          `individual contact for <b>` +
          `${this.form.get('contributor_last_name')?.value}, ` +
          `${this.form.get('contributor_first_name')?.value}</b>`;
        break;
      case ContactTypes.COMMITTEE:
        confirmationContactTitle =
          `committee contact for <b>` + `${this.form.get('contributor_organization_name')?.value}</b>`;
        break;
      case ContactTypes.ORGANIZATION:
        confirmationContactTitle =
          `organization contact for <b>` + `${this.form.get('contributor_organization_name')?.value}</b>`;
        break;
    }
    return `By saving this transaction, you're also creating a new ${confirmationContactTitle}.`
  }

  getFormChangesToTransactionContact() {
    const retval: string[] = [];
    if (this.contact) {
      switch (this.contact.type) {
        case ContactTypes.INDIVIDUAL:
          this.form.get('contributor_last_name')?.value !== this.contact.last_name ?
            retval.push('Updated last name to ' +
              this.form.get('contributor_last_name')?.value) : '';
          this.form.get('contributor_first_name')?.value !== this.contact.first_name ?
            retval.push('Updated first name to ' +
              this.form.get('contributor_first_name')?.value) : '';
          this.form.get('contributor_middle_name')?.value !== this.contact.middle_name ?
            retval.push('Updated middle name to ' +
              this.form.get('contributor_middle_name')?.value) : '';
          this.form.get('contributor_prefix')?.value !== this.contact.prefix ?
            retval.push('Updated prefix to ' +
              this.form.get('contributor_prefix')?.value) : '';
          this.form.get('contributor_suffix')?.value !== this.contact.suffix ?
            retval.push('Updated suffix to ' +
              this.form.get('contributor_suffix')?.value) : '';
          this.form.get('contributor_employer')?.value !== this.contact.employer ?
            retval.push('Updated employer to ' +
              this.form.get('contributor_employer')?.value) : '';
          this.form.get('contributor_occupation')?.value !== this.contact.occupation ?
            retval.push('Updated occupation to ' +
              this.form.get('contributor_occupation')?.value) : '';
          break;
        case ContactTypes.COMMITTEE:
          this.form.get('donor_committee_fec_id')?.value !== this.contact.committee_id ?
            retval.push('Updated committee id to ' +
              this.form.get('donor_committee_fec_id')?.value) : '';
          this.form.get('contributor_organization_name')?.value !== this.contact.name ?
            retval.push('Updated committee name to ' +
              this.form.get('contributor_organization_name')?.value) : '';
          break;
        case ContactTypes.ORGANIZATION:
          this.form.get('contributor_organization_name')?.value !== this.contact.name ?
            retval.push('Updated organization name to ' +
              this.form.get('contributor_organization_name')?.value) : '';
          break;
      }
      this.form.get('contributor_street_1')?.value !== this.contact.street_1 ?
        retval.push('Updated street address to ' +
          this.form.get('contributor_street_1')?.value) : '';
      this.form.get('contributor_street_2')?.value !== this.contact.street_2 ?
        retval.push('Updated apartment, suite, etc. to ' +
          this.form.get('contributor_street_2')?.value) : '';
      this.form.get('contributor_city')?.value !== this.contact.city ?
        retval.push('Updated city to ' +
          this.form.get('contributor_city')?.value) : '';
      this.form.get('contributor_state')?.value !== this.contact.state ?
        retval.push('Updated state to ' +
          this.form.get('contributor_state')?.value) : '';
      this.form.get('contributor_zip')?.value !== this.contact.zip ?
        retval.push('Updated zip to ' +
          this.form.get('contributor_zip')?.value) : ''
    }
    return retval;
  }

  doSave(navigateTo: 'list' | 'add another' | 'add-sub-tran', payload: SchATransaction, transactionTypeToAdd?: string) {
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
    this.doResetForm(this.form);
  }

  doResetForm(form: FormGroup) {
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

  onContactLookupSelect(selectItem: SelectItem<Contact>) {
    this.doContactLookupSelect(selectItem, this.form, this.transactionType);
  }

  doContactLookupSelect(
    selectItem: SelectItem<Contact>,
    form: FormGroup,
    transactionType: TransactionType | undefined
  ) {
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
        if (transactionType) {
          transactionType.contact = value;
        }
      }
    }
  }

  isExisting(transaction: Transaction | undefined): boolean {
    return !!transaction?.id;
  }
}
