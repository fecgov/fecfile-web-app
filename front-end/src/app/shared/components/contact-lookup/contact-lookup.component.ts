import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Contact, ContactTypes, FecApiLookupData } from 'app/shared/models/contact.model';
import { ContactService } from 'app/shared/services/contact.service';
import { PrimeOptions } from 'app/shared/utils/label.utils';
import { SelectItem, SelectItemGroup } from 'primeng/api';

@Component({
  selector: 'app-contact-lookup',
  templateUrl: './contact-lookup.component.html',
  styleUrls: ['./contact-lookup.component.scss'],
})
export class ContactLookupComponent {
  @Input() contactTypeOptions: PrimeOptions = [];
  @Input() contactTypeFormControl: FormControl = new FormControl();
  @Input() contactTypeReadOnly = false;
  @Input() showCreateNewContactButton = true;

  @Input() maxFecCommitteeResults = 5;
  @Input() maxFecfileCommitteeResults = 5;
  @Input() maxFecfileIndividualResults = 10;
  @Input() maxFecfileOrganizationResults = 10;

  @Output() contactLookupSelect = new EventEmitter<Contact | FecApiLookupData>();
  @Output() createNewContactSelect = new EventEmitter<void>();

  selectedContact: FormControl<SelectItem> | null = null;

  contactLookupForm: FormGroup = this.formBuilder.group({
    selectedContactType: this.contactTypeFormControl,
    selectedContact: this.selectedContact,
  });

  contactLookupList: SelectItemGroup[] = [];

  searchTerm = '';

  constructor(
    private formBuilder: FormBuilder,
    private contactService: ContactService
  ) { }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDropdownSearch(event: any) {
    const searchTerm = event.query;
    if (searchTerm) {
      this.searchTerm = searchTerm;
      switch (this.contactTypeFormControl.value) {
        case ContactTypes.COMMITTEE:
          this.contactService
            .committeeLookup(searchTerm, this.maxFecCommitteeResults, this.maxFecfileCommitteeResults)
            .subscribe((response) => {
              this.contactLookupList = response && response.toSelectItemGroups();
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
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onCreateNewContactSelect() {
    this.createNewContactSelect.emit();
  }

  isContact(value: Contact | FecApiLookupData) {
    return value instanceof Contact;
  }

}
