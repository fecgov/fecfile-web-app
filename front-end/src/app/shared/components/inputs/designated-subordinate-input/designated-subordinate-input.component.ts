import { Component, EventEmitter, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Contact, ContactTypeLabels, ContactTypes } from 'app/shared/models/contact.model';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { SelectItem } from 'primeng/api';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { TransactionContactLookupComponent } from '../../transaction-contact-lookup/transaction-contact-lookup.component';
import { AddressInputComponent } from '../address-input/address-input.component';
import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'app-designated-subordinate-input',
  templateUrl: './designated-subordinate-input.component.html',
  imports: [
    TransactionContactLookupComponent,
    AddressInputComponent,
    ReactiveFormsModule,
    Select,
    ErrorMessagesComponent,
    InputText,
  ],
})
export class DesignatedSubordinateInputComponent extends BaseInputComponent {
  @Output() designatingCommitteeSelect = new EventEmitter<SelectItem<Contact>>();
  @Output() designatingCommitteeClear = new EventEmitter<void>();
  @Output() subordinateCommitteeSelect = new EventEmitter<SelectItem<Contact>>();
  @Output() subordinateCommitteeClear = new EventEmitter<void>();

  committeeContactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.COMMITTEE]);
  designatedOrSubordinateOptions = LabelUtils.getPrimeOptions([
    [null as any, 'Neither'],
    [true as any, 'Designating committee'],
    [false as any, 'Subordinate committee'],
  ]);

  onDesignatedOrSubordinateChange(value: boolean | null) {
    if (value === true) {
      this.clearSubordinateCommittee();
    } else if (value === false) {
      this.clearDesignatingCommittee();
    } else {
      this.clearSubordinateCommittee();
      this.clearDesignatingCommittee();
    }
  }

  onDesignatingCommitteeSelect(selectItem: SelectItem<Contact>) {
    this.designatingCommitteeSelect.emit(selectItem);
  }

  clearDesignatingCommittee() {
    this.designatingCommitteeClear.emit();
  }

  onSubordinateCommitteeSelect(selectItem: SelectItem<Contact>) {
    this.subordinateCommitteeSelect.emit(selectItem);
  }

  clearSubordinateCommittee() {
    this.subordinateCommitteeClear.emit();
  }
}
