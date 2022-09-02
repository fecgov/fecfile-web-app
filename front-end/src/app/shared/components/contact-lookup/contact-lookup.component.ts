import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ContactType } from 'app/shared/models/contact.model';
import { ContactService } from 'app/shared/services/contact.service';
import { PrimeOptions } from 'app/shared/utils/label.utils';
import { debounce } from 'lodash';
import { SelectItem, SelectItemGroup } from 'primeng/api';
import { Dropdown } from 'primeng/dropdown';

@Component({
  selector: 'app-contact-lookup',
  templateUrl: './contact-lookup.component.html',
})
export class ContactLookupComponent {
  @Input() contactTypeOptions: PrimeOptions = [];
  @Input() maxFecResults = 10;
  @Input() maxFecfileResults = 10;
  @Input() searchDelayMillis = 250;

  @Output() contactSelect = new EventEmitter<string>();

  @ViewChild('lookupDropdown') lookupDropdown: Dropdown | null = null;

  selectedContactType =
    new FormControl<ContactType>({} as ContactType);
  selectedContact: FormControl<SelectItem> | null = null;

  contactLookupForm: FormGroup = this.formBuilder.group({
    selectedContactType: this.selectedContactType,
    selectedContact: this.selectedContact
  })

  contactLookupList: SelectItemGroup[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private itemService: ContactService
  ) { }

  onDropdownSearch = debounce((event) => {
    const searchTerm = event?.target?.value;
    if (searchTerm) {
      this.itemService.committeeLookup(
        searchTerm, this.maxFecResults,
        this.maxFecfileResults).subscribe((response) => {
          this.contactLookupList = response &&
            response.toSelectItemGroups();
          if (this.lookupDropdown) {
            this.lookupDropdown.overlayVisible = true;
          }
        });
    }
  }, this.searchDelayMillis);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onContactSelect(event: any) {
    if (event?.originalEvent?.type === 'click') {
      const value: string = event?.value;
      if (value) {
        this.contactSelect.emit(value)
      }
    }
  }

}
