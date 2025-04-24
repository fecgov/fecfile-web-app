/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, computed, inject, Injector, input, model, OnInit, output, signal, viewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CandidateOfficeType, Contact, ContactTypeLabels, ContactTypes } from 'app/shared/models/contact.model';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { schema as contactCandidateSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Candidate';
import { schema as contactCommitteeSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Committee';
import { schema as contactIndividualSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Individual';
import { schema as contactOrganizationSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Organization';
import { SelectItem } from 'primeng/api';
import { ContactDialogComponent } from '../contact-dialog/contact-dialog.component';
import { Transaction } from 'app/shared/models/transaction.model';
import { SignalFormControl } from 'app/shared/utils/signal-form-control';
import { ContactLookupComponent } from '../contact-lookup/contact-lookup.component';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';

@Component({
  selector: 'app-transaction-contact-lookup',
  templateUrl: './transaction-contact-lookup.component.html',
  imports: [ContactLookupComponent, ContactDialogComponent, ErrorMessagesComponent],
})
export class TransactionContactLookupComponent implements OnInit {
  private readonly injector = inject(Injector);
  private readonly formBuilder = inject(FormBuilder);

  readonly contactProperty = input('contact_1');
  readonly transaction = input<Transaction>();
  readonly form = input<FormGroup>(new FormGroup({}, { updateOn: 'blur' }));
  readonly formSubmitted = input(false);
  readonly contactTypeOptions = model<PrimeOptions>([]);
  readonly excludeFecIds = input<string[]>([]);
  readonly excludeIds = input<string[]>([]);

  readonly contactTypeSelect = output<ContactTypes>();
  readonly contactSelect = output<SelectItem<Contact>>();

  readonly contactDialog = viewChild(ContactDialogComponent);

  detailVisible = false;

  readonly createContactForm: FormGroup = this.formBuilder.group(
    SchemaUtils.getFormGroupFields(this.injector, [
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
  readonly currentType = computed(() => this.selectedOption().value as ContactTypes);

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

  ngOnInit(): void {
    const tx = this.transaction();
    // Limit contact type options in contact lookup to one when editing a transaction
    if (tx?.id) {
      const contact = tx[this.contactProperty() as keyof Transaction] as Contact;
      this.contactTypeOptions.set(LabelUtils.getPrimeOptions(ContactTypeLabels, [contact.type]));
      this.selectedOption.set(this.contactTypeOptions()[0]);
    }
  }

  private createLookupValidator(key: string, validatorFn: () => any) {
    const control = new SignalFormControl(this.injector, null, validatorFn);
    this.form().addControl(`${key}_lookup`, control);
    return control;
  }

  /**
   * As the user selects contact types in the lookup, communicate that to the
   * second contact lookup in the contact dialog so that it can set the selection
   * value and set its dropdown as readonly.
   * @param contactType
   */
  contactTypeSelected(contactType: ContactTypes) {
    this.selectedOption.set(LabelUtils.getPrimeOptions(ContactTypeLabels, [contactType])[0]);
    this.contactTypeSelect.emit(contactType);
  }

  contactLookupSelected(contact: Contact) {
    if (contact.id) {
      this.contactSelect.emit({ value: contact });
    } else {
      this.contactDialog()?.updateContact(contact);
      this.detailVisible = true;
    }
  }

  createNewContactSelected() {
    this.contactDialog()?.updateContact(Contact.fromJSON({ type: this.currentType() }));
    this.detailVisible = true;
  }

  saveContact(contact: Contact) {
    this.contactSelect.emit({ value: contact });
    this.detailVisible = false;
  }
}
