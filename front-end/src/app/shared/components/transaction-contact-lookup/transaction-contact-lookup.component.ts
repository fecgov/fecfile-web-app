import { Component, OnInit, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Contact, ContactTypeLabels, ContactTypes } from 'app/shared/models/contact.model';
import { ContactService } from 'app/shared/services/contact.service';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { ValidateUtils } from 'app/shared/utils/validate.utils';
import { schema as contactCandidateSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Candidate';
import { schema as contactCommitteeSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Committee';
import { schema as contactIndividualSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Individual';
import { schema as contactOrganizationSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Organization';
import { SelectItem } from 'primeng/api';
import { ContactDialogComponent } from '../contact-dialog/contact-dialog.component';
import { Transaction } from 'app/shared/models/transaction.model';

@Component({
  selector: 'app-transaction-contact-lookup',
  templateUrl: './transaction-contact-lookup.component.html',
})
export class TransactionContactLookupComponent implements OnInit {
  @Input() contactProperty = 'contact_1';
  @Input() transaction?: Transaction;
  @Input() form: FormGroup = new FormGroup({});
  @Input() formSubmitted = false;
  @Input() contactTypeOptions: PrimeOptions = [];

  @Output() contactTypeSelect = new EventEmitter<ContactTypes>();
  @Output() contactSelect = new EventEmitter<SelectItem<Contact>>();

  @ViewChild(ContactDialogComponent) contactDialog!: ContactDialogComponent;

  detailVisible = false;
  dialogContactTypeOptions: PrimeOptions = [];
  createContactForm: FormGroup = this.formBuilder.group(
    ValidateUtils.getFormGroupFields([
      ...new Set([
        ...ValidateUtils.getSchemaProperties(contactIndividualSchema),
        ...ValidateUtils.getSchemaProperties(contactCandidateSchema),
        ...ValidateUtils.getSchemaProperties(contactCommitteeSchema),
        ...ValidateUtils.getSchemaProperties(contactOrganizationSchema),
      ]),
    ])
  );
  errorMessageFormControl?: FormControl;
  currentContactLabel = 'Individual';

  constructor(private formBuilder: FormBuilder, private contactService: ContactService) {}

  ngOnInit(): void {
    // Set the contact type options in the child dialog component to the first contact type option
    // listed in the child lookup component. This will automatically select the correct
    // content type from the transaction contact lookup and make the second in the lookup in the dialog to readonly.
    this.dialogContactTypeOptions = [this.contactTypeOptions[0]];
    this.currentContactLabel = this.contactTypeOptions[0].label;

    // Limit contact type options in contact lookup to one when editing a transaction
    if (this.transaction?.id) {
      this.contactTypeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [
        (this.transaction[this.contactProperty as keyof Transaction] as Contact).type as ContactTypes,
      ]);
    }

    // If needed, create a local form control to manage validation and add the
    // new form control to the parent form so that a validation check occurs
    // when the parent form is submitted and blocks submit if validation fails.
    if (this.contactProperty === 'contact_2') {
      this.errorMessageFormControl = new FormControl(null, () => {
        if (!this.transaction?.contact_2 && this.transaction?.transactionType?.contact2IsRequired(this.form)) {
          return { required: true };
        }
        return null;
      });
      this.form.addControl('contact_2_lookup', this.errorMessageFormControl);
    }
    if (this.contactProperty === 'contact_3') {
      this.errorMessageFormControl = new FormControl(null, () => {
        if (!this.transaction?.contact_3 && this.transaction?.transactionType?.contact3IsRequired) {
          return { required: true };
        }
        return null;
      });
      this.form.addControl('contact_3_lookup', this.errorMessageFormControl);
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
    this.contactDialog.updateContact(Contact.fromJSON({}));
    this.detailVisible = true;
  }

  saveContact(contact: Contact) {
    this.contactSelect.emit({
      value: contact,
    });
    this.detailVisible = false;
  }
}
