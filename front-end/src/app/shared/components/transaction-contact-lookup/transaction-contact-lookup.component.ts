import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { Contact, FecApiCommitteeLookupData } from 'app/shared/models/contact.model';
import { FecApiService } from 'app/shared/services/fec-api.service';
import { ValidateService } from 'app/shared/services/validate.service';
import { PrimeOptions } from 'app/shared/utils/label.utils';
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
  @Input() contactTypeOptions: PrimeOptions = [];
  @Input() contactTypeFormControl: FormControl = new FormControl();
  @Input() contactTypeReadOnly = false;

  @Output() contactSelect = new EventEmitter<SelectItem<Contact>>();

  createContactDialogVisible = false;
  createContactFormSubmitted = false;
  createContactForm: FormGroup = this.formBuilder.group(
    this.validateService.getFormGroupFields([
      ...new Set([
        ...ValidateService.getSchemaProperties(contactIndividualSchema),
        ...ValidateService.getSchemaProperties(contactCandidateSchema),
        ...ValidateService.getSchemaProperties(contactCommitteeSchema),
        ...ValidateService.getSchemaProperties(contactOrganizationSchema),
      ]),
    ])
  );

  selectedFecCommitteeAccount: CommitteeAccount | undefined;

  workingValidatorSchema = this.validateService.formValidatorSchema;
  workingValidatorForm = this.validateService.formValidatorForm;

  constructor(
    private formBuilder: FormBuilder,
    private validateService: ValidateService,
    private fecApiService: FecApiService
  ) { }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onContactLookupSelect(event: any) {
    if (event && event.value) {
      if (event.value instanceof Contact) {
        this.contactSelect.emit(event);
      } else if (event.value instanceof FecApiCommitteeLookupData) {
        const value: FecApiCommitteeLookupData = event.value;
        if (value.id) {
          this.fecApiService.getCommitteeDetails(value.id).subscribe((committeeAccount) => {
            this.openCreateContactDialog(committeeAccount);
          });
        }
      }
    }
  }

  onCreateNewContactSelect() {
    this.openCreateContactDialog();
  }

  openCreateContactDialog(value?: CommitteeAccount) {
    this.selectedFecCommitteeAccount = value;
    // Need these since contact-form sets these for validation
    this.workingValidatorSchema = this.validateService.formValidatorSchema;
    this.workingValidatorForm = this.validateService.formValidatorForm;

    this.createContactDialogVisible = true;
  }

  closeCreateContactDialog() {
    // Need these since contact-form sets these for validation
    this.validateService.formValidatorSchema = this.workingValidatorSchema;
    this.validateService.formValidatorForm = this.workingValidatorForm;

    this.createContactDialogVisible = false;
  }

  createContactSave() {
    this.createContactFormSubmitted = true;
    if (this.createContactForm.invalid) {
      return;
    }

    const createdContact = Contact.fromJSON({
      ...this.validateService.getFormValues(this.createContactForm),
    });
    this.contactSelect.emit({
      value: createdContact,
    });
    this.closeCreateContactDialog();
  }

  onCreateContactDialogOpen() {
    this.createContactForm.reset();
    this.createContactFormSubmitted = false;
    const typeFormControl = this.createContactForm.get('type');
    typeFormControl?.setValue(this.contactTypeFormControl.value);
    typeFormControl?.disable();
    let phone;
    if (this.selectedFecCommitteeAccount?.treasurer_phone) {
      phone = '+1 ' + this.selectedFecCommitteeAccount.treasurer_phone;
    }
    if (this.selectedFecCommitteeAccount) {
      this.createContactForm.get('committee_id')?.setValue(this.selectedFecCommitteeAccount.committee_id);
      this.createContactForm.get('name')?.setValue(this.selectedFecCommitteeAccount.name);
      this.createContactForm.get('street_1')?.setValue(this.selectedFecCommitteeAccount.street_1);
      this.createContactForm.get('street_2')?.setValue(this.selectedFecCommitteeAccount.street_2);
      this.createContactForm.get('city')?.setValue(this.selectedFecCommitteeAccount.city);
      this.createContactForm.get('state')?.setValue(this.selectedFecCommitteeAccount.state);
      this.createContactForm.get('zip')?.setValue(this.selectedFecCommitteeAccount.zip);
      this.createContactForm.get('telephone')?.setValue(phone);
    }
  }

  onCreateContactDialogClose() {
    this.selectedFecCommitteeAccount = undefined;
    this.createContactForm.reset();
    this.createContactFormSubmitted = false;
    this.createContactDialogVisible = false;
  }

}
