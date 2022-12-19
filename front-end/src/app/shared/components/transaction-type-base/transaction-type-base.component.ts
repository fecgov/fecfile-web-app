import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionType } from 'app/shared/interfaces/transaction-type.interface';
import { Transaction } from 'app/shared/interfaces/transaction.interface';
import { MemoText } from 'app/shared/models/memo-text.model';
import {
  AggregationGroups,
  SchATransaction,
  ScheduleATransactionTypes,
} from 'app/shared/models/scha-transaction.model';
import {
  NavigationAction,
  NavigationControl,
  NavigationDestination,
  TransactionNavigationControls,
} from 'app/shared/models/transaction-navigation-controls.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { ContactService } from 'app/shared/services/contact.service';
import { TransactionService } from 'app/shared/services/transaction.service';
import { ValidateService } from 'app/shared/services/validate.service';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { BehaviorSubject, combineLatestWith, Observable, of, startWith, Subject, switchMap, takeUntil } from 'rxjs';
import { Contact, ContactFields, ContactTypeLabels, ContactTypes } from '../../models/contact.model';
import { TransactionTypeResolver } from '../../../shared/resolvers/transaction-type.resolver';
import { TransactionTypeUtils } from 'app/shared/utils/transaction-type.utils';

@Component({
  template: '',
})
export abstract class TransactionTypeBaseComponent implements OnInit, OnDestroy {
  @Input() transactionType: TransactionType | undefined;

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
    this.form = this.fb.group(this.validateService.getFormGroupFields(this.formProperties));
    this.doInit(this.form, this.validateService, this.transactionType, this.contactId$);
  }

  doInit(
    form: FormGroup,
    validateService: ValidateService,
    transactionType: TransactionType | undefined,
    contactId$: Subject<string>
  ): void {
    // Initialize validation tracking of current JSON schema and form data
    validateService.formValidatorSchema = transactionType?.schema;
    validateService.formValidatorForm = form;

    // Intialize form values
    if (this.isExisting(transactionType?.transaction)) {
      const txn = { ...transactionType?.transaction } as SchATransaction;
      form.patchValue({ ...txn });

      this.patchMemoText(transactionType, form);

      form.get('entity_type')?.disable();
      contactId$.next(txn.contact_id || '');
    } else {
      this.resetForm();
      form.get('entity_type')?.enable();
      this.contactId$.next('');
    }

    form
      .get('entity_type')
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

    form
      ?.get('contribution_aggregate')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        form.get('contributor_employer')?.updateValueAndValidity();
        form.get('contributor_occupation')?.updateValueAndValidity();
      });

    const previous_transaction$: Observable<Transaction | undefined> =
      form.get('contribution_date')?.valueChanges.pipe(
        startWith(form.get('contribution_date')?.value),
        combineLatestWith(contactId$),
        switchMap(([contribution_date, contactId]) => {
          const aggregation_group: AggregationGroups | undefined = (transactionType?.transaction as SchATransaction)
            ?.aggregation_group;
          if (contribution_date && contactId && aggregation_group) {
            return this.transactionService.getPreviousTransaction(
              transactionType?.transaction?.id || '',
              contactId,
              contribution_date,
              aggregation_group
            );
          }
          return of(undefined);
        })
      ) || of(undefined);
    form
      .get('contribution_amount')
      ?.valueChanges.pipe(
        startWith(form.get('contribution_amount')?.value),
        combineLatestWith(previous_transaction$),
        takeUntil(this.destroy$)
      )
      .subscribe(([contribution_amount, previous_transaction]) => {
        const previousAggregate = +((previous_transaction as SchATransaction)?.contribution_aggregate || 0);
        form.get('contribution_aggregate')?.setValue(+contribution_amount + previousAggregate);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.contactId$.complete();
  }

  // prettier-ignore
  retrieveMemoText(transactionType: TransactionType, form: FormGroup, formValues: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    const text = form.get('memo_text_input')?.value;
    if (text && text.length > 0) {
      const memo_text = MemoText.fromJSON({
        text4000: text,
        report_id: this.transactionType?.transaction?.report_id,
        rec_type: 'TEXT',
        filer_committee_id_number: this.transactionType?.transaction?.filer_committee_id_number,
        transaction_id_number: '',
        back_reference_sched_form_name: this.transactionType?.transaction?.form_type,
      });

      if (transactionType.transaction?.id) {
        memo_text.transaction_uuid = transactionType.transaction.id;
      }

      formValues['memo_text'] = memo_text;
    } else {
      formValues['memo_text'] = undefined;
    }

    return formValues;
  }

  patchMemoText(transactionType: TransactionType | undefined, form: FormGroup) {
    const memo_text = transactionType?.transaction?.memo_text;
    if (memo_text?.text4000) {
      form.patchValue({ memo_text_input: memo_text.text4000 });
    }
  }

  save(navigateTo: NavigationDestination, transactionTypeToAdd?: ScheduleATransactionTypes) {
    this.formSubmitted = true;

    if (this.form.invalid) {
      return;
    }

    console.log(this.transactionType);
    const transaction = this.transactionType?.transaction;
    if (transaction && transaction.children) {
      for (const child of transaction.children) {
        console.log('Child:', child);
        if (child.transaction_type_identifier) {
          const transactionType = TransactionTypeUtils.factory(child.transaction_type_identifier) as TransactionType;
          if (transactionType.generateContributionPurposeDescription) {
            const newDescrip = transactionType.generateContributionPurposeDescription();
          }
        }
      }
    }

    const payload: Transaction = this.getPayloadTransaction(
      this.transactionType,
      this.validateService,
      this.form,
      this.formProperties
    );

    this.confirmSave(payload, this.form, this.doSave, navigateTo, payload, transactionTypeToAdd);
  }

  getPayloadTransaction(
    transactionType: TransactionType | undefined,
    validateService: ValidateService,
    form: FormGroup,
    formProperties: string[]
  ) {
    let formValues = validateService.getFormValues(form, formProperties);
    if (transactionType) formValues = this.retrieveMemoText(transactionType, form, formValues);

    const payload: Transaction = SchATransaction.fromJSON({
      ...transactionType?.transaction,
      ...formValues,
    });
    payload.contact_id = payload.contact?.id;

    let fieldsToValidate: string[] = validateService.getSchemaProperties(transactionType?.schema);
    // Remove properties that are populated in the back-end from list of properties to validate
    fieldsToValidate = fieldsToValidate.filter(
      (p) =>
        ![
          'transaction_id',
          'donor_committee_name',
          'back_reference_tran_id_number',
          'back_reference_sched_name',
        ].includes(p)
    );
    payload.fields_to_validate = fieldsToValidate;
    function addFieldsToValidate(transaction: Transaction) {
      transaction.fields_to_validate = fieldsToValidate;
      if (transaction.children) {
        transaction.children.forEach((transaction) => addFieldsToValidate(transaction));
      }
    }
    addFieldsToValidate(payload);
    return payload;
  }

  confirmSave(
    confirmTransaction: Transaction,
    form: FormGroup,
    acceptCallback: (
      navigateTo: NavigationDestination,
      payload: Transaction,
      transactionTypeToAdd?: ScheduleATransactionTypes
    ) => void,
    navigateTo: NavigationDestination,
    payload: Transaction,
    transactionTypeToAdd?: ScheduleATransactionTypes,
    targetDialog: 'dialog' | 'childDialog' = 'dialog'
  ) {
    if (confirmTransaction.contact_id && confirmTransaction.contact) {
      const transactionContactChanges = this.setTransactionContactFormChanges(form, confirmTransaction.contact);
      if (transactionContactChanges?.length) {
        const confirmationMessage = this.getEditTransactionContactConfirmationMessage(
          transactionContactChanges,
          confirmTransaction.contact,
          form
        );
        this.confirmationService.confirm({
          key: targetDialog,
          header: 'Confirm',
          icon: 'pi pi-info-circle',
          message: confirmationMessage,
          acceptLabel: 'Continue',
          rejectLabel: 'Cancel',
          accept: () => {
            acceptCallback.call(this, navigateTo, payload, transactionTypeToAdd);
          },
          reject: () => {
            return;
          },
        });
      } else {
        acceptCallback.call(this, navigateTo, payload, transactionTypeToAdd);
      }
    } else {
      const confirmationMessage = this.getCreateTransactionContactConfirmationMessage(
        (confirmTransaction as SchATransaction).entity_type as ContactTypes,
        form
      );
      this.confirmationService.confirm({
        key: targetDialog,
        header: 'Confirm',
        icon: 'pi pi-info-circle',
        message: confirmationMessage,
        acceptLabel: 'Continue',
        rejectLabel: 'Cancel',
        accept: () => {
          acceptCallback.call(this, navigateTo, payload, transactionTypeToAdd);
        },
        reject: () => {
          return;
        },
      });
    }
  }

  getEditTransactionContactConfirmationMessage(
    contactChanges: string[],
    contact: Contact | undefined,
    form: FormGroup
  ): string | undefined {
    if (contact) {
      const changesMessage = 'Change(s): <ul class="contact-confirm-dialog">'.concat(
        ...contactChanges.map((change) => `<li>${change}</li>`, '</ul>')
      );
      let contactName = contact.name;
      if (contact.type === ContactTypes.INDIVIDUAL) {
        contactName = `${contact.last_name}, ${contact.first_name}`;
        contactName += contact.middle_name ? ' ' + contact.middle_name : '';
      }
      const dateReceived = this.fecDatePipe.transform(form.get('contribution_date')?.value);
      return (
        `By saving this transaction, you are also updating the contact for ` +
        `<b>${contactName}</b>. This change will only affect transactions with ` +
        `receipt date on or after ${dateReceived}.<br><br>${changesMessage}`
      );
    }
    return undefined;
  }

  getCreateTransactionContactConfirmationMessage(contactType: ContactTypes, form: FormGroup): string {
    let confirmationContactTitle = '';
    switch (contactType) {
      case ContactTypes.INDIVIDUAL:
        confirmationContactTitle =
          `individual contact for <b>` +
          `${form.get('contributor_last_name')?.value}, ` +
          `${form.get('contributor_first_name')?.value}</b>`;
        break;
      case ContactTypes.COMMITTEE:
        confirmationContactTitle =
          `committee contact for <b>` + `${form.get('contributor_organization_name')?.value}</b>`;
        break;
      case ContactTypes.ORGANIZATION:
        confirmationContactTitle =
          `organization contact for <b>` + `${form.get('contributor_organization_name')?.value}</b>`;
        break;
    }
    return `By saving this transaction, you're also creating a new ${confirmationContactTitle}.`;
  }

  /**
   * This method returns the differences between the transaction
   * form's contact section and its database contact in prose
   * for the UI as a string[] (one entry for each change) after
   * first setting these values on the Contact object.
   * @returns string[] containing the changes in prose for the UI.
   */
  setTransactionContactFormChanges(form: FormGroup, contact: Contact | undefined): string[] {
    if (contact) {
      return Object.entries(ContactFields)
        .map(([field, label]: string[]) => {
          const contactValue = contact[field as keyof typeof contact];
          const formField = this.getFormField(form, field);

          if (formField && formField?.value !== contactValue) {
            contact[field as keyof typeof contact] = (formField.value || '') as never;
            return `Updated ${label.toLowerCase()} to ${formField.value || ''}`;
          }
          return '';
        })
        .filter((change) => change);
    }
    return [];
  }

  getFormField(form: FormGroup, field: string): AbstractControl | null {
    if (field == 'committee_id') {
      return form.get('donor_committee_fec_id');
    }
    return form.get(`contributor_${field}`) || form.get(`contributor_organization_${field}`);
  }

  getMemoCodeConstant(transactionType?: TransactionType): boolean | undefined {
    /** Look at validation schema to determine if the memo_code has a constant value.
     * If there is a constant value, return it, otherwise undefined
     */
    const memoCodeSchema = transactionType?.schema.properties['memo_code'];
    return memoCodeSchema?.const as boolean | undefined;
  }

  public isMemoCodeReadOnly(transactionType?: TransactionType): boolean {
    // Memo Code is read-only if there is a constant value in the schema.  Otherwise, it's mutable
    return this.getMemoCodeConstant(transactionType) !== undefined;
  }

  public isDescriptionSystemGenerated(transactionType?: TransactionType): boolean {
    // Description is system generated if there is a defined function.  Otherwise, it's mutable
    return transactionType?.generateContributionPurposeDescription !== undefined;
  }

  doSave(navigateTo: NavigationDestination, payload: Transaction, transactionTypeToAdd?: ScheduleATransactionTypes) {
    if (payload.transaction_type_identifier) {
      if (payload.id) {
        this.transactionService.update(payload).subscribe((transaction) => {
          this.navigateTo(navigateTo, transaction.id, transactionTypeToAdd);
        });
      } else {
        this.transactionService.create(payload).subscribe((transaction) => {
          this.navigateTo(navigateTo, transaction.id, transactionTypeToAdd);
        });
      }
    }
  }

  getNavigationControls(): TransactionNavigationControls {
    return this.transactionType?.navigationControls || new TransactionNavigationControls([], [], []);
  }

  handleNavigate(navigationControl: NavigationControl): void {
    if (navigationControl.navigationAction === NavigationAction.SAVE) {
      this.save(navigationControl.navigationDestination);
    } else {
      this.navigateTo(navigationControl.navigationDestination);
    }
  }

  navigateTo(
    navigateTo: NavigationDestination,
    transactionId?: string,
    transactionTypeToAdd?: ScheduleATransactionTypes
  ) {
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
        `/transactions/report/${this.transactionType?.transaction?.report_id}/list/edit/${transactionId}/create-sub-transaction/${transactionTypeToAdd}`
      );
    } else if (navigateTo === NavigationDestination.PARENT) {
      this.router.navigateByUrl(
        `/transactions/report/${this.transactionType?.transaction?.report_id}/list/edit/${this.transactionType?.transaction?.parent_transaction_id}`
      );
    } else {
      this.router.navigateByUrl(`/transactions/report/${this.transactionType?.transaction?.report_id}/list`);
    }
  }

  protected resetForm() {
    this.doResetForm(this.form, this.transactionType);
  }

  protected doResetForm(form: FormGroup, transactionType: TransactionType | undefined) {
    this.formSubmitted = false;
    form.reset();
    form.markAsPristine();
    form.markAsUntouched();

    form.patchValue({
      entity_type: this.contactTypeOptions[0]?.code,
      contribution_aggregate: '0',
      memo_code: this.getMemoCodeConstant(transactionType),
      contribution_purpose_descrip: transactionType?.generateContributionPurposeDescription?.() || '',
    });
  }

  onContactLookupSelect(selectItem: SelectItem<Contact>) {
    this.doContactLookupSelect(selectItem, this.form, this.transactionType, this.contactId$);
  }

  protected doContactLookupSelect(
    selectItem: SelectItem<Contact>,
    form: FormGroup,
    transactionType: TransactionType | undefined,
    contactId$: Subject<string>
  ) {
    if (selectItem) {
      const contact: Contact = selectItem.value;
      if (contact) {
        switch (contact.type) {
          case ContactTypes.INDIVIDUAL:
            form.get('contributor_last_name')?.setValue(contact.last_name);
            form.get('contributor_first_name')?.setValue(contact.first_name);
            form.get('contributor_middle_name')?.setValue(contact.middle_name);
            form.get('contributor_prefix')?.setValue(contact.prefix);
            form.get('contributor_suffix')?.setValue(contact.suffix);
            form.get('contributor_employer')?.setValue(contact.employer);
            form.get('contributor_occupation')?.setValue(contact.occupation);
            break;
          case ContactTypes.COMMITTEE:
            form.get('donor_committee_fec_id')?.setValue(contact.committee_id);
            form.get('contributor_organization_name')?.setValue(contact.name);
            break;
          case ContactTypes.ORGANIZATION:
            form.get('contributor_organization_name')?.setValue(contact.name);
            break;
        }
        form.get('contributor_street_1')?.setValue(contact.street_1);
        form.get('contributor_street_2')?.setValue(contact.street_2);
        form.get('contributor_city')?.setValue(contact.city);
        form.get('contributor_state')?.setValue(contact.state);
        form.get('contributor_zip')?.setValue(contact.zip);
        if (transactionType?.transaction) {
          transactionType.transaction.contact = contact;
        }
        contactId$.next(contact.id || '');
      }
    }
  }

  isExisting(transaction: Transaction | undefined) {
    return !!transaction?.id;
  }

  getEntityType(): string {
    return this.form.get('entity_type')?.value || '';
  }
}
