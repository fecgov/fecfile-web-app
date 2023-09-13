import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ContactService } from 'app/shared/services/contact.service';
import { CountryCodeLabels, LabelUtils, PrimeOptions, StatesCodeLabels } from 'app/shared/utils/label.utils';
import { ValidateUtils } from 'app/shared/utils/validate.utils';
import { schema as contactCandidateSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Candidate';
import { schema as contactCommitteeSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Committee';
import { schema as contactIndividualSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Individual';
import { schema as contactOrganizationSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Organization';
import { takeUntil } from 'rxjs';
import {
  CandidateOfficeTypeLabels,
  CandidateOfficeTypes,
  Contact,
  ContactTypeLabels,
  ContactTypes,
} from '../../models/contact.model';
import { DestroyerComponent } from '../app-destroyer.component';
import { ContactLookupComponent } from '../contact-lookup/contact-lookup.component';

@Component({
  selector: 'app-contact-dialog',
  templateUrl: './contact-dialog.component.html',
})
export class ContactDialogComponent extends DestroyerComponent implements OnInit {
  @Input() contact: Contact = new Contact();
  @Input() contactTypeOptions: PrimeOptions = [];
  @Input() detailVisible = false;
  @Input() headerTitle?: string;
  @Output() detailVisibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() savedContact: EventEmitter<Contact> = new EventEmitter<Contact>();

  @ViewChild(ContactLookupComponent) contactLookup!: ContactLookupComponent;

  form: FormGroup = this.fb.group(
    ValidateUtils.getFormGroupFields([
      ...new Set([
        ...ValidateUtils.getSchemaProperties(contactIndividualSchema),
        ...ValidateUtils.getSchemaProperties(contactCandidateSchema),
        ...ValidateUtils.getSchemaProperties(contactCommitteeSchema),
        ...ValidateUtils.getSchemaProperties(contactOrganizationSchema),
      ]),
    ])
  );
  formSubmitted = false;

  isNewItem = true;
  contactType = ContactTypes.INDIVIDUAL;
  ContactTypes = ContactTypes;
  candidateOfficeTypeOptions: PrimeOptions = [];
  stateOptions: PrimeOptions = [];
  countryOptions: PrimeOptions = [];
  candidateStateOptions: PrimeOptions = [];
  candidateDistrictOptions: PrimeOptions = [];
  dialogVisible = false; // We need to hide dialog manually so dynamic layout changes are not visible to the user

  constructor(private fb: FormBuilder, private contactService: ContactService) {
    super();
  }

  ngOnInit(): void {
    if (this.contactTypeOptions.length === 0) {
      this.contactTypeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels);
    }
    this.candidateOfficeTypeOptions = LabelUtils.getPrimeOptions(CandidateOfficeTypeLabels);
    this.stateOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);
    this.countryOptions = LabelUtils.getPrimeOptions(CountryCodeLabels);
    this.candidateStateOptions = LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary());

    this.form
      ?.get('country')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => {
        if (value !== 'USA') {
          this.form.patchValue({
            state: 'ZZ',
          });
          // ajv does not un-require zip when country is not USA
          this.form.patchValue({ zip: this.form.get('zip')?.value || '' });
          this.form.get('state')?.disable();
        } else {
          this.form.patchValue({ zip: this.form.get('zip')?.value || null });
          this.form.get('state')?.enable();
        }
      });

    this.form
      ?.get('candidate_state')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => {
        if (!!value && this.form.get('candidate_office')?.value === CandidateOfficeTypes.HOUSE) {
          this.candidateDistrictOptions = LabelUtils.getPrimeOptions(LabelUtils.getCongressionalDistrictLabels(value));
        } else {
          this.candidateDistrictOptions = [];
        }
      });

    this.contactTypeChanged(this.contactType);
  }

  /**
   * Add or remove the FEC ID unique validation check for a FormControl
   * @param formId
   * @param contactId
   * @param enableValidator
   */
  refreshFecIdValidator(formId: string, contactId: string | undefined, enableValidator: boolean) {
    this.form?.get(formId)?.clearAsyncValidators();
    if (enableValidator) {
      this.form?.get(formId)?.addAsyncValidators(this.contactService.getFecIdValidator(contactId));
    }
    this.form?.get(formId)?.updateValueAndValidity();
  }

  /**
   * On ngOnInit and when a user changes the selection of the ContactType for the contact
   * entry form (as known by the emitter from the contact-lookup component), update the necessary
   * FormControl elements for the ContactType selected by the user.
   * @param contactType
   */
  contactTypeChanged(contactType: ContactTypes) {
    this.contactType = contactType;

    // The type form control is not displayed on the form page because we are
    // displaying the contact lookup component which operates independently so
    // we keep the 'type' value on the contact dialog form up-to-date in the background.
    this.form.get('type')?.setValue(contactType);

    const schema = ContactService.getSchemaByType(contactType);
    ValidateUtils.addJsonSchemaValidators(this.form, schema, true);
    this.refreshFecIdValidator('candidate_id', this.contact.id, contactType === ContactTypes.CANDIDATE);
    this.refreshFecIdValidator('committee_id', this.contact.id, contactType === ContactTypes.COMMITTEE);

    // Clear out non-schema form values
    const formValues: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
    const schemaProperties: string[] = ValidateUtils.getSchemaProperties(schema);
    Object.keys(this.form.controls).forEach((property: string) => {
      if (!schemaProperties.includes(property)) {
        formValues[property] = null;
      }
    });
    this.form.patchValue(formValues);

    if (contactType === ContactTypes.CANDIDATE) {
      this.stateOptions = LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary());
    } else {
      this.stateOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);
    }
  }

  /**
   * Pass the CandidateOfficeTypes enum into the template
   */
  public get CandidateOfficeTypes() {
    return CandidateOfficeTypes;
  }

  public openDialog() {
    this.resetForm();
    this.form.patchValue(this.contact);
    if (this.contact.id) {
      this.isNewItem = false;
      // Update the value of the Contact Type select box in the Contact Lookup
      // component because the Contact Dialog is hidden and not destroyed on close
      // so we need to directly update the lookup "type" form control value
      this.contactLookup.contactTypeFormControl.setValue(this.contact.type);
      this.contactLookup.contactTypeReadOnly = true;
    } else if (this.contactTypeOptions.length === 1) {
      this.contactLookup.contactTypeReadOnly = true;
    }
    this.dialogVisible = true;
  }

  public closeDialog() {
    this.detailVisibleChange.emit(false);
    this.detailVisible = false;
    this.dialogVisible = false;
  }

  /**
   * Callback passed to the contact-lookup component to show/hide lookup input box
   * @returns boolean
   */
  public showSearchBox() {
    return this.contactType === ContactTypes.CANDIDATE || this.contactType === ContactTypes.COMMITTEE;
  }

  private resetForm() {
    this.form.reset();
    this.isNewItem = true;
    this.contactLookup.contactTypeReadOnly = false;
    this.contactLookup.contactTypeFormControl.setValue(ContactTypes.INDIVIDUAL);
    this.formSubmitted = false;
  }

  updateContact(contact: Contact) {
    this.contact = contact;
    this.form.patchValue(contact);
  }

  public saveContact(closeDialog = true) {
    this.formSubmitted = true;

    if (this.form.invalid) {
      return;
    }

    const contact: Contact = Contact.fromJSON({
      ...this.contact,
      ...ValidateUtils.getFormValues(this.form, ContactService.getSchemaByType(this.contactType)),
    });
    this.savedContact.emit(contact);

    if (closeDialog) {
      this.closeDialog();
    }
    this.resetForm();
  }
}
