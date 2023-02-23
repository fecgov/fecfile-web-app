import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ContactService } from 'app/shared/services/contact.service';
import { CountryCodeLabels, LabelUtils, PrimeOptions, StatesCodeLabels } from 'app/shared/utils/label.utils';
import { ValidateUtils } from 'app/shared/utils/validate.utils';
import { schema as contactCandidateSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Candidate';
import { schema as contactCommitteeSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Committee';
import { schema as contactIndividualSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Individual';
import { schema as contactOrganizationSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Organization';
import { Subject, takeUntil } from 'rxjs';
import {
  CandidateOfficeTypeLabels,
  CandidateOfficeTypes,
  ContactTypeLabels,
  ContactTypes
} from '../../models/contact.model';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
})
export class ContactFormComponent implements OnInit, OnDestroy {
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

  private destroy$: Subject<boolean> = new Subject();

  ContactTypes = ContactTypes;
  contactTypeOptions: PrimeOptions = [];
  candidateOfficeTypeOptions: PrimeOptions = [];
  stateOptions: PrimeOptions = [];
  countryOptions: PrimeOptions = [];
  candidateStateOptions: PrimeOptions = [];
  candidateDistrictOptions: PrimeOptions = [];

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService
  ) { }

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
        // Update validator JSON schema to the selected contact type
        const formValidatorSchema = this.contactService.getSchemaByType(
          value as ContactTypes);

        // Clear out non-schema form values
        const formValues: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
        const schemaProperties: string[] = ValidateUtils.getSchemaProperties(
          formValidatorSchema
        );
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
      ?.get('candidate_office')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => {
        if (!value || value === CandidateOfficeTypes.PRESIDENTIAL) {
          this.form.patchValue({
            candidate_state: '',
            candidate_district: '',
          });
          this.form.get('candidate_state')?.disable();
          this.form.get('candidate_district')?.disable();
        } else if (value === CandidateOfficeTypes.SENATE) {
          this.form.patchValue({
            candidate_district: '',
          });
          this.form.get('candidate_state')?.enable();
          this.form.get('candidate_district')?.disable();
        } else {
          this.form.get('candidate_state')?.enable();
          this.form.get('candidate_district')?.enable();
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
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  /**
   * Pass the CandidateOfficeTypes enum into the template
   */
  public get CandidateOfficeTypes() {
    return CandidateOfficeTypes;
  }

}
