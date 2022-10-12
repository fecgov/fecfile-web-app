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
import {
  of,
  Subject,
  takeUntil,
  Observable,
  combineLatest,
  switchMap,
  combineLatestWith,
  BehaviorSubject,
  startWith,
} from 'rxjs';
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
  contactId$: Subject<string> = new BehaviorSubject<string>('');
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
    // Intialize FormGroup, this must be done here. Not working when initialized only above the constructor().
    this.form = this.fb.group(this.validateService.getFormGroupFields(this.formProperties));

    // Initialize validation tracking of current JSON schema and form data
    this.validateService.formValidatorSchema = this.schema;
    this.validateService.formValidatorForm = this.form;

    // Intialize form on "Individual" entity type
    if (this.isExisting()) {
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

    const contribution_amount$: Observable<any> =
      this.form
        ?.get('contribution_amount')
        ?.valueChanges.pipe(startWith(this.form?.get('contribution_amount')?.value)) || of(undefined);
    const previous_transaction$: Observable<any> =
      this.form?.get('contribution_date')?.valueChanges.pipe(
        startWith(this.form?.get('contribution_date')?.value),
        combineLatestWith(this.contactId$),
        switchMap(([contribution_date, contactId]) => {
          if (contribution_date && contactId) {
            return this.transactionService.getPreviousTransaction(contactId, contribution_date);
          }
          return of(undefined);
        })
      ) || of(undefined);
    combineLatest([contribution_amount$, previous_transaction$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([contribution_amount, previous_transaction]) => {
        const previousAggregate = +previous_transaction?.contribution_aggregate || 0;
        this.form?.get('contribution_aggregate')?.setValue(+contribution_amount + previousAggregate);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.contactId$.complete();
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

  doSave(navigateTo: 'list' | 'add another' | 'add-sub-tran', payload: SchATransaction, transactionTypeToAdd?: string) {
    this.createContactIfNeeded(this.form).subscribe((contact) => {
      this.contact = contact;
      if (this.transaction?.transaction_type_identifier) {
        let fieldsToValidate: string[] = this.validateService.getSchemaProperties(this.schema);
        const fieldsToSkip: string[] = ['transaction_id', 'donor_committee_name', 'contribution_aggregate'];
        // Remove properties populated in the back-end from list of properties to validate
        fieldsToValidate = fieldsToValidate.filter((p) => !fieldsToSkip.includes(p));

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
      if (value) {
        switch (value.type) {
          case ContactTypes.INDIVIDUAL:
            this.form.get('contributor_last_name')?.setValue(value.last_name);
            this.form.get('contributor_first_name')?.setValue(value.first_name);
            this.form.get('contributor_middle_name')?.setValue(value.middle_name);
            this.form.get('contributor_prefix')?.setValue(value.prefix);
            this.form.get('contributor_suffix')?.setValue(value.suffix);
            this.form.get('contributor_employer')?.setValue(value.employer);
            this.form.get('contributor_occupation')?.setValue(value.occupation);
            break;
          case ContactTypes.COMMITTEE:
            this.form.get('donor_committee_fec_id')?.setValue(value.committee_id);
            this.form.get('contributor_organization_name')?.setValue(value.name);
            break;
          case ContactTypes.ORGANIZATION:
            this.form.get('contributor_organization_name')?.setValue(value.name);
            break;
        }
        this.form.get('contributor_street_1')?.setValue(value.street_1);
        this.form.get('contributor_street_2')?.setValue(value.street_2);
        this.form.get('contributor_city')?.setValue(value.city);
        this.form.get('contributor_state')?.setValue(value.state);
        this.form.get('contributor_zip')?.setValue(value.zip);
        this.contact = value;
        this.contactId$.next(this.contact?.id || '');
      }
    }
  }

  isExisting() {
    return !!this.transaction?.id;
  }
}
