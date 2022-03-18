import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Contact, ContactTypes, ContactTypeLabels, CandidateOfficeTypeLabels } from '../../shared/models/contact.model';
import { ContactService } from 'app/shared/services/contact.service';
import { LabelUtils, PrimeOptions, StatesCodeLabels, CountryCodeLabels } from 'app/shared/utils/label.utils';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  // styleUrls: ['./contact-detail.component.scss'],
})
export class ContactDetailComponent implements OnInit {
  @Input() contact: Contact = new Contact();
  @Input() detailVisible: boolean = false;
  @Input() detailTitle: string = 'Add Contact';
  @Output() detailVisibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() loadTableItems: EventEmitter<any> = new EventEmitter<any>();

  ContactTypes = ContactTypes;
  contactTypeOptions: PrimeOptions = [];
  candidateOfficeTypeOptions: PrimeOptions = [];
  stateOptions: PrimeOptions = [];
  countryOptions: PrimeOptions = [];
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
    candidate_office: ['', [Validators.maxLength(10)]],
    candidate_state: ['', [Validators.maxLength(10)]],
    candidate_district: ['', [Validators.maxLength(10)]],
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
  }

  onOpenDetail() {
    this.resetForm();
    this.form.patchValue(this.contact);
  }

  public saveItem(closeDetail: boolean = true) {
    this.formSubmitted = true;

    if (this.isFormInvalid()) {
      return;
    }

    const formValues = { ...this.form.value };

    // Null fields that are not part of this contact type.
    const typeFields = Contact.getFieldsByType(formValues.type);
    Object.entries(formValues).forEach(([key, value]) => {
      if (!typeFields.includes(key)) {
        formValues[key] = null;
      }
    });

    // Temporary patch until ticket app#119 addresses the candidate dropdown inputs
    // Problem is default select values not getting assigned to fields when untouched
    // Problem may be that field names have "_" in them
    if (formValues.type === ContactTypes.CANDIDATE) {
      formValues.candidate_office = !!formValues.candidate_office ? formValues.candidate_office : 'H';
      formValues.candidate_state = !!formValues.candidate_state ? formValues.candidate_state : 'AL';
      formValues.candidate_district = !!formValues.candidate_district ? formValues.candidate_district : '01';
    }

    const payload: Contact = Contact.fromJSON(formValues);

    if (this.contact.id) {
      payload.id = this.contact.id;
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
