import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { Contact, ContactTypeLabels, ContactTypes, FecApiLookupData } from 'app/shared/models/contact.model';
import { ContactService } from 'app/shared/services/contact.service';
import { LabelList, PrimeOptions } from 'app/shared/utils/label.utils';
import { SelectItemGroup } from 'primeng/api';
import { DestroyerComponent } from '../app-destroyer.component';

@Component({
  selector: 'app-contact-lookup',
  templateUrl: './contact-lookup.component.html',
  styleUrls: ['./contact-lookup.component.scss'],
})
export class ContactLookupComponent extends DestroyerComponent implements OnInit {
  @Input() contactType?: ContactTypes;
  @Input() contactTypeOptions: PrimeOptions = [];
  @Input() contactTypeReadOnly = false;
  @Input() showCreateNewContactButton = true;
  @Input() showSearchBoxCallback = () => true;

  @Input() maxFecCommitteeResults = 5;
  @Input() maxFecfileCommitteeResults = 5;
  @Input() maxFecfileIndividualResults = 10;
  @Input() maxFecfileOrganizationResults = 10;
  @Input() includeFecfileResults = true;

  @Output() contactTypeSelect = new EventEmitter<ContactTypes>();
  @Output() contactLookupSelect = new EventEmitter<Contact | FecApiLookupData>();
  @Output() createNewContactSelect = new EventEmitter<void>();

  contactLookupList: SelectItemGroup[] = [];
  contactTypeLabels: LabelList = ContactTypeLabels;

  contactTypeFormControl = new FormControl();
  searchBoxFormControl = new FormControl();

  searchTerm = '';

  constructor(private contactService: ContactService) {
    super();
  }

  ngOnInit(): void {
    if (!this.contactType && this.contactTypeOptions && this.contactTypeOptions.length > 0) {
      this.contactTypeFormControl.setValue(this.contactTypeOptions[0].value);
    } else {
      this.contactTypeFormControl.setValue(this.contactType);
    }

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
    this.contactLookupSelect.emit(event);
    this.searchBoxFormControl.patchValue('');
  }

  onCreateNewContactSelect() {
    this.createNewContactSelect.emit();
  }

  isContact(value: Contact | FecApiLookupData) {
    return value instanceof Contact;
  }
}
