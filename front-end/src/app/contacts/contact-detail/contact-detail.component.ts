import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Contact, ContactTypes, ContactTypeLabels, CandidateOfficeTypeLabels } from '../../shared/models/contact.model';
import { ContactService } from 'app/shared/services/contact.service';
import { LabelUtils, PrimeOptions, StatesCodeLabels, CountryCodeLabels } from 'app/shared/utils/label.utils';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.scss'],
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
    name: ['', [Validators.maxLength(200)]],
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
    telephone: ['', [Validators.maxLength(10)]],
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
    this.form.patchValue(this.contact);
  }

  public saveItem(closeDetail: boolean = true) {
    this.formSubmitted = true;

    if (this.isInvalid(this.form)) {
      return;
    }

    const payload: Contact = Contact.fromJSON(this.form.value);

    if (this.contact.id) {
      payload.id = this.contact.id;
      this.contactService.update(payload).subscribe((result) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Contact Updated',
          life: 3000,
        });
      });
    } else {
      this.contactService.create(payload).subscribe((result) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Contact Created',
          life: 3000,
        });
      });
    }
    this.loadTableItems.emit();
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

  private isInvalid(form: FormGroup): boolean {
    const formFields: { [key: string]: string[] } = {
      IND: [
        'type',
        'last_name',
        'first_name',
        'middle_name',
        'prefix',
        'suffix',
        'country',
        'street_1',
        'street_2',
        'city',
        'state',
        'zip',
        'telephone',
        'employer',
        'occupation',
      ],
      ORG: ['type', 'name', 'country', 'street_1', 'street_2', 'city', 'state', 'zip', 'telephone'],
      CAN: [
        'type',
        'candidate_id',
        'last_name',
        'first_name',
        'middle_name',
        'prefix',
        'suffix',
        'country',
        'street_1',
        'street_2',
        'city',
        'state',
        'zip',
        'telephone',
        'employer',
        'occupation',
      ],
      COM: [
        'type',
        'committee_id',
        'last_name',
        'country',
        'street_1',
        'street_2',
        'city',
        'state',
        'zip',
        'telephone',
      ],
    };

    return formFields[this.form?.get('type')?.value].reduce(
      (isInvalid: boolean, fieldName: string) => !!isInvalid || !!form?.get(fieldName)?.invalid,
      false
    );
  }
}
