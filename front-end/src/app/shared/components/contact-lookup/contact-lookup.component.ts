import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Contact, ContactTypes } from 'app/shared/models/contact.model';
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
  @Input() contactTypeInputId = 'entity_type';
  @Input() contactTypeFormControl: FormControl = new FormControl();
  @Input() contactTypeReadOnly = true;
  @Input() contactTypeStyleClass = "";

  @Input() maxFecResults = 10;
  @Input() maxFecfileResults = 10;

  @Output() contactSelect = new EventEmitter<Contact>();

  selectedContact: FormControl<SelectItem> | null = null;

  contactLookupForm: FormGroup = this.formBuilder.group({
    selectedContactType: this.contactTypeFormControl,
    selectedContact: this.selectedContact
  })

  contactLookupList: SelectItemGroup[] = [];

  searchTerm = '';

  constructor(
    private formBuilder: FormBuilder,
    private contactService: ContactService
  ) { }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDropdownSearch(event: any) {
    const searchTerm = event?.query;
    if (searchTerm) {
      this.searchTerm = searchTerm;
      switch (this.contactTypeFormControl?.value) {
        case ContactTypes.COMMITTEE:
          this.contactService.committeeLookup(
            searchTerm, this.maxFecResults,
            this.maxFecfileResults).subscribe((response) => {
              this.contactLookupList = response &&
                response.toSelectItemGroups();
            });
          break;
        case ContactTypes.INDIVIDUAL:
          this.contactService.individualLookup(searchTerm,
            this.maxFecfileResults).subscribe((response) => {
              this.contactLookupList = response &&
                response.toSelectItemGroups();
            });
          break;
      }
    } else {
      this.contactLookupList = [];
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onContactSelect(event: any) {
    if (event) {
      const value: Contact = event.value;
      if (value) {
        this.contactSelect.emit(value)
      }
    }
  }

}
