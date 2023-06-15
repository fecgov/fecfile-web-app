import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors } from '@angular/forms';
import { ContactService } from 'app/shared/services/contact.service';
import { FecApiService } from 'app/shared/services/fec-api.service';
import { CountryCodeLabels, LabelUtils, PrimeOptions, StatesCodeLabels } from 'app/shared/utils/label.utils';
import { ValidateUtils } from 'app/shared/utils/validate.utils';
import { schema as contactCandidateSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Candidate';
import { schema as contactCommitteeSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Committee';
import { schema as contactIndividualSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Individual';
import { schema as contactOrganizationSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Organization';
import { map, takeUntil } from 'rxjs';
import {
  CandidateOfficeTypeLabels,
  CandidateOfficeTypes,
  Contact,
  ContactTypeLabels,
  ContactTypes,
  FecApiCandidateLookupData,
  FecApiCommitteeLookupData,
} from '../../models/contact.model';
import { DestroyerComponent } from '../app-destroyer.component';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
})
export class ContactFormComponent extends DestroyerComponent implements OnInit {
  @Input() form: FormGroup = this.fb.group(
    ValidateUtils.getFormGroupFields([
      ...new Set([
        ...ValidateUtils.getSchemaProperties(contactIndividualSchema),
        ...ValidateUtils.getSchemaProperties(contactCandidateSchema),
        ...ValidateUtils.getSchemaProperties(contactCommitteeSchema),
        ...ValidateUtils.getSchemaProperties(contactOrganizationSchema),
      ]),
    ])
  );
  @Input() formSubmitted = false;

  ContactTypes = ContactTypes;
  contactTypeOptions: PrimeOptions = [];
  candidateOfficeTypeOptions: PrimeOptions = [];
  stateOptions: PrimeOptions = [];
  countryOptions: PrimeOptions = [];
  candidateStateOptions: PrimeOptions = [];
  candidateDistrictOptions: PrimeOptions = [];

  constructor(private fb: FormBuilder, private fecApiService: FecApiService, private contactService: ContactService) {
    super();
  }

  ngOnInit(): void {
    this.contactTypeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels);
    this.candidateOfficeTypeOptions = LabelUtils.getPrimeOptions(CandidateOfficeTypeLabels);
    this.stateOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);
    this.countryOptions = LabelUtils.getPrimeOptions(CountryCodeLabels);
    this.candidateStateOptions = LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary());

    this.form
      ?.get('type')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => {
        const schema = ContactService.getSchemaByType(value as ContactTypes);
        ValidateUtils.addJsonSchemaValidators(this.form, schema, true);

        // Clear out non-schema form values
        const formValues: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
        const schemaProperties: string[] = ValidateUtils.getSchemaProperties(schema);
        Object.keys(this.form.controls).forEach((property: string) => {
          if (!schemaProperties.includes(property)) {
            formValues[property] = '';
          }
        });
        this.form.patchValue(formValues);

        if (value === ContactTypes.CANDIDATE) {
          this.stateOptions = LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary());
        } else {
          this.stateOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);
        }
      });

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
    this.form?.get('candidate_id')?.addAsyncValidators(this.contactService.fecIdValidator);
    this.form?.get('committee_id')?.addAsyncValidators(this.contactService.fecIdValidator);
  }

  /**
   * Pass the CandidateOfficeTypes enum into the template
   */
  public get CandidateOfficeTypes() {
    return CandidateOfficeTypes;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onContactLookupSelect(event: any) {
    if (event && event.value) {
      if (event.value instanceof Contact) {
        this.onContactSelect(event.value);
      } else if (event.value instanceof FecApiCandidateLookupData) {
        this.onFecApiCandidateLookupDataSelect(event.value);
      } else if (event.value instanceof FecApiCommitteeLookupData) {
        this.onFecApiCommitteeLookupDataSelect(event.value);
      }
    }
  }

  onContactSelect(contact: Contact) {
    if (contact) {
      switch (contact.type) {
        case ContactTypes.CANDIDATE:
          this.form.get('type')?.setValue(contact.type);
          this.form.get('candidate_id')?.setValue(contact.candidate_id);
          this.form.get('last_name')?.setValue(contact.last_name);
          this.form.get('first_name')?.setValue(contact.first_name);
          this.form.get('middle_name')?.setValue(contact.middle_name);
          this.form.get('prefix')?.setValue(contact.prefix);
          this.form.get('suffix')?.setValue(contact.suffix);
          this.form.get('employer')?.setValue(contact.employer);
          this.form.get('occupation')?.setValue(contact.occupation);
          this.form.get('candidate_office')?.setValue(contact.candidate_office);
          this.form.get('candidate_state')?.setValue(contact.candidate_state);
          this.form.get('candidate_district')?.setValue(contact.candidate_district);
          break;
        case ContactTypes.COMMITTEE:
          this.form.get('type')?.setValue(contact.type);
          this.form.get('committee_id')?.setValue(contact.committee_id);
          this.form.get('name')?.setValue(contact.name);
          break;
      }
      this.form.get('country')?.setValue(contact.country);
      this.form.get('street_1')?.setValue(contact.street_1);
      this.form.get('street_2')?.setValue(contact.street_2);
      this.form.get('city')?.setValue(contact.city);
      this.form.get('state')?.setValue(contact.state);
      this.form.get('zip')?.setValue(contact.zip);
      this.form.get('telephone')?.setValue(contact.telephone);
    }
  }

  onFecApiCandidateLookupDataSelect(data: FecApiCandidateLookupData) {
    if (data.id) {
      this.fecApiService.getCandidateDetails(data.id).subscribe((candidate) => {
        // TODO: fix once we get info from api and set all names below properly
        const nameSplit = candidate.name?.split(', ');

        this.form.get('type')?.setValue(ContactTypes.CANDIDATE);
        this.form.get('candidate_id')?.setValue(candidate.candidate_id);
        this.form.get('last_name')?.setValue(nameSplit?.[0]);
        this.form.get('first_name')?.setValue(nameSplit?.[1]);
        this.form.get('middle_name')?.setValue('');
        this.form.get('prefix')?.setValue('');
        this.form.get('suffix')?.setValue('');
        this.form.get('street_1')?.setValue(candidate.address_street_1);
        this.form.get('street_2')?.setValue(candidate.address_street_2);
        this.form.get('city')?.setValue(candidate.address_city);
        this.form.get('state')?.setValue(candidate.address_state);
        this.form.get('zip')?.setValue(candidate.address_zip);
        this.form.get('employer')?.setValue('');
        this.form.get('occupation')?.setValue('');
        this.form.get('candidate_office')?.setValue(candidate.office);
        this.form.get('candidate_state')?.setValue(candidate.state);
        this.form.get('candidate_district')?.setValue(candidate.district);
      });
    }
  }

  onFecApiCommitteeLookupDataSelect(data: FecApiCommitteeLookupData) {
    if (data.id) {
      this.fecApiService.getCommitteeDetails(data.id).subscribe((committeeAccount) => {
        let phone;
        if (committeeAccount?.treasurer_phone) {
          phone = '+1 ' + committeeAccount.treasurer_phone;
        }
        this.form.get('type')?.setValue(ContactTypes.COMMITTEE);
        this.form.get('committee_id')?.setValue(committeeAccount.committee_id);
        this.form.get('name')?.setValue(committeeAccount.name);
        this.form.get('street_1')?.setValue(committeeAccount.street_1);
        this.form.get('street_2')?.setValue(committeeAccount.street_2);
        this.form.get('city')?.setValue(committeeAccount.city);
        this.form.get('state')?.setValue(committeeAccount.state);
        this.form.get('zip')?.setValue(committeeAccount.zip);
        this.form.get('telephone')?.setValue(phone);
      });
    }
  }
}
