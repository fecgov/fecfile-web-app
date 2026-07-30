import { Component, computed, inject, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { effectOnceIf } from 'ngxtension/effect-once-if';
import { PrimeTemplate, SelectItemGroup } from 'primeng/api';
import { AutoComplete, AutoCompleteCompleteEvent, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-contact-lookup',
  templateUrl: './contact-lookup.component.html',
  styleUrls: ['./contact-lookup.component.scss'],
  imports: [Select, PrimeTemplate, AutoComplete, FormsModule],
})
export class ContactLookupComponent {
  public readonly contactService = inject(ContactService);

  readonly type = model<ContactTypes>(ContactTypes.INDIVIDUAL);
  readonly contactTypeOptions = input<PrimeOptions>([]);
  readonly showCreateNewContactButton = input(true);
  readonly includeFecfileResults = input(true);
  readonly candidateOffice = input<CandidateOfficeType>();
  readonly autosave = input(true);

  readonly contactLookupSelect = output<Contact>();
  readonly createNewContactSelect = output<void>();

  readonly contactTypeReadOnly = computed(() => this.contactTypeOptions().length < 2);
  readonly candidateOfficeLabel = computed(() => LabelUtils.get(CandidateOfficeTypeLabels, this.candidateOffice()));
  readonly showSearchBox = input(true);

  readonly contactTypeLabels: LabelList = ContactTypeLabels;
  searchTerm = '';
  contactLookupList: SelectItemGroup[] = [];

  constructor() {
    effectOnceIf(
      () => {
        const options = this.contactTypeOptions();
        if (options.length === 0) return null;
        return options[0].value as ContactTypes;
      },
      (type) => this.type.set(type),
    );
  }

  async onDropdownSearch(event: AutoCompleteCompleteEvent) {
    const searchTerm = event.query;
    if (searchTerm) {
      this.searchTerm = searchTerm;
      switch (this.type()) {
        case ContactTypes.CANDIDATE:
          this.contactLookupList = (
            await this.contactService.candidateLookup(searchTerm, '', '', this.candidateOffice())
          ).toSelectItemGroups(this.includeFecfileResults(), searchTerm);
          break;
        case ContactTypes.COMMITTEE:
          this.contactService.committeeLookup(searchTerm, '', '').then((response) => {
            this.contactLookupList = response.toSelectItemGroups(this.includeFecfileResults(), this.searchTerm);
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

    this.searchTerm = '';
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
