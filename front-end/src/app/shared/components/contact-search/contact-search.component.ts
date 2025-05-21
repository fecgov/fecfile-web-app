import { Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Contact,
  ContactTypes,
  FecApiCandidateLookupData,
  FecApiCommitteeLookupData,
  FecApiLookupData,
} from 'app/shared/models/contact.model';
import { ContactService } from 'app/shared/services/contact.service';
import { PrimeTemplate, SelectItemGroup } from 'primeng/api';
import { AutoComplete, AutoCompleteCompleteEvent, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { SelectModule } from 'primeng/select';
import { HighlightTermsPipe } from '../../pipes/highlight-terms.pipe';
import { ContactManagementService } from 'app/shared/services/contact-management.service';

@Component({
  selector: 'app-contact-search',
  templateUrl: './contact-search.component.html',
  styleUrls: ['./contact-search.component.scss'],
  imports: [SelectModule, FormsModule, PrimeTemplate, AutoComplete, HighlightTermsPipe],
})
export class ContactSearchComponent {
  readonly contactService = inject(ContactService);
  readonly cmservice = inject(ContactManagementService);

  readonly key = input.required<string>();
  readonly isBare = input(true);

  readonly manager = computed(() => this.cmservice.get(this.key()));

  contactLookupList: SelectItemGroup[] = [];
  searchTerm = '';

  async onDropdownSearch(event: AutoCompleteCompleteEvent) {
    const searchTerm = event.query;
    if (searchTerm) {
      this.searchTerm = searchTerm;
      switch (this.manager().contactType()) {
        case ContactTypes.CANDIDATE:
          this.contactLookupList = (await this.contactService.candidateLookup(searchTerm)).toSelectItemGroups(
            this.isBare(),
          );
          break;
        case ContactTypes.COMMITTEE:
          this.contactService.committeeLookup(searchTerm).then((response) => {
            this.contactLookupList = response?.toSelectItemGroups(this.isBare());
          });
          break;
        case ContactTypes.INDIVIDUAL:
          this.contactService.individualLookup(searchTerm).then((response) => {
            this.contactLookupList = response?.toSelectItemGroups();
          });
          break;
        case ContactTypes.ORGANIZATION:
          this.contactService.organizationLookup(searchTerm).then((response) => {
            this.contactLookupList = response?.toSelectItemGroups();
          });
          break;
      }
    } else {
      this.contactLookupList = [];
    }
  }

  isContact(value: Contact | FecApiLookupData) {
    return value instanceof Contact;
  }

  async onContactLookupSelect(event: AutoCompleteSelectEvent) {
    this.searchTerm = '';
    let contact: Contact;
    if (!event?.value) return;
    if (event.value instanceof Contact) {
      contact = event.value;
    } else if (event.value instanceof FecApiCandidateLookupData) {
      contact = await this.onFecApiCandidateLookupDataSelect(event.value);
    } else {
      contact = await this.onFecApiCommitteeLookupDataSelect(event.value);
    }
    this.manager().contact.set(contact);
    if (this.isBare()) this.manager().outerContact.set(contact);
  }

  private async onFecApiCandidateLookupDataSelect(data: FecApiCandidateLookupData) {
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
    if (!data.id) throw new Error('Invlaid Committee');
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
