import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, RequiredValidator, Validators } from '@angular/forms';
import { Contact, ContactType } from 'app/shared/models/contact.model';
import { ContactService } from 'app/shared/services/contact.service';
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
  @Input() form: FormGroup = new FormGroup([]);
  @Input() formSubmitted = false;

  @Input() contactTypeOptions: PrimeOptions = [];
  @Input() contactTypeFormControl: FormControl = new FormControl();
  @Input() selectedContactFormControlName = '';

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

  constructor(private formBuilder: FormBuilder, private contactService: ContactService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateFormWithPrimaryContact(event: any) {
    this.contactForm?.updateFormWithPrimaryContact(event);
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
    this.createContactForm.get('candidate_id')?.addAsyncValidators(this.contactService.getFecIdValidator());
    this.createContactForm.get('committee_id')?.addAsyncValidators(this.contactService.getFecIdValidator());
    this.clearErrorsFromContactForm();
    this.createContactDialogVisible = true;
  }

  // Ensure invalid form elements are reset to valid when form opened
  clearErrorsFromContactForm() {
    const requiredMap = new Map();
    for (const controlName of Object.keys(this.createContactForm.controls)) {
      const control = this.createContactForm.get(controlName);
      requiredMap.set(controlName, control?.hasValidator(Validators.required));
      control?.removeValidators(Validators.required);
      console.log('Before set:', control?.errors);
      control?.setErrors(null);
      console.log('After set:', control?.errors);
      control?.markAsPristine();
      console.log('After pristine:', control?.errors);
      console.log('From the source:', this.createContactForm.get(controlName)?.errors);
    }
    console.log('Out of loop, pre-set:', this.createContactForm.get('last_name')?.errors);
    this.createContactForm.setErrors(null);
    console.log('Out of loop, post-set:', this.createContactForm.get('last_name')?.errors);
    this.createContactForm.markAsPristine();
    console.log('Out of loop, post-pristine:', this.createContactForm.get('last_name')?.errors);
    console.log(this.createContactForm.get('last_name'));
    console.log(this.createContactForm.get('last_name')?.hasValidator(Validators.required));
    console.log('Out of loop, post-log?:', this.createContactForm.get('last_name')?.errors);
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
