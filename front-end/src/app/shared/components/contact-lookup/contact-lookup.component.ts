import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { Contact, ContactTypeLabels, ContactTypes, FecApiLookupData } from 'app/shared/models/contact.model';
import { ContactService } from 'app/shared/services/contact.service';
import { LabelList, PrimeOptions } from 'app/shared/utils/label.utils';
import { SelectItemGroup } from 'primeng/api';
import { DestroyerComponent } from '../app-destroyer.component';
import { FecApiCandidateLookupData, FecApiCommitteeLookupData } from '../../models/contact.model';

@Component({
  selector: 'app-contact-lookup',
  templateUrl: './contact-lookup.component.html',
  styleUrls: ['./contact-lookup.component.scss'],
})
export class ContactLookupComponent extends DestroyerComponent implements OnInit {
  @Input() contactTypeOptions: PrimeOptions = [];
  @Input() showCreateNewContactButton = true;
  @Input() showSearchBoxCallback = () => true;

  @Input() maxFecCommitteeResults = 5;
  @Input() maxFecfileCommitteeResults = 5;
  @Input() maxFecfileIndividualResults = 10;
  @Input() maxFecfileOrganizationResults = 10;
  @Input() includeFecfileResults = true;

  @Output() contactTypeSelect = new EventEmitter<ContactTypes>();
  @Output() contactLookupSelect = new EventEmitter<Contact>();
  @Output() createNewContactSelect = new EventEmitter<void>();

  contactType = ContactTypes.INDIVIDUAL;
  contactTypeReadOnly = false;
  contactLookupList: SelectItemGroup[] = [];
  contactTypeLabels: LabelList = ContactTypeLabels;

  contactTypeFormControl = new FormControl();
  searchBoxFormControl = new FormControl();

  searchTerm = '';

  constructor(private contactService: ContactService) {
    super();
  }

