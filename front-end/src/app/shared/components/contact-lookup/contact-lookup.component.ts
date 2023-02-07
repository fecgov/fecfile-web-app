import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { Contact, ContactTypes, FecApiCommitteeLookupData, FecApiLookupData } from 'app/shared/models/contact.model';
import { ContactService } from 'app/shared/services/contact.service';
import { FecApiService } from 'app/shared/services/fec-api.service';
import { ValidateService } from 'app/shared/services/validate.service';
import { PrimeOptions } from 'app/shared/utils/label.utils';
import { schema as contactCandidateSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Candidate';
import { schema as contactCommitteeSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Committee';
import { schema as contactIndividualSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Individual';
import { schema as contactOrganizationSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Organization';
import { SelectItem, SelectItemGroup } from 'primeng/api';

@Component({
  selector: 'app-contact-lookup',
  templateUrl: './contact-lookup.component.html',
  styleUrls: ['./contact-lookup.component.scss'],
})
export class ContactLookupComponent {
  @Input() contactTypeOptions: PrimeOptions = [];
  @Input() contactTypeInputId = 'entity_type';
  @Input() contactTypeFormControl: FormControl = new FormControl();
  @Input() contactTypeReadOnly = false;
  @Input() contactTypeStyleClass = '';

  @Input() maxFecCommitteeResults = 5;
  @Input() maxFecfileCommitteeResults = 5;
  @Input() maxFecfileIndividualResults = 10;
  @Input() maxFecfileOrganizationResults = 10;

  @Output() contactSelect = new EventEmitter<SelectItem<Contact>>();

  selectedContact: FormControl<SelectItem> | null = null;

  contactLookupForm: FormGroup = this.formBuilder.group({
    selectedContactType: this.contactTypeFormControl,
    selectedContact: this.selectedContact,
  });

  contactLookupList: SelectItemGroup[] = [];

  searchTerm = '';

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
    private contactService: ContactService,
    private fecApiService: FecApiService
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDropdownSearch(event: any) {
    const searchTerm = event.query;
    if (searchTerm) {
      this.searchTerm = searchTerm;
      switch (this.contactTypeFormControl.value) {
        case ContactTypes.COMMITTEE:
          this.contactService
            .committeeLookup(searchTerm, this.maxFecCommitteeResults, this.maxFecfileCommitteeResults)
            .subscribe((response) => {
              this.contactLookupList = response && response.toSelectItemGroups();
            });
          break;
        case ContactTypes.INDIVIDUAL:
          this.contactService.individualLookup(searchTerm, this.maxFecfileIndividualResults).subscribe((response) => {
            this.contactLookupList = response && response.toSelectItemGroups();
          });
          break;
        case ContactTypes.ORGANIZATION:
          this.contactService
            .organizationLookup(searchTerm, this.maxFecfileOrganizationResults)
            .subscribe((response) => {
              this.contactLookupList = response && response.toSelectItemGroups();
            });
          break;
      }
    } else {
      this.contactLookupList = [];
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onContactSelect(event: any) {
    if (event && event.value) {
      if (event.value instanceof Contact) {
        this.contactSelect.emit(event);
      } else if (event.value instanceof FecApiCommitteeLookupData) {
        const value: FecApiCommitteeLookupData = event.value;
        if (value.id) {
          this.fecApiService.getDetails(value.id).subscribe((committeeAccount) => {
            this.openCreateContactDialog(committeeAccount);
          });
        }
      }
      this.contactLookupForm.patchValue({ selectedContact: '' });
    }
  }

  createNewContact() {
    this.openCreateContactDialog();
  }

  isContact(value: Contact | FecApiLookupData) {
    return value instanceof Contact;
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
