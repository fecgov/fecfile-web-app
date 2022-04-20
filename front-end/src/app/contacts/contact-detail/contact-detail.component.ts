import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import {
  Contact,
  ContactTypes,
  ContactTypeLabels,
  CandidateOfficeTypes,
  CandidateOfficeTypeLabels,
} from '../../shared/models/contact.model';
import { ContactService } from 'app/shared/services/contact.service';
import { LabelUtils, PrimeOptions, StatesCodeLabels, CountryCodeLabels } from 'app/shared/utils/label.utils';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
})
export class ContactDetailComponent implements OnInit {
  @Input() contact: Contact = new Contact();
  @Input() detailVisible: boolean = false;
  @Output() detailVisibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() loadTableItems: EventEmitter<any> = new EventEmitter<any>();

  private _isNewContact: boolean = false;
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
  formSubmitted: boolean = false;

  form: FormGroup = this.fb.group({
    type: ['', [Validators.required]],
    candidate_id: ['', [Validators.required, Validators.maxLength(9)]],
    committee_id: ['', [Validators.required, Validators.maxLength(9)]],
    name: ['', [Validators.required, Validators.maxLength(200)]],
    last_name: ['', [Validators.required, Validators.maxLength(30)]],
    first_name: ['', [Validators.required, Validators.maxLength(20)]],
    middle_name: ['', [Validators.maxLength(20)]],
    prefix: ['', [Validators.maxLength(10)]],
    suffix: ['', [Validators.maxLength(10)]],
    street_1: ['', [Validators.required, Validators.maxLength(34)]],
    street_2: ['', [Validators.maxLength(34)]],
    city: ['', [Validators.required, Validators.maxLength(30)]],
    state: ['', [Validators.required]],
    zip: ['', [Validators.required, Validators.maxLength(9)]],
    employer: ['', [Validators.maxLength(38)]],
    occupation: ['', [Validators.maxLength(38)]],
    candidate_office: ['', [Validators.required, Validators.maxLength(10)]],
    candidate_state: ['', [Validators.required, Validators.maxLength(10)]],
    candidate_district: ['', [Validators.required, Validators.maxLength(10)]],
    telephone: ['', [Validators.pattern('[0-9]{10}')]],
    country: ['', [Validators.required]],
  });

  constructor(
    private messageService: MessageService,
    private contactService: ContactService,
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
    Contact.getFieldsByType(this.form.get('type')?.value).forEach((field: string) => {
      if (!!this.form.get(field)?.value) {
        formValues[field] = this.form.get(field)?.value;
      }
    });

    const payload: Contact = Contact.fromJSON({ ...this.contact, ...formValues });

    if (payload.id) {
      this.contactService.update(payload).subscribe((result) => {
        this.loadTableItems.emit();
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Contact Updated',
          life: 3000,
        });
      });
    } else {
      this.contactService.create(payload).subscribe((result) => {
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
    return Contact.getFieldsByType(type).reduce(
      (isInvalid: boolean, fieldName: string) => isInvalid || !!this.form?.get(fieldName)?.invalid,
      false
    );
  }
}
