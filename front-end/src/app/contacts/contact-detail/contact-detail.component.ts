import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import {
  Contact,
  ContactType,
  ContactTypes,
  ContactTypeLabels,
  CandidateOfficeTypes,
  CandidateOfficeTypeLabels,
} from '../../shared/models/contact.model';
import { ContactService } from 'app/shared/services/contact.service';
import { LabelUtils, PrimeOptions, StatesCodeLabels, CountryCodeLabels } from 'app/shared/utils/label.utils';
import { ValidateService } from 'app/shared/services/validate.service';
import { schema as contactIndividualSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Individual';
import { schema as contactCandidateSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Candidate';
import { schema as contactCommitteeSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Committee';
import { schema as contactOrganizationSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Organization';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
})
export class ContactDetailComponent implements OnInit {
  @Input() contact: Contact = new Contact();
  @Input() detailVisible = false;
  @Output() detailVisibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() loadTableItems: EventEmitter<LazyLoadEvent> = new EventEmitter<LazyLoadEvent>();

  private _isNewContact = false;
  @Input() set isNewContact(value: boolean) {
    this._isNewContact = value;
    if (this._isNewContact) {
      this.form.get('type')?.enable();
    } else {
      this.form.get('type')?.disable();
    }
  }

  get isNewContact(): boolean {
    return this._isNewContact;
  }

  ContactTypes = ContactTypes;
  contactTypeOptions: PrimeOptions = [];
  candidateOfficeTypeOptions: PrimeOptions = [];
  stateOptions: PrimeOptions = [];
  countryOptions: PrimeOptions = [];
  candidateStateOptions: PrimeOptions = [];
  candidateDistrictOptions: PrimeOptions = [];
  formSubmitted = false;

  form: FormGroup = this.fb.group(
    this.validateService.getFormGroupFields([
      contactIndividualSchema,
      contactCandidateSchema,
      contactCommitteeSchema,
      contactOrganizationSchema,
    ])
  );

  constructor(
    private messageService: MessageService,
    private contactService: ContactService,
    private validateService: ValidateService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.contactTypeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels);
    this.candidateOfficeTypeOptions = LabelUtils.getPrimeOptions(CandidateOfficeTypeLabels);
    this.stateOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);
    this.countryOptions = LabelUtils.getPrimeOptions(CountryCodeLabels);
    this.candidateStateOptions = LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary());

    this.form?.get('type')?.valueChanges.subscribe((value: string) => {
      if (value === ContactTypes.CANDIDATE) {
        this.stateOptions = LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary());
      } else {
        this.stateOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);
      }
    });

    this.form?.get('country')?.valueChanges.subscribe((value: string) => {
      if (value !== 'USA') {
        this.form.patchValue({
          state: 'ZZ',
        });
        this.form?.get('state')?.disable();
      } else {
        this.form?.get('state')?.enable();
      }
    });

    this.form?.get('candidate_office')?.valueChanges.subscribe((value: string) => {
      if (!value || value === CandidateOfficeTypes.PRESIDENTIAL) {
        this.form.patchValue({
          candidate_state: '',
          candidate_district: '',
        });
        this.form?.get('candidate_state')?.disable();
        this.form?.get('candidate_district')?.disable();
      } else if (value === CandidateOfficeTypes.SENATE) {
        this.form.patchValue({
          candidate_district: '',
        });
        this.form?.get('candidate_state')?.enable();
        this.form?.get('candidate_district')?.disable();
      } else {
        this.form?.get('candidate_state')?.enable();
        this.form?.get('candidate_district')?.enable();
      }
    });

    this.form?.get('candidate_state')?.valueChanges.subscribe((value: string) => {
      if (!!value && this.form.get('candidate_office')?.value === CandidateOfficeTypes.HOUSE) {
        this.candidateDistrictOptions = LabelUtils.getPrimeOptions(LabelUtils.getCongressionalDistrictLabels(value));
      } else {
        this.candidateDistrictOptions = [];
      }
    });
  }

  /**
   * Pass the CandidateOfficeTypes enum into the template
   */
  public get CandidateOfficeTypes() {
    return CandidateOfficeTypes;
  }

  public onOpenDetail() {
    this.resetForm();
    this.form.patchValue(this.contact);
  }

  public saveItem(closeDetail = true) {
    this.formSubmitted = true;

    if (this.isFormInvalid()) {
      return;
    }

    const formValues: Record<string, string | null> = {};
    this.getFieldsByType(this.form.get('type')?.value).forEach((field: string) => {
      if (this.form.get(field)?.value) {
        formValues[field] = this.form.get(field)?.value;
      }
    });

    const payload: Contact = Contact.fromJSON({ ...this.contact, ...formValues });

    if (payload.id) {
      this.contactService.update(payload).subscribe(() => {
        this.loadTableItems.emit();
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Contact Updated',
          life: 3000,
        });
      });
    } else {
      this.contactService.create(payload).subscribe(() => {
        this.loadTableItems.emit();
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Contact Created',
          life: 3000,
        });
      });
    }
    if (closeDetail) {
      this.closeDetail();
    }
    this.resetForm();
  }

  getFieldsByType(type: ContactType): string[] {
    if (type === ContactTypes.INDIVIDUAL) {
      return Object.keys(contactIndividualSchema.properties);
      // return [
      //   'type',
      //   'last_name',
      //   'first_name',
      //   'middle_name',
      //   'prefix',
      //   'suffix',
      //   'country',
      //   'street_1',
      //   'street_2',
      //   'city',
      //   'state',
      //   'zip',
      //   'telephone',
      //   'employer',
      //   'occupation',
      // ];
    }

    if (type === ContactTypes.ORGANIZATION) {
      return Object.keys(contactOrganizationSchema.properties);
      // return ['type', 'name', 'country', 'street_1', 'street_2', 'city', 'state', 'zip', 'telephone'];
    }

    if (type === ContactTypes.CANDIDATE) {
      return Object.keys(contactCandidateSchema.properties);
      // return [
      //   'type',
      //   'candidate_id',
      //   'last_name',
      //   'first_name',
      //   'middle_name',
      //   'prefix',
      //   'suffix',
      //   'country',
      //   'street_1',
      //   'street_2',
      //   'city',
      //   'state',
      //   'zip',
      //   'telephone',
      //   'employer',
      //   'occupation',
      //   'candidate_office',
      //   'candidate_state',
      //   'candidate_district',
      // ];
    }

    if (type === ContactTypes.COMMITTEE) {
      return Object.keys(contactCommitteeSchema.properties);
      // return ['type', 'committee_id', 'name', 'country', 'street_1', 'street_2', 'city', 'state', 'zip', 'telephone'];
    }

    return [];
  }

  public closeDetail() {
    this.detailVisibleChange.emit(false);
    this.resetForm();
  }

  private resetForm() {
    this.form.reset();
    this.formSubmitted = false;
  }

  private isFormInvalid(): boolean {
    const type: ContactTypes = this.form?.get('type')?.value;
    return this.getFieldsByType(type).reduce(
      (isInvalid: boolean, fieldName: string) => isInvalid || !!this.form?.get(fieldName)?.invalid,
      false
    );
  }
}
