import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { JsonSchema } from 'app/shared/interfaces/json-schema.interface';
import { TransactionType } from 'app/shared/interfaces/transaction-type.interface';
import { Transaction } from 'app/shared/interfaces/transaction.interface';
import { SchATransaction } from 'app/shared/models/scha-transaction.model';
import { ContactService } from 'app/shared/services/contact.service';
import { TransactionService } from 'app/shared/services/transaction.service';
import { ValidateService } from 'app/shared/services/validate.service';
import { CountryCodeLabels, LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { of, Subject, takeUntil } from 'rxjs';
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

    if (this.contact?.id) {
      this.doSave(navigateTo, payload, transactionTypeToAdd);
    } else {
      const payloadContactType = payload.entity_type as ContactTypes;
      let confirmationContactTitle = '';
      switch (payloadContactType) {
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
      this.confirmationService.confirm({
        header: 'Confirm',
        icon: 'pi pi-info-circle',
        message: `By saving this transaction, you're also creating a new ` + `${confirmationContactTitle}.`,
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

  doSave(navigateTo: 'list' | 'add another' | 'add-sub-tran', payload: SchATransaction, transactionTypeToAdd?: string) {
    this.createContactIfNeeded(this.form).subscribe((contact) => {
      this.contact = contact;
      if (this.transaction?.transaction_type_identifier) {
        const fieldsToValidate: string[] = this.getFieldsToValidate(this.validateService, this.transactionType);

        payload.contact_id = this.contact?.id;
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
    });
  }

  createContactIfNeeded(form: FormGroup) {
    let contact = this.contact;
    if (!contact) {
      contact = new Contact();
      contact.type = form.get('entity_type')?.value;
      switch (contact.type) {
        case ContactTypes.INDIVIDUAL:
          contact.last_name = form.get('contributor_last_name')?.value;
          contact.first_name = form.get('contributor_first_name')?.value;
          contact.middle_name = form.get('contributor_middle_name')?.value;
          contact.prefix = form.get('contributor_prefix')?.value;
          contact.suffix = form.get('contributor_suffix')?.value;
          contact.employer = form.get('contributor_employer')?.value;
          contact.occupation = form.get('contributor_occupation')?.value;
          break;
        case ContactTypes.COMMITTEE:
          contact.committee_id = form.get('donor_committee_fec_id')?.value;
          contact.name = form.get('contributor_organization_name')?.value;
          break;
        case ContactTypes.ORGANIZATION:
        case ContactTypes.CANDIDATE:
          contact.name = form.get('contributor_organization_name')?.value;
          break;
      }
      contact.country = CountryCodeLabels[0][0];
      contact.street_1 = form.get('contributor_street_1')?.value;
      contact.street_2 = form.get('contributor_street_2')?.value;
      contact.city = form.get('contributor_city')?.value;
      contact.state = form.get('contributor_state')?.value;
      contact.zip = form.get('contributor_zip')?.value;
    }

    if (!contact.id) {
      return this.contactService.create(contact);
    }
    return of(contact);
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

  onContactLookupSelect(selectItem: SelectItem<Contact>) {
    this.updateFormFromContactLookup(selectItem, this.form);
  }

  updateFormFromContactLookup(selectItem: SelectItem<Contact>, form: FormGroup) {
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
        this.form.get('contributor_street_1')?.setValue(value.street_1);
        this.form.get('contributor_street_2')?.setValue(value.street_2);
        this.form.get('contributor_city')?.setValue(value.city);
        this.form.get('contributor_state')?.setValue(value.state);
        this.form.get('contributor_zip')?.setValue(value.zip);
        this.contact = value;
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
