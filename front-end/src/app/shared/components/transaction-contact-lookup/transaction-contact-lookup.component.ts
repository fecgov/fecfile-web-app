import { Component, computed, inject, input, model, OnInit, signal, untracked } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import {
  CandidateOfficeType,
  Contact,
  ContactType,
  ContactTypeLabels,
  ContactTypes,
} from 'app/shared/models/contact.model';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { schema as contactCandidateSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Candidate';
import { schema as contactCommitteeSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Committee';
import { schema as contactIndividualSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Individual';
import { schema as contactOrganizationSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Organization';
import { ContactDialogComponent } from '../contact-dialog/contact-dialog.component';
import { Transaction } from 'app/shared/models/transaction.model';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { ContactLookupComponent } from '../contact-lookup/contact-lookup.component';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';
import { effectOnceIf } from 'ngxtension/effect-once-if';

@Component({
  selector: 'app-transaction-contact-lookup',
  templateUrl: './transaction-contact-lookup.component.html',
  imports: [ContactLookupComponent, ContactDialogComponent, ErrorMessagesComponent],
})
export class TransactionContactLookupComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  readonly contactProperty = input('contact_1');
  readonly transaction = input<Transaction>();
  readonly form = input.required<FormGroup>();
  readonly formSubmitted = input(false);

  readonly excludeFecIds = input<string[]>([]);
  readonly excludeIds = input<string[]>([]);

  readonly contact = model<Contact | null>(null);
  readonly dialogContact = signal<Contact>(new Contact());
  readonly contactType = model<ContactType>(ContactTypes.INDIVIDUAL);
  readonly contactTypeOptions = model.required<PrimeOptions>();

  readonly detailVisible = signal(false);
  readonly dialogContactType = computed(() => this.contactTypeOptions()[0]);
  createContactForm: FormGroup = this.formBuilder.group(
    SchemaUtils.getFormGroupFields([
      ...new Set([
        ...SchemaUtils.getSchemaProperties(contactIndividualSchema),
        ...SchemaUtils.getSchemaProperties(contactCandidateSchema),
        ...SchemaUtils.getSchemaProperties(contactCommitteeSchema),
        ...SchemaUtils.getSchemaProperties(contactOrganizationSchema),
      ]),
    ]),
  );
  errorMessageFormControl?: SubscriptionFormControl;
  currentContactLabel = computed(() => this.contactTypeOptions()[0].label);

  // currentType = ContactTypes.INDIVIDUAL;

  readonly mandatoryCandidateOffice = computed(() => {
    const transaction = this.transaction();
    if (
      transaction?.transactionType.templateMap.candidate_office &&
      transaction.transactionType.mandatoryFormValues &&
      transaction.transactionType.templateMap.candidate_office in transaction.transactionType.mandatoryFormValues
    ) {
      return transaction.transactionType.mandatoryFormValues[
        transaction.transactionType.templateMap.candidate_office
      ] as CandidateOfficeType;
    }
    return undefined;
  });

  constructor() {
    // Limit contact type options in contact lookup to one when editing a transaction
    effectOnceIf(
      () => this.transaction()?.id,
      () => {
        this.contactTypeOptions.set(
          LabelUtils.getPrimeOptions(ContactTypeLabels, [
            (this.transaction()![this.contactProperty() as keyof Transaction] as Contact).type as ContactTypes,
          ]),
        );
      },
    );
  }

  ngOnInit(): void {
    // Set the contact type options in the child dialog component to the first contact type option
    // listed in the child lookup component. This will automatically select the correct
    // content type from the transaction contact lookup and make the second in the lookup in the dialog to readonly.
    // this.currentType = this.contactTypeOptions()[0].value as ContactTypes;

    // Determine from manitoryFields if candidate results are limited to a particular office

    // If needed, create a local form control to manage validation and add the
    // new form control to the parent form so that a validation check occurs
    // when the parent form is submitted and blocks submit if validation fails.
    const contactProp = this.contactProperty();
    if (['contact_2', 'contact_3', 'contact_4', 'contact_5'].includes(contactProp)) {
      const controlName = `${contactProp}_lookup`;
      const control = new FormControl(null, {
        validators: [this.contactValidator(contactProp)],
      });
      this.form().addControl(controlName, control);
    }
  }

  // contactLookupSelected(contact: Contact) {
  //   if (contact.id) {
  //     this.contactSelect.emit({
  //       value: contact,
  //     });
  //   } else {
  //     this.contactDialog.updateContact(contact);
  //     this.detailVisible.set(true);
  //   }
  // }

  createNewContactSelected() {
    // this.contact.set(Contact.fromJSON({ type: this.currentType }));
    this.contact.set(Contact.fromJSON({ type: this.contactType() }));
    this.detailVisible.set(true);
  }

  // saveContact(contact: Contact) {
  //   this.contactSelect.emit({
  //     value: contact,
  //   });
  //   this.detailVisible.set(false);
  // }

  private contactValidator(contactProp: string): ValidatorFn {
    return (control: AbstractControl) => {
      return untracked(() => {
        const transaction = this.transaction();
        const form = this.form();
        if (!transaction) return null;
        const contact = transaction[contactProp as keyof Transaction] as Contact | null;
        const contactIsRequiredFnName =
          `${contactProp.replace('contact_', 'contact')}IsRequired` as ContactIsRequiredFnNames;
        const contactIsRequiredFn = transaction.transactionType[contactIsRequiredFnName]?.bind(
          transaction.transactionType,
        ) as (form: FormGroup) => boolean;
        if (!contact && contactIsRequiredFn && contactIsRequiredFn(form)) {
          return { required: true };
        }
        return null;
      });
    };
  }
}

type ContactIsRequiredFnNames =
  | 'contact2IsRequired'
  | 'contact3IsRequired'
  | 'contact4IsRequired'
  | 'contact5IsRequired';
