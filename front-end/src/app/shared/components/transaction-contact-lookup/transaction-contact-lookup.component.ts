import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Contact, ContactType } from 'app/shared/models/contact.model';
import { ContactService } from 'app/shared/services/contact.service';
import { FecApiService } from 'app/shared/services/fec-api.service';
import { PrimeOptions } from 'app/shared/utils/label.utils';
import { ValidateUtils } from 'app/shared/utils/validate.utils';
import { schema as contactCandidateSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Candidate';
import { schema as contactCommitteeSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Committee';
import { schema as contactIndividualSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Individual';
import { schema as contactOrganizationSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Organization';
import { SelectItem } from 'primeng/api';
import { ContactFormComponent } from '../contact-form/contact-form.component';

@Component({
  selector: 'app-transaction-contact-lookup',
  templateUrl: './transaction-contact-lookup.component.html',
})
export class TransactionContactLookupComponent {
  @Input() contactTypeOptions: PrimeOptions = [];
  @Input() contactTypeFormControl: FormControl = new FormControl();
  @Input() contactTypeReadOnly = false;

  @Output() contactSelect = new EventEmitter<SelectItem<Contact>>();

  @ViewChild(ContactFormComponent) contactForm: ContactFormComponent | undefined;

  createContactDialogVisible = false;
  createContactFormSubmitted = false;
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

  constructor(private formBuilder: FormBuilder, private fecApiService: FecApiService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onContactLookupSelect(event: any) {
    this.contactForm?.onContactLookupSelect(event);
    if (!(event?.value instanceof Contact)) {
      this.openCreateContactDialog();
    } else {
      this.contactSelect.emit(event);
    }
  }

  onCreateNewContactSelect() {
    this.openCreateContactDialog();
  }

  openCreateContactDialog() {
    this.createContactForm.reset();
    this.createContactFormSubmitted = false;
    const typeFormControl = this.createContactForm.get('type');
    typeFormControl?.setValue(this.contactTypeFormControl.value);
    typeFormControl?.disable();
    this.createContactDialogVisible = true;
  }

  closeCreateContactDialog() {
    this.createContactDialogVisible = false;
  }

  createContactSave() {
    this.createContactFormSubmitted = true;
    if (this.createContactForm.invalid) {
      return;
    }

    const createdContact = Contact.fromJSON({
      ...ValidateUtils.getFormValues(
        this.createContactForm,
        ContactService.getSchemaByType(this.createContactForm.get('type')?.value as ContactType)
      ),
    });
    this.contactSelect.emit({
      value: createdContact,
    });
    this.closeCreateContactDialog();
  }

  onCreateContactDialogClose() {
    this.createContactForm.reset();
    this.createContactFormSubmitted = false;
    this.createContactDialogVisible = false;
  }
}
