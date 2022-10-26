import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { JsonSchema } from 'app/shared/interfaces/json-schema.interface';
import { TransactionType } from 'app/shared/interfaces/transaction-type.interface';
import { Transaction } from 'app/shared/interfaces/transaction.interface';
import { SchATransaction } from 'app/shared/models/scha-transaction.model';
import {
  NavigationAction,
  NavigationControl,
  NavigationDestination,
} from 'app/shared/models/transaction-navigation-controls.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { ContactService } from 'app/shared/services/contact.service';
import { TransactionService } from 'app/shared/services/transaction.service';
import { ValidateService } from 'app/shared/services/validate.service';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { BehaviorSubject, combineLatestWith, Observable, of, startWith, Subject, switchMap, takeUntil } from 'rxjs';
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
  get aggregationGroup(): string | undefined {
    return (this.transactionType?.transaction as SchATransaction).aggregation_group;
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
    protected router: Router,
    protected fecDatePipe: FecDatePipe
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
      this.contactId$.next(txn.contact_id || '');
    } else {
      this.resetForm();
      this.form.get('entity_type')?.enable();
      this.contactId$.next('');
    }

    this.form
      .get('entity_type')
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

    this.form
      ?.get('contribution_aggregate')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.form.get('contributor_employer')?.updateValueAndValidity();
        this.form.get('contributor_occupation')?.updateValueAndValidity();
      });

    const previous_transaction$: Observable<Transaction | undefined> =
      this.form.get('contribution_date')?.valueChanges.pipe(
        startWith(this.form.get('contribution_date')?.value),
        combineLatestWith(this.contactId$),
        switchMap(([contribution_date, contactId]) => {
          if (contribution_date && contactId && this.aggregationGroup) {
            return this.transactionService.getPreviousTransaction(
              this.transaction?.id || '',
              contactId,
              contribution_date,
              this.aggregationGroup
            );
          }
          return of(undefined);
        })
      ) || of(undefined);
    this.form
      .get('contribution_amount')
      ?.valueChanges.pipe(
        startWith(this.form.get('contribution_amount')?.value),
        combineLatestWith(previous_transaction$),
        takeUntil(this.destroy$)
      )
      .subscribe(([contribution_amount, previous_transaction]) => {
        const previousAggregate = +((previous_transaction as SchATransaction)?.contribution_aggregate || 0);
        this.form.get('contribution_aggregate')?.setValue(+contribution_amount + previousAggregate);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.contactId$.complete();
  }

  save(navigateTo: NavigationDestination, transactionTypeToAdd?: string) {
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
        const confirmationMessage = this.getEditTransactionContactConfirmationMessage(transactionContactChanges);
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
        payload.entity_type as ContactTypes
      );
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
        ...contactChanges.map((change) => `<li>${change}</li>`, '</ul>')
      );
      let contactName = this.contact.name;
      if (this.contact.type === ContactTypes.INDIVIDUAL) {
        contactName = `${this.contact.last_name}, ${this.contact.first_name}`;
        contactName += this.contact.middle_name ? ' ' + this.contact.middle_name : '';
      }
      const dateReceived = this.fecDatePipe.transform(this.form.get('contribution_date')?.value);
      return (
        `By saving this transaction, you are also updating the contact for ` +
        `<b>${contactName}</b>. This change will only affect transactions with ` +
        `receipt date on or after ${dateReceived}.<br><br>${changesMessage}`
      );
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
    return `By saving this transaction, you're also creating a new ${confirmationContactTitle}.`;
  }

  /**
   * This method returns the differences between the transaction
   * form's contact section and its database contact in prose
   * for the UI as a string[] (one entry for each change).
   * @returns string[] containing the changes in prose for the UI.
   */
  getFormChangesToTransactionContact() {
    const retval: string[] = [];
    if (this.contact) {
      switch (this.contact.type) {
        case ContactTypes.INDIVIDUAL:
          retval.push(...this.getIndFormChangesToTransactionContact());
          break;
        case ContactTypes.COMMITTEE:
          retval.push(...this.getComFormChangesToTransactionContact());
          break;
        case ContactTypes.ORGANIZATION:
          retval.push(...this.getOrgFormChangesToTransactionContact());
          break;
      }
      if (this.form.get('contributor_street_1')?.value !== this.contact.street_1)
        retval.push('Updated street address to ' + this.form.get('contributor_street_1')?.value);
      if (this.form.get('contributor_street_2')?.value !== this.contact.street_2)
        retval.push('Updated apartment, suite, etc. to ' + this.form.get('contributor_street_2')?.value);
      if (this.form.get('contributor_city')?.value !== this.contact.city)
        retval.push('Updated city to ' + this.form.get('contributor_city')?.value);
      if (this.form.get('contributor_state')?.value !== this.contact.state)
        retval.push('Updated state to ' + this.form.get('contributor_state')?.value);
      if (this.form.get('contributor_zip')?.value !== this.contact.zip)
        retval.push('Updated zip to ' + this.form.get('contributor_zip')?.value);
    }
    return retval;
  }

  getIndFormChangesToTransactionContact() {
    const retval: string[] = [];
    if (this.contact) {
      if (this.form.get('contributor_last_name')?.value !== this.contact.last_name)
        retval.push('Updated last name to ' + this.form.get('contributor_last_name')?.value);
      if (this.form.get('contributor_first_name')?.value !== this.contact.first_name)
        retval.push('Updated first name to ' + this.form.get('contributor_first_name')?.value);
      if (this.form.get('contributor_middle_name')?.value !== this.contact.middle_name)
        retval.push('Updated middle name to ' + this.form.get('contributor_middle_name')?.value);
      if (this.form.get('contributor_prefix')?.value !== this.contact.prefix)
        retval.push('Updated prefix to ' + this.form.get('contributor_prefix')?.value);
      if (this.form.get('contributor_suffix')?.value !== this.contact.suffix)
        retval.push('Updated suffix to ' + this.form.get('contributor_suffix')?.value);
      if (this.form.get('contributor_employer')?.value !== this.contact.employer)
        retval.push('Updated employer to ' + this.form.get('contributor_employer')?.value);
      if (this.form.get('contributor_occupation')?.value !== this.contact.occupation)
        retval.push('Updated occupation to ' + this.form.get('contributor_occupation')?.value);
    }
    return retval;
  }

  getComFormChangesToTransactionContact() {
    const retval: string[] = [];
    if (this.contact) {
      if (this.form.get('donor_committee_fec_id')?.value !== this.contact.committee_id)
        retval.push('Updated committee id to ' + this.form.get('donor_committee_fec_id')?.value);
      if (this.form.get('contributor_organization_name')?.value !== this.contact.name)
        retval.push('Updated committee name to ' + this.form.get('contributor_organization_name')?.value);
    }
    return retval;
  }

  getOrgFormChangesToTransactionContact() {
    const retval: string[] = [];
    if (this.contact) {
      if (this.form.get('contributor_organization_name')?.value !== this.contact.name)
        retval.push('Updated organization name to ' + this.form.get('contributor_organization_name')?.value);
    }
    return retval;
  }

  doSave(navigateTo: NavigationDestination, payload: SchATransaction, transactionTypeToAdd?: string) {
    if (this.transaction?.transaction_type_identifier) {
      let fieldsToValidate: string[] = this.validateService.getSchemaProperties(this.schema);
      // Remove properties populated in the back-end from list of properties to validate
      fieldsToValidate = fieldsToValidate.filter((p) => p !== 'transaction_id' && p !== 'donor_committee_name');

      payload.contact = this.contact;
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

  getNavigationControls(section: 'inline' | 'cancel' | 'continue'): NavigationControl[] {
    let controls: NavigationControl[] = [];
    if (section === 'inline') {
      controls = this.transactionType?.navigationControls?.inlineControls || [];
    } else if (section === 'cancel') {
      controls = this.transactionType?.navigationControls?.cancelControls || [];
    } else if (section === 'continue') {
      controls = this.transactionType?.navigationControls?.continueControls || [];
    }
    return controls.filter((control: NavigationControl) => {
      return !control.condition || control.condition(this.transaction);
    });
  }

  handleNavigate(navigationControl: NavigationControl): void {
    if (navigationControl.navigationAction === NavigationAction.SAVE) {
      this.save(navigationControl.navigationDestination);
    } else {
      this.navigateTo(navigationControl.navigationDestination);
    }
  }

  navigateTo(navigateTo: NavigationDestination, transactionId?: string, transactionTypeToAdd?: string) {
    if (navigateTo === NavigationDestination.ANOTHER) {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Transaction Saved',
        life: 3000,
      });
      this.resetForm();
    } else if (navigateTo === NavigationDestination.CHILD) {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Parent Transaction Saved',
        life: 3000,
      });
      this.router.navigateByUrl(
        `/transactions/report/${this.transaction?.report_id}/list/edit/${transactionId}/create-sub-transaction/${transactionTypeToAdd}`
      );
    } else if (navigateTo === NavigationDestination.PARENT) {
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
