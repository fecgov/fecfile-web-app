import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Contact, ContactTypeLabels, CandidateOfficeTypeLabels } from '../../shared/models/contact.model';
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

  contactTypeOptions: PrimeOptions = [];
  candidateOfficeTypeOptions: PrimeOptions = [];
  stateOptions: PrimeOptions = [];
  countryOptions: PrimeOptions = [];

  constructor(private messageService: MessageService, private contactService: ContactService) {}

  ngOnInit(): void {
    this.contactTypeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels);
    this.candidateOfficeTypeOptions = LabelUtils.getPrimeOptions(CandidateOfficeTypeLabels);
    this.stateOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);
    this.countryOptions = LabelUtils.getPrimeOptions(CountryCodeLabels);
  }

  public saveItem() {
    if (true) {
      if (this.item.id) {
        this.contactService.update(this.item).subscribe((result) => {
          console.log('PUT = ', result);
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Contact Updated',
            life: 3000,
          });
        });
      } else {
        this.contactService.create(this.item).subscribe((result) => {
          console.log('POST = ', result);
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Contact Created',
            life: 3000,
          });
        });
      }
      this.loadTableItems.emit();
      this.detailVisibleChange.emit(false);
      this.item = new Contact();
    }
  }

  public closeDetail() {
    this.detailVisibleChange.emit(false);
  }
}
