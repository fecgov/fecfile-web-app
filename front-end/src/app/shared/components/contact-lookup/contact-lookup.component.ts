import { Component, effect, EventEmitter, inject, input, Input, OnInit, Output, ViewChild } from '@angular/core';

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
import { AutoComplete } from 'primeng/autocomplete';
import { Select } from 'primeng/select';
import { takeUntil } from 'rxjs';
import { HighlightTermsPipe } from '../../pipes/highlight-terms.pipe';
import { DestroyerComponent } from '../app-destroyer.component';

@Component({
  selector: 'app-contact-lookup',
  templateUrl: './contact-lookup.component.html',
  styleUrls: ['./contact-lookup.component.scss'],
  imports: [Select, ReactiveFormsModule, PrimeTemplate, AutoComplete, HighlightTermsPipe],
})
export class ContactLookupComponent extends DestroyerComponent implements OnInit {
  public readonly contactService = inject(ContactService);
  readonly contactTypeLabels: LabelList = ContactTypeLabels;
  @Input() contactTypeOptions: PrimeOptions = [];
  @Input() showCreateNewContactButton = true;
  @Input() showSearchBoxCallback = () => true;

  @Input() includeFecfileResults = true;
  @Input() candidateOffice?: CandidateOfficeType;
  readonly excludeFecIds = input<string[]>([]);
  readonly excludeIds = input<string[]>([]);

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

  contactType = ContactTypes.INDIVIDUAL;
  contactTypes = ContactTypes;
  contactTypeReadOnly = false;
  contactLookupList: SelectItemGroup[] = [];
  candidateOfficeLabel?: string;
  contactTypeFormControl = new SubscriptionFormControl<ContactTypes | null>(null, { updateOn: 'change' });
  searchBoxFormControl = new SubscriptionFormControl('', { updateOn: 'change' });

  searchTerm = '';

  constructor() {
    super();
    effect(() => {
      this.contactService.excludeFecIds.set(this.excludeFecIds());
      this.contactService.excludeIds.set(this.excludeIds());
    });
  }

  ngOnInit(): void {
    this.contactType = this.contactTypeOptions[0].value as ContactTypes;
    this.contactTypeFormControl.setValue(this.contactType);
    this.contactTypeReadOnly = this.contactTypeOptions.length === 1;
    if (this.candidateOffice) {
      this.candidateOfficeLabel = LabelUtils.get(CandidateOfficeTypeLabels, this.candidateOffice);
    }

    this.contactTypeFormControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((contactType: ContactTypes | null) => {
        if (!contactType) return;
        this.contactType = contactType;
        this.contactTypeSelect.emit(contactType);
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async onDropdownSearch(event: any) {
    const searchTerm = event.query;
    if (searchTerm) {
      this.searchTerm = searchTerm;
      switch (this.contactTypeFormControl.value) {
        case ContactTypes.CANDIDATE:
          this.contactLookupList = (
            await this.contactService.candidateLookup(searchTerm, this.candidateOffice)
          ).toSelectItemGroups(this.includeFecfileResults);
          break;
        case ContactTypes.COMMITTEE:
          this.contactService.committeeLookup(searchTerm).then((response) => {
            this.contactLookupList = response.toSelectItemGroups(this.includeFecfileResults);
          });
          break;
        case ContactTypes.INDIVIDUAL:
          this.contactService.individualLookup(searchTerm).then((response) => {
            this.contactLookupList = response.toSelectItemGroups();
          });
          break;
        case ContactTypes.ORGANIZATION:
          this.contactService.organizationLookup(searchTerm).then((response) => {
            this.contactLookupList = response.toSelectItemGroups();
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
