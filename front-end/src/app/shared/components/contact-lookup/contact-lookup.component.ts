import { Component, EventEmitter, inject, input, Input, OnInit, Output, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  CandidateOfficeType,
  CandidateOfficeTypeLabels,
  Contact,
  ContactTypeLabels,
  ContactTypes,
  FecApiCandidateLookupData,
  FecApiCommitteeLookupData,
  FecApiLookupData,
} from 'app/shared/models/contact.model';
import { ContactService } from 'app/shared/services/contact.service';
import { LabelList, LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { PrimeTemplate, SelectItemGroup } from 'primeng/api';
import { AutoComplete, AutoCompleteCompleteEvent, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { Select } from 'primeng/select';
import { takeUntil } from 'rxjs';
import { DestroyerComponent } from '../destroyer.component';

@Component({
  selector: 'app-contact-lookup',
  templateUrl: './contact-lookup.component.html',
  styleUrls: ['./contact-lookup.component.scss'],
  imports: [Select, ReactiveFormsModule, PrimeTemplate, AutoComplete],
})
export class ContactLookupComponent extends DestroyerComponent implements OnInit {
  public readonly contactService = inject(ContactService);
  readonly contactTypeLabels: LabelList = ContactTypeLabels;
  @Input() contactTypeOptions: PrimeOptions = [];
  @Input() showCreateNewContactButton = true;
  readonly showSearchBox = input(true);

  @Input() includeFecfileResults = true;
  @Input() candidateOffice?: CandidateOfficeType;

  readonly autosave = input(true);

  @Output() readonly contactTypeSelect = new EventEmitter<ContactTypes>();
  @Output() readonly contactLookupSelect = new EventEmitter<Contact>();
  @Output() readonly createNewContactSelect = new EventEmitter<void>();

  @ViewChild(AutoComplete)
  set autoComplete(ac: AutoComplete) {
    setTimeout(() => {
      if (ac?.dropdownButton) {
        ac.dropdownButton.nativeElement.tabIndex = -1;
      }
    }, 0);
  }

  readonly contactType = signal<ContactTypes>(ContactTypes.INDIVIDUAL);
  contactTypes = ContactTypes;
  contactTypeReadOnly = false;
  contactLookupList: SelectItemGroup[] = [];
  candidateOfficeLabel?: string;
  contactTypeFormControl = new SubscriptionFormControl<ContactTypes | null>(null, { updateOn: 'change' });
  searchBoxFormControl = new SubscriptionFormControl('', { updateOn: 'change' });

  searchTerm = '';

  ngOnInit(): void {
    this.contactType.set(this.contactTypeOptions[0].value as ContactTypes);
    this.contactTypeFormControl.setValue(this.contactType);
    this.contactTypeReadOnly = this.contactTypeOptions.length === 1;
    if (this.candidateOffice) {
      this.candidateOfficeLabel = LabelUtils.get(CandidateOfficeTypeLabels, this.candidateOffice);
    }

    this.contactTypeFormControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((contactType: ContactTypes | null) => {
        if (!contactType) return;
        this.contactType.set(contactType);
        this.contactTypeSelect.emit(contactType);
      });
  }

  async onDropdownSearch(event: AutoCompleteCompleteEvent) {
    const searchTerm = event.query;
    if (searchTerm) {
      this.searchTerm = searchTerm;
      switch (this.contactTypeFormControl.value) {
        case ContactTypes.CANDIDATE:
          this.contactLookupList = (
            await this.contactService.candidateLookup(searchTerm, '', '', this.candidateOffice)
          ).toSelectItemGroups(this.includeFecfileResults, searchTerm);
          break;
        case ContactTypes.COMMITTEE:
          this.contactService.committeeLookup(searchTerm, '', '').then((response) => {
            this.contactLookupList = response.toSelectItemGroups(this.includeFecfileResults, this.searchTerm);
          });
          break;
        case ContactTypes.INDIVIDUAL:
          this.contactService.individualLookup(searchTerm, '').then((response) => {
            this.contactLookupList = response.toSelectItemGroups(searchTerm);
          });
          break;
        case ContactTypes.ORGANIZATION:
          this.contactService.organizationLookup(searchTerm, '').then((response) => {
            this.contactLookupList = response.toSelectItemGroups(searchTerm);
          });
          break;
      }
    } else {
      this.contactLookupList = [];
    }
  }

  onCreateNewContactSelect() {
    this.createNewContactSelect.emit();
  }

  isContact(value: Contact | FecApiLookupData) {
    return value instanceof Contact;
  }

  async onContactLookupSelect(event: AutoCompleteSelectEvent) {
    if (!event?.value) return;
    let payload: Contact;
    if (event.value instanceof Contact) {
      payload = event.value;
    } else if (event.value.candidate_id) {
      payload = await this.onFecApiCandidateLookupDataSelect(event.value);
    } else {
      payload = await this.onFecApiCommitteeLookupDataSelect(event.value);
    }
    if (this.autosave()) {
      const contact = payload.id ? payload : await this.contactService.create(payload);
      this.onContactSelect(contact);
    } else {
      this.onContactSelect(payload);
    }

    this.searchBoxFormControl.patchValue('');
  }

  onContactSelect(contact: Contact) {
    if (contact) {
      this.contactLookupSelect.emit(contact);
    }
  }

  async onFecApiCandidateLookupDataSelect(data: FecApiCandidateLookupData) {
    if (!data.candidate_id) throw new Error('Invalid Candidate');
    const candidate = await this.contactService.getCandidateDetails(data.candidate_id);
    const nameSplit = candidate.name?.split(', ');
    return Contact.fromJSON({
      type: ContactTypes.CANDIDATE,
      candidate_id: candidate.candidate_id,
      last_name:
        candidate.candidate_first_name && candidate.candidate_last_name
          ? candidate.candidate_last_name
          : nameSplit?.[0], // namesplit to account for paper filers
      first_name:
        candidate.candidate_first_name && candidate.candidate_last_name
          ? candidate.candidate_first_name
          : nameSplit?.[1], // namesplit to account for paper filers
      middle_name: candidate.candidate_middle_name,
      prefix: candidate.candidate_prefix,
      suffix: candidate.candidate_suffix,
      street_1: candidate.address_street_1,
      street_2: candidate.address_street_2,
      city: candidate.address_city,
      state: candidate.address_state,
      zip: candidate.address_zip,
      employer: '',
      occupation: '',
      candidate_office: candidate.office,
      candidate_state: candidate.state === 'US' ? '' : candidate.state,
      candidate_district: candidate.state === 'US' || candidate.office === 'S' ? '' : candidate.district,
    });
  }

  private async onFecApiCommitteeLookupDataSelect(data: FecApiCommitteeLookupData) {
    if (!data.id) throw new Error('Invalid Committee');
    const committee = await this.contactService.getCommitteeDetails(data.id);

    let phone;
    if (committee.treasurer_phone) {
      phone = '+1 ' + committee.treasurer_phone;
    }
    return Contact.fromJSON({
      type: ContactTypes.COMMITTEE,
      committee_id: committee.committee_id,
      name: committee.name,
      street_1: committee.street_1,
      street_2: committee.street_2,
      city: committee.city,
      state: committee.state,
      zip: committee.zip,
      telephone: phone,
    });
  }
}
