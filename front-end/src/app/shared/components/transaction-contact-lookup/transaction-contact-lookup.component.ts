import { Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
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
  @Input() contactProperty = 'contact_1';
  @Input() transaction?: Transaction;
  @Input() form: FormGroup = new FormGroup({}, { updateOn: 'blur' });
  @Input() formSubmitted = false;
  @Input() contactTypeOptions: PrimeOptions = [];
  @Input() excludeFecIds: string[] = [];
  @Input() excludeIds: string[] = [];

  @Output() readonly contactTypeSelect = new EventEmitter<ContactTypes>();
  @Output() readonly contactSelect = new EventEmitter<SelectItem<Contact>>();

  @ViewChild(ContactDialogComponent) contactDialog!: ContactDialogComponent;

  detailVisible = false;
  dialogContactTypeOptions: PrimeOptions = [];
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
  currentContactLabel = 'Individual';
  currentType = ContactTypes.INDIVIDUAL;
  mandatoryCandidateOffice?: CandidateOfficeType; // If the candidate is limited to one type of office, that office is set here.

  ngOnInit(): void {
    // Set the contact type options in the child dialog component to the first contact type option
    // listed in the child lookup component. This will automatically select the correct
    // content type from the transaction contact lookup and make the second in the lookup in the dialog to readonly.
    this.dialogContactTypeOptions = [this.contactTypeOptions[0]];
    this.currentContactLabel = this.contactTypeOptions[0].label;
    this.currentType = this.contactTypeOptions[0].value as ContactTypes;

    // Limit contact type options in contact lookup to one when editing a transaction
    if (this.transaction?.id) {
      this.contactTypeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [
        (this.transaction[this.contactProperty as keyof Transaction] as Contact).type as ContactTypes,
      ]);
    }

    // Determine from manitoryFields if candidate results are limited to a particular office
    if (
      this.transaction?.transactionType.templateMap.candidate_office &&
      this.transaction.transactionType.mandatoryFormValues &&
      this.transaction.transactionType.templateMap.candidate_office in
        this.transaction.transactionType.mandatoryFormValues
    ) {
      this.mandatoryCandidateOffice = this.transaction.transactionType.mandatoryFormValues[
        this.transaction.transactionType.templateMap.candidate_office
      ] as CandidateOfficeType;
    }

    // If needed, create a local form control to manage validation and add the
    // new form control to the parent form so that a validation check occurs
    // when the parent form is submitted and blocks submit if validation fails.
    if (this.contactProperty === 'contact_2') {
      this.errorMessageFormControl = new SubscriptionFormControl(null, () => {
        if (!this.transaction?.contact_2 && this.transaction?.transactionType?.contact2IsRequired(this.form)) {
          return { required: true };
        }
        return null;
      });
      this.form.addControl('contact_2_lookup', this.errorMessageFormControl);
    }
    if (this.contactProperty === 'contact_3') {
      this.errorMessageFormControl = new SubscriptionFormControl(null, () => {
        if (!this.transaction?.contact_3 && this.transaction?.transactionType?.contact3IsRequired) {
          return { required: true };
        }
        return null;
      });
      this.form.addControl('contact_3_lookup', this.errorMessageFormControl);
    }
    if (this.contactProperty === 'contact_4') {
      this.errorMessageFormControl = new SubscriptionFormControl(null, () => {
        if (!this.transaction?.contact_4 && this.transaction?.transactionType?.contact4IsRequired(this.form)) {
          return { required: true };
        }
        return null;
      });
      this.form.addControl('contact_4_lookup', this.errorMessageFormControl);
    }
    if (this.contactProperty === 'contact_5') {
      this.errorMessageFormControl = new SubscriptionFormControl(null, () => {
        if (!this.transaction?.contact_5 && this.transaction?.transactionType?.contact5IsRequired(this.form)) {
          return { required: true };
        }
        return null;
      });
      this.form.addControl('contact_5_lookup', this.errorMessageFormControl);
    }
  }

  /**
   * As the user selects contact types in the lookup, communicate that to the
   * second contact lookup in the contact dialog so that it can set the selection
   * value and set its dropdown as readonly.
   * @param contactType
   */
  contactTypeSelected(contactType: ContactTypes) {
    this.contactDialog.contactTypeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [contactType]);
    this.currentContactLabel = this.contactDialog.contactTypeOptions[0].label;
    this.currentType = this.contactDialog.contactTypeOptions[0].value as ContactTypes;
    this.contactTypeSelect.emit(contactType);
  }

  contactLookupSelected(contact: Contact) {
    if (contact.id) {
      this.contactSelect.emit({
        value: contact,
      });
    } else {
      this.contactDialog.updateContact(contact);
      this.detailVisible = true;
    }
  }

  createNewContactSelected() {
    this.contactDialog.updateContact(Contact.fromJSON({ type: this.currentType }));
    this.detailVisible = true;
  }

  saveContact(contact: Contact) {
    this.contactSelect.emit({
      value: contact,
    });
    this.detailVisible = false;
  }
}
