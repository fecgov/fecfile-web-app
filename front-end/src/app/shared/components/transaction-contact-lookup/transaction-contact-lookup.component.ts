import { Component, OnInit, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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

@Component({
  selector: 'app-transaction-contact-lookup',
  templateUrl: './transaction-contact-lookup.component.html',
})
export class TransactionContactLookupComponent implements OnInit {
  @Input() contactProperty?: Contact;
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
  errorMessageFormControl = new FormControl('', Validators.required);
  currentContactLabel = 'Individual';

  constructor(private formBuilder: FormBuilder, private contactService: ContactService) {}

  ngOnInit(): void {
    // Set the contact type options in the child dialog component to the first contact type option
    // listed in the child lookup component. This will automatically select the correct
    // content type from the transaction contact lookup and make the second in the lookup in the dialog to readonly.
    this.dialogContactTypeOptions = [this.contactTypeOptions[0]];
    this.currentContactLabel = this.contactTypeOptions[0].label;

    if (this.contactProperty) {
      this.markContactSelected();
    }
  }

  markContactSelected() {
    this.errorMessageFormControl.setValue('candidate chosen');
  }

  contactTypeSelected(contactType: ContactTypes) {
    // As the user selects contact types in the lookup, communicate that to the
    // second contact lookup in the contact dialog so that it can set the selection
    // value and set the dropdown is as readonly.
    this.contactDialog.contactTypeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [contactType]);
    this.currentContactLabel = this.contactDialog.contactTypeOptions[0].label;
    this.contactTypeSelect.emit(contactType);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contactLookupSelected(contact: Contact) {
    this.markContactSelected();
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
    this.detailVisible = true;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  saveContact(contact: Contact) {
    this.markContactSelected();
    this.contactSelect.emit({
      value: contact,
    });
    this.detailVisible = false;
  }
}
