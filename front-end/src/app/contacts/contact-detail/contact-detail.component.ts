import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
  @Input() item: Contact = new Contact();
  @Input() detailVisible: boolean = false;
  @Output() detailVisibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() loadTableItems: EventEmitter<any> = new EventEmitter<any>();

  ContactTypes = ContactTypes;
  contactTypeOptions: PrimeOptions = [];
  candidateOfficeTypeOptions: PrimeOptions = [];
  stateOptions: PrimeOptions = [];
  countryOptions: PrimeOptions = [];
  formSubmitted: boolean = false;

  form = this.fb.group({
    type: [this.item.type, [Validators.required]],
    candidate_id: [this.item.candidate_id, [Validators.required, Validators.maxLength(9)]],
    committee_id: [this.item.committee_id, [Validators.required, Validators.maxLength(9)]],
    name: [this.item.name, [Validators.maxLength(200)]],
    last_name: [this.item.last_name, [Validators.required, Validators.maxLength(30)]],
    first_name: [this.item.first_name, [Validators.required, Validators.maxLength(20)]],
    middle_name: [this.item.middle_name, [Validators.maxLength(20)]],
    prefix: [this.item.prefix, [Validators.maxLength(10)]],
    suffix: [this.item.suffix, [Validators.maxLength(10)]],
    street_1: [this.item.street_1, [Validators.required, Validators.maxLength(34)]],
    street_2: [this.item.street_2, [Validators.maxLength(34)]],
    city: [this.item.city, [Validators.required, Validators.maxLength(30)]],
    state: [this.item.state, [Validators.required]],
    zip: [this.item.zip, [Validators.required, Validators.maxLength(9)]],
    employer: [this.item.employer, [Validators.maxLength(38)]],
    occupation: [this.item.occupation, [Validators.maxLength(38)]],
    candidate_office: [this.item.candidate_office, [Validators.required, Validators.maxLength(10)]],
    candidate_state: [this.item.candidate_state, [Validators.required, Validators.maxLength(10)]],
    candidate_district: [this.item.candidate_district, [Validators.required, Validators.maxLength(10)]],
    telephone: [this.item.telephone, [Validators.maxLength(10)]],
    country: [this.item.country, [Validators.required]],
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
  }

  public saveItem(closeDetail: boolean = true) {
    this.formSubmitted = true;
    if (this.form.invalid) {
      return;
    }

    const payload: Contact = Contact.fromJSON(this.form.value);

    // if (this.item.id) {
    //   this.contactService.update(this.item).subscribe((result) => {
    //     console.log('PUT = ', result); // MJT
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Successful',
    //       detail: 'Contact Updated',
    //       life: 3000,
    //     });
    //   });
    // } else {
    //   this.contactService.create(this.item).subscribe((result) => {
    //     console.log('POST = ', result); // MJT
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Successful',
    //       detail: 'Contact Created',
    //       life: 3000,
    //     });
    //   });
    // }
    this.loadTableItems.emit();
    if (closeDetail) {
      this.closeDetail();
    }
    this.item = new Contact();
    this.form.reset();
    this.formSubmitted = false;
  }

  public closeDetail() {
    this.detailVisibleChange.emit(false);
  }
}
