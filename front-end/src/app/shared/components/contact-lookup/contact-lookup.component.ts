import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ContactType } from 'app/shared/models/contact.model';
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
  @Input() maxFecResults = 10;
  @Input() maxFecfileResults = 10;

  @Output() contactSelect = new EventEmitter<string>();

  selectedContactType =
    new FormControl<ContactType>({} as ContactType);
  selectedContact: FormControl<SelectItem> | null = null;

  contactLookupForm: FormGroup = this.formBuilder.group({
    selectedContactType: this.selectedContactType,
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
      this.contactService.committeeLookup(
        searchTerm, this.maxFecResults,
        this.maxFecfileResults).subscribe((response) => {
          this.contactLookupList = response &&
            response.toSelectItemGroups();
        });
    } else {
      this.contactLookupList = [];
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onContactSelect(event: any) {
    if (event) {
      const value: string = event.value;
      if (value) {
        this.contactSelect.emit(value)
      }
    }
  }

}
