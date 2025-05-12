import { Component, computed, effect, inject, input, model, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CandidateOfficeType, Contact, ContactTypeLabels, ContactTypes } from 'app/shared/models/contact.model';
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

@Component({
  selector: 'app-transaction-contact-lookup',
  templateUrl: './transaction-contact-lookup.component.html',
  imports: [ContactLookupComponent, ContactDialogComponent, ErrorMessagesComponent],
})
export class TransactionContactLookupComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  readonly contactProperty = input('contact_1');
  readonly transaction = input<Transaction>();
  readonly form = input<FormGroup>(new FormGroup({}, { updateOn: 'blur' }));
  readonly formSubmitted = input(false);
  readonly excludeFecIds = input<string[]>([]);
  readonly excludeIds = input<string[]>([]);

  readonly contact = model<Contact>(new Contact());
  readonly contactType = model<ContactTypes>(ContactTypes.INDIVIDUAL);
  readonly contactTypeOptions = model<PrimeOptions>([]);

  readonly detailVisible = signal(false);
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
  readonly selectedOption = signal<{ label: string; value: string }>({
    value: ContactTypeLabels[0][0],
    label: ContactTypeLabels[0][1],
  });
  readonly currentContactLabel = computed(() => this.selectedOption().label);
  readonly mandatoryCandidateOffice = computed(() => {
    const tx = this.transaction();
    const candidateKey = tx?.transactionType?.templateMap?.candidate_office;
    if (!candidateKey) return undefined;
    return tx?.transactionType?.mandatoryFormValues?.[candidateKey] as CandidateOfficeType;
  });

  readonly errorMessageFormControl = computed(() => {
    const tx = this.transaction();
    if (this.contactProperty() === 'contact_2') {
      return this.createLookupValidator('contact_2', () =>
        !tx?.contact_2 && tx?.transactionType?.contact2IsRequired(this.form()) ? { required: true } : null,
      );
    } else if (this.contactProperty() === 'contact_3') {
      return this.createLookupValidator('contact_3', () =>
        !tx?.contact_3 && tx?.transactionType?.contact3IsRequired ? { required: true } : null,
      );
    } else if (this.contactProperty() === 'contact_4') {
      return this.createLookupValidator('contact_4', () =>
        !tx?.contact_4 && tx?.transactionType?.contact4IsRequired(this.form()) ? { required: true } : null,
      );
    } else if (this.contactProperty() === 'contact_5') {
      return this.createLookupValidator('contact_5', () =>
        !tx?.contact_5 && tx?.transactionType?.contact5IsRequired(this.form()) ? { required: true } : null,
      );
    }
    return null;
  });

  constructor() {
    effect(() => {
      const option = this.contactTypeOptions().find((opt) => opt.value === this.contactType());
      if (option) this.selectedOption.set(option);
    });
  }

  ngOnInit(): void {
    const tx = this.transaction();
    // Limit contact type options in contact lookup to one when editing a transaction
    if (tx?.id) {
      const contact = tx[this.contactProperty() as keyof Transaction] as Contact;
      this.contactTypeOptions.set(LabelUtils.getPrimeOptions(ContactTypeLabels, [contact.type]));
      this.selectedOption.set(this.contactTypeOptions()[0]);
    }
  }

  /**
   * As the user selects contact types in the lookup, communicate that to the
   * second contact lookup in the contact dialog so that it can set the selection
   * value and set its dropdown as readonly.
   * @param contactType
   */
  // contactTypeSelected(contactType: ContactTypes) {
  //   this.contactDialog.contactTypeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [contactType]);
  //   this.currentContactLabel = this.contactDialog.contactTypeOptions[0].label;
  //   this.currentType = this.contactDialog.contactTypeOptions[0].value as ContactTypes;
  //   this.contactTypeSelect.emit(contactType);
  // }

  // contactLookupSelected(contact: Contact) {
  //   if (contact.id) {
  //     this.contactSelect.emit({
  //       value: contact,
  //     });
  //   } else {
  //     this.contactDialog.updateContact(contact);
  //     this.detailVisible = true;
  //   }
  // }

  // createNewContactSelected() {
  //   this.contactDialog.updateContact(Contact.fromJSON({ type: this.currentType }));
  //   this.detailVisible = true;
  // }

  saveContact(contact: Contact) {
    this.contact.set(contact);
    this.detailVisible.set(false);
  }

  private createLookupValidator(key: string, validatorFn: () => any) {
    const control = new SubscriptionFormControl(null, validatorFn);
    this.form().addControl(`${key}_lookup`, control);
    return control;
  }
}