  ngOnInit(): void {
    this.contactType = this.contactTypeOptions[0].value as ContactTypes;
    this.contactTypeFormControl.setValue(this.contactType);
    this.contactTypeReadOnly = this.contactTypeOptions.length === 1;

    this.contactTypeFormControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((contactType: ContactTypes) => {
      this.contactType = contactType;
      this.contactTypeSelect.emit(contactType);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDropdownSearch(event: any) {
    const searchTerm = event.query;
    if (searchTerm) {
      this.searchTerm = searchTerm;
      switch (this.contactTypeFormControl.value) {
        case ContactTypes.CANDIDATE:
          this.contactService
            .candidateLookup(searchTerm, this.maxFecCommitteeResults, this.maxFecfileCommitteeResults)
            .subscribe((response) => {
              this.contactLookupList = response && response.toSelectItemGroups(this.includeFecfileResults);
            });
          break;
        case ContactTypes.COMMITTEE:
          this.contactService
            .committeeLookup(searchTerm, this.maxFecCommitteeResults, this.maxFecfileCommitteeResults)
            .subscribe((response) => {
              this.contactLookupList = response && response.toSelectItemGroups(this.includeFecfileResults);
            });
          break;
        case ContactTypes.INDIVIDUAL:
          this.contactService.individualLookup(searchTerm, this.maxFecfileIndividualResults).subscribe((response) => {
            this.contactLookupList = response && response.toSelectItemGroups();
          });
          break;
        case ContactTypes.ORGANIZATION:
          this.contactService
            .organizationLookup(searchTerm, this.maxFecfileOrganizationResults)
            .subscribe((response) => {
              this.contactLookupList = response && response.toSelectItemGroups();
            });
          break;
      }
    } else {
      this.contactLookupList = [];
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onContactLookupSelect(event: any) {
    if (event && event.value) {
      if (event.value instanceof Contact) {
        this.onContactSelect(event.value);
      } else if (event.value instanceof FecApiCandidateLookupData) {
        this.onFecApiCandidateLookupDataSelect(event.value);
      } else if (event.value instanceof FecApiCommitteeLookupData) {
        this.onFecApiCommitteeLookupDataSelect(event.value);
      }
    }
    // this.contactLookupSelect.emit(event);
    this.searchBoxFormControl.patchValue('');
  }

  onCreateNewContactSelect() {
    this.createNewContactSelect.emit();
  }

  isContact(value: Contact | FecApiLookupData) {
    return value instanceof Contact;
  }

  onContactSelect(contact: Contact) {
    this.contactLookupSelect.emit(contact);
    // if (contact) {
    //   switch (contact.type) {
    //     case ContactTypes.CANDIDATE:
    //       this.form.get('candidate_id')?.setValue(contact.candidate_id);
    //       this.form.get('last_name')?.setValue(contact.last_name);
    //       this.form.get('first_name')?.setValue(contact.first_name);
    //       this.form.get('middle_name')?.setValue(contact.middle_name);
    //       this.form.get('prefix')?.setValue(contact.prefix);
    //       this.form.get('suffix')?.setValue(contact.suffix);
    //       this.form.get('employer')?.setValue(contact.employer);
    //       this.form.get('occupation')?.setValue(contact.occupation);
    //       this.form.get('candidate_office')?.setValue(contact.candidate_office);
    //       this.form.get('candidate_state')?.setValue(contact.candidate_state);
    //       this.form.get('candidate_district')?.setValue(contact.candidate_district);
    //       break;
    //     case ContactTypes.COMMITTEE:
    //       this.form.get('committee_id')?.setValue(contact.committee_id);
    //       this.form.get('name')?.setValue(contact.name);
    //       break;
    //   }
    //   this.form.get('country')?.setValue(contact.country);
    //   this.form.get('street_1')?.setValue(contact.street_1);
    //   this.form.get('street_2')?.setValue(contact.street_2);
    //   this.form.get('city')?.setValue(contact.city);
    //   this.form.get('state')?.setValue(contact.state);
    //   this.form.get('zip')?.setValue(contact.zip);
    //   this.form.get('telephone')?.setValue(contact.telephone);
    // }
  }

  onFecApiCandidateLookupDataSelect(data: FecApiCandidateLookupData) {
    if (data.id) {
      // this.fecApiService.getCandidateDetails(data.id).subscribe((candidate) => {
      //   // TODO: fix once we get info from api and set all names below properly
      //   const nameSplit = candidate.name?.split(', ');
      //   this.form.get('type')?.setValue(ContactTypes.CANDIDATE);
      //   this.form.get('candidate_id')?.setValue(candidate.candidate_id);
      //   this.form.get('last_name')?.setValue(nameSplit?.[0]);
      //   this.form.get('first_name')?.setValue(nameSplit?.[1]);
      //   this.form.get('middle_name')?.setValue('');
      //   this.form.get('prefix')?.setValue('');
      //   this.form.get('suffix')?.setValue('');
      //   this.form.get('street_1')?.setValue(candidate.address_street_1);
      //   this.form.get('street_2')?.setValue(candidate.address_street_2);
      //   this.form.get('city')?.setValue(candidate.address_city);
      //   this.form.get('state')?.setValue(candidate.address_state);
      //   this.form.get('zip')?.setValue(candidate.address_zip);
      //   this.form.get('employer')?.setValue('');
      //   this.form.get('occupation')?.setValue('');
      //   this.form.get('candidate_office')?.setValue(candidate.office);
      //   this.form.get('candidate_state')?.setValue(candidate.state);
      //   this.form.get('candidate_district')?.setValue(candidate.district);
      // });
    }
  }

  onFecApiCommitteeLookupDataSelect(data: FecApiCommitteeLookupData) {
    if (data.id) {
      // this.fecApiService.getCommitteeDetails(data.id).subscribe((committeeAccount) => {
      //   let phone;
      //   if (committeeAccount?.treasurer_phone) {
      //     phone = '+1 ' + committeeAccount.treasurer_phone;
      //   }
      //   this.form.get('type')?.setValue(ContactTypes.COMMITTEE);
      //   this.form.get('committee_id')?.setValue(committeeAccount.committee_id);
      //   this.form.get('name')?.setValue(committeeAccount.name);
      //   this.form.get('street_1')?.setValue(committeeAccount.street_1);
      //   this.form.get('street_2')?.setValue(committeeAccount.street_2);
      //   this.form.get('city')?.setValue(committeeAccount.city);
      //   this.form.get('state')?.setValue(committeeAccount.state);
      //   this.form.get('zip')?.setValue(committeeAccount.zip);
      //   this.form.get('telephone')?.setValue(phone);
      // });
    }
  }
}
