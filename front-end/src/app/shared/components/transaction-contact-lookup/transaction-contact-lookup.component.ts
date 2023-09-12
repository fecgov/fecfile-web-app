import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Contact } from 'app/shared/models/contact.model';
import { ContactService } from 'app/shared/services/contact.service';
import { PrimeOptions } from 'app/shared/utils/label.utils';
import { ValidateUtils } from 'app/shared/utils/validate.utils';
import { schema as contactCandidateSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Candidate';
import { schema as contactCommitteeSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Committee';
import { schema as contactIndividualSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Individual';
import { schema as contactOrganizationSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Organization';
import { SelectItem } from 'primeng/api';

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

  @Output() contactSelect = new EventEmitter<SelectItem<Contact>>();

  detailVisible = false;

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
    this.contactSelect.emit(event);
  }

  onCreateNewContactSelect() {
    this.detailVisible = true;
  }

  // openCreateContactDialog() {
  //   this.createContactForm.reset();
  //   this.createContactFormSubmitted = false;
  //   const typeFormControl = this.createContactForm.get('type');
  //   typeFormControl?.setValue(this.contactTypeFormControl.value);
  //   typeFormControl?.disable();
  //   this.createContactForm.get('candidate_id')?.addAsyncValidators(this.contactService.getFecIdValidator());
  //   this.createContactForm.get('committee_id')?.addAsyncValidators(this.contactService.getFecIdValidator());
  //   this.createContactDialogVisible = true;
  // }

  saveContact($event: any) {
    debugger;
    const contact = $event.value;
    this.contactSelect.emit({
      value: contact,
    });
    this.detailVisible = false;
  }
}
