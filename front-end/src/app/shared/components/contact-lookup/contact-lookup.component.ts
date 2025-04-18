import { Component, computed, effect, inject, Injector, input, model, OnInit, output, viewChild } from '@angular/core';

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
import { SignalFormControl } from 'app/shared/utils/signal-form-control';
import { PrimeTemplate, SelectItemGroup } from 'primeng/api';
import { AutoComplete } from 'primeng/autocomplete';
import { Select } from 'primeng/select';
import { HighlightTermsPipe } from '../../pipes/highlight-terms.pipe';

@Component({
  selector: 'app-contact-lookup',
  templateUrl: './contact-lookup.component.html',
  styleUrls: ['./contact-lookup.component.scss'],
  imports: [Select, ReactiveFormsModule, PrimeTemplate, AutoComplete, HighlightTermsPipe],
})
export class ContactLookupComponent implements OnInit {
  readonly injector = inject(Injector);
  public readonly contactService = inject(ContactService);
  readonly contactTypeLabels: LabelList = ContactTypeLabels;
  readonly contactTypeOptions = input.required<PrimeOptions>();
  readonly showCreateNewContactButton = input(true);

  readonly showSearchBox = input<boolean>(true);

  readonly maxFecCommitteeResults = input(10);
  readonly maxFecfileCommitteeResults = input(5);
  readonly maxFecfileIndividualResults = input(10);
  readonly maxFecfileOrganizationResults = input(10);
  readonly includeFecfileResults = input(true);
  readonly candidateOffice = input<CandidateOfficeType>();
  readonly excludeFecIds = input<string[]>([]);
  readonly excludeIds = input<string[]>([]);

  readonly contactTypeSelect = output<ContactTypes>();
  readonly contactLookupSelect = output<Contact>();
  readonly createNewContactSelect = output<void>();

  readonly autoComplete = viewChild<AutoComplete>(AutoComplete);

  readonly contactType = model(ContactTypes.INDIVIDUAL);
  readonly contactTypes = ContactTypes;
  readonly contactTypeReadOnly = computed(() => this.contactTypeOptions().length < 2);
  contactLookupList: SelectItemGroup[] = [];
  readonly candidateOfficeLabel = computed(() => LabelUtils.get(CandidateOfficeTypeLabels, this.candidateOffice()));
  readonly contactTypeFormControl = new SignalFormControl<ContactTypes | null>(this.injector, null, {
    updateOn: 'change',
  });
  readonly searchBoxFormControl = new SignalFormControl(this.injector, '', { updateOn: 'change' });

  searchTerm = '';

  constructor() {
    effect(() => {
      const ac = this.autoComplete();
      if (ac?.dropdownButton) {
        queueMicrotask(() => {
          if (ac.dropdownButton) ac.dropdownButton.nativeElement.tabIndex = -1;
        });
      }
    });

    effect(() => {
      const contactType = this.contactTypeFormControl?.valueChangeSignal();
      if (!contactType) return;
      this.contactType.set(contactType);
      this.contactTypeSelect.emit(contactType);
    });
  }

  ngOnInit() {
    this.contactType.set(this.contactTypeOptions()[0].value as ContactTypes);
    this.contactTypeFormControl.setValue(this.contactType());
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async onDropdownSearch(event: any) {
    const searchTerm = event.query;
    if (searchTerm) {
      this.searchTerm = searchTerm;
      switch (this.contactTypeFormControl.value) {
        case ContactTypes.CANDIDATE:
          this.contactLookupList = (
            await this.contactService.candidateLookup(
              searchTerm,
              this.maxFecCommitteeResults(),
              this.maxFecfileCommitteeResults(),
              this.candidateOffice(),
              this.excludeFecIds(),
              this.excludeIds(),
            )
          ).toSelectItemGroups(this.includeFecfileResults());
          break;
        case ContactTypes.COMMITTEE:
          this.contactLookupList = (
            await this.contactService.committeeLookup(
              searchTerm,
              this.maxFecCommitteeResults(),
              this.maxFecfileCommitteeResults(),
              this.excludeFecIds(),
              this.excludeIds(),
            )
          ).toSelectItemGroups(this.includeFecfileResults());
          break;
        case ContactTypes.INDIVIDUAL:
          this.contactLookupList = (
            await this.contactService.individualLookup(
              searchTerm,
              this.maxFecfileIndividualResults(),
              this.excludeIds(),
            )
          ).toSelectItemGroups();
          break;
        case ContactTypes.ORGANIZATION:
          this.contactLookupList = (
            await this.contactService.organizationLookup(
              searchTerm,
              this.maxFecfileOrganizationResults(),
              this.excludeIds(),
            )
          ).toSelectItemGroups();
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onContactLookupSelect(event: any) {
    if (event?.value) {
      if (event.value instanceof Contact) {
        this.onContactSelect(event.value);
      } else if (event.value instanceof FecApiCandidateLookupData) {
        this.onFecApiCandidateLookupDataSelect(event.value);
      } else if (event.value instanceof FecApiCommitteeLookupData) {
        this.onFecApiCommitteeLookupDataSelect(event.value);
      }
    }
    this.searchBoxFormControl.patchValue('');
  }

  onContactSelect(contact: Contact) {
    if (contact) {
      this.contactLookupSelect.emit(contact);
    }
  }

  onFecApiCandidateLookupDataSelect(data: FecApiCandidateLookupData) {
    if (data.candidate_id) {
      this.contactService.getCandidateDetails(data.candidate_id).then((candidate) => {
        const nameSplit = candidate.name?.split(', ');
        this.contactLookupSelect.emit(
          Contact.fromJSON({
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
          }),
        );
      });
    }
  }

  onFecApiCommitteeLookupDataSelect(data: FecApiCommitteeLookupData) {
    if (data.id) {
      this.contactService.getCommitteeDetails(data.id).then((committeeAccount) => {
        let phone;
        if (committeeAccount?.treasurer_phone) {
          phone = '+1 ' + committeeAccount.treasurer_phone;
        }
        this.contactLookupSelect.emit(
          Contact.fromJSON({
            type: ContactTypes.COMMITTEE,
            committee_id: committeeAccount.committee_id,
            name: committeeAccount.name,
            street_1: committeeAccount.street_1,
            street_2: committeeAccount.street_2,
            city: committeeAccount.city,
            state: committeeAccount.state,
            zip: committeeAccount.zip,
            telephone: phone,
          }),
        );
      });
    }
  }
}
