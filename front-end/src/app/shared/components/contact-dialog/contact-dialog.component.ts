import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
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
import { TransactionContactUtils } from '../transaction-type-base/transaction-contact.utils';
import { ConfirmationService } from 'primeng/api';
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
  @Input() defaultCandidateOffice?: CandidateOfficeTypes;
  @Output() detailVisibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() savedContact: EventEmitter<Contact> = new EventEmitter<Contact>();

  form: FormGroup = this.fb.group(
    ValidateUtils.getFormGroupFields([
      ...new Set([
        ...ValidateUtils.getSchemaProperties(contactIndividualSchema),
        ...ValidateUtils.getSchemaProperties(contactCandidateSchema),
        ...ValidateUtils.getSchemaProperties(contactCommitteeSchema),
        ...ValidateUtils.getSchemaProperties(contactOrganizationSchema),
      ]),
    ]),
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

  @ViewChild(ContactLookupComponent) contactLookup?: ContactLookupComponent;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    protected confirmationService: ConfirmationService,
  ) {
    super();
  }

  /**
   * Pass the CandidateOfficeTypes enum into the template
   */
  public get CandidateOfficeTypes() {
    return CandidateOfficeTypes;
  }

  get country(): string {
    return this.form.get('country')?.value;
  }

  set country(country: string) {
    this.form.get('country')?.setValue(country);
  }

  get state(): string {
    return this.form.get('state')?.value;
  }

  set state(state: string) {
    this.form.get('state')?.setValue(state);
  }

  get type(): ContactTypes {
    return this.form.get('type')?.value;
  }

  set type(type: ContactTypes) {
    this.form.get('type')?.setValue(type);
  }

  ngOnInit(): void {
    if (this.contactTypeOptions.length === 0) {
      this.contactTypeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels);
    }
    this.contactType = this.contactTypeOptions[0].value as ContactTypes;
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

    // If there is a defualt candidate office (e.g. 'P') set, then make the
    // candidate office select read-only disabled.
    if (this.defaultCandidateOffice) {
      this.form.get('candidate_office')?.disable();
    }

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
    this.type = contactType;

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

  public openDialog(contact: Contact | undefined = undefined) {
    if (contact) {
      // This might be a local test data issue, but I noticed sometimes the state was set on a committee,
      // but the country was blank. This caused an issue when trying to autopopulate the data.
      if (contact.country === '' && contact.state !== '' && contact.state !== 'ZZ') contact.country = 'USA';
      this.contact = contact;
    }
    this.form.patchValue(this.contact);
    if (this.country === '') {
      this.country = 'USA';
      if (this.state === 'ZZ') this.state = '';
    }
    this.type = this.contact.type as ContactTypes;
    if (this.contact.id) {
      this.isNewItem = false;
      // Update the value of the Contact Type select box in the Contact Lookup
      // component because the Contact Dialog is hidden and not destroyed on close
      // so we need to directly update the lookup "type" form control value
      //   this.contactLookup.contactTypeFormControl.setValue(this.contact.type);
      //  this.contactLookup.contactTypeFormControl.enable();
    } else if (this.contactTypeOptions.length === 1) {
      this.contactLookup?.contactTypeFormControl.enable();
    }
    this.dialogVisible = true;
  }

  public closeDialog(visibleChangeFlag = false) {
    if (!visibleChangeFlag) {
      this.detailVisibleChange.emit(false);
      this.detailVisible = false;
      this.dialogVisible = false;
    }
  }

  /**
   * Callback passed to the contact-lookup component to show/hide lookup input box
   * @returns boolean
   */
  public showSearchBox() {
    return this.contactType === ContactTypes.CANDIDATE || this.contactType === ContactTypes.COMMITTEE;
  }

  updateContact(contact: Contact) {
    this.contact = contact;
    this.form.patchValue(contact);
  }

  public confirmPropagation() {
    const changes = Object.entries(this.form.controls)
      .map(([field, control]: [string, AbstractControl]) => {
        const contactValue = this.contact[field as keyof Contact];
        if (control?.value !== contactValue) {
          return [field, control.value];
        }
        return undefined;
      })
      .filter((change) => !!change) as [string, any][]; // eslint-disable-line @typescript-eslint/no-explicit-any
    const changesMessage = TransactionContactUtils.getContactChangesMessage(this.contact, changes);
    this.confirmationService.confirm({
      key: 'contactDialogDialog',
      header: 'Confirm',
      icon: 'pi pi-info-circle',
      message: changesMessage,
      acceptLabel: 'Continue',
      rejectLabel: 'Cancel',
      accept: () => {
        this.saveContact();
      },
    });
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
    contact.type = this.contactType;
    this.savedContact.emit(contact);

    if (closeDialog) {
      this.closeDialog();
    }
    this.resetForm();
  }

  private resetForm() {
    this.form.reset();
    this.isNewItem = true;
    this.contactLookup?.contactTypeFormControl.enable();
    this.contactLookup?.contactTypeFormControl.setValue(this.contactTypeOptions[0].value);
    if (this.defaultCandidateOffice) {
      this.form.get('candidate_office')?.setValue(this.defaultCandidateOffice);
    }
    this.formSubmitted = false;
  }
}
