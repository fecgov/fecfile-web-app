import { Component, effect, model, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Contact, ContactTypeLabels, ContactTypes } from 'app/shared/models/contact.model';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
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
  readonly committeeContactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [
    ContactTypes.COMMITTEE,
  ]);
  readonly designatedOrSubordinateOptions = LabelUtils.getPrimeOptions([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [null as any, 'Neither'],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [true as any, 'Designating committee'],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [false as any, 'Subordinate committee'],
  ]);

  readonly designatingCommittee = model.required<Contact | null>();
  readonly subordinateCommitee = model.required<Contact | null>();

  constructor() {
    super();
    effect(() => {
      if (this.designatingCommittee()) {
        this.form.get('contact_4_lookup')?.updateValueAndValidity();
        this.form.updateValueAndValidity();
      } else {
        this.form.removeControl('contact_4_lookup');
      }
    });

    effect(() => {
      if (this.subordinateCommitee()) {
        this.form.get('contact_5_lookup')?.updateValueAndValidity();
        this.form.updateValueAndValidity();
      } else {
        this.form.removeControl('contact_5_lookup');
      }
    });
  }

  onSubordinateCommitteeIdBlur() {
    this.updateSubordinateValueAndValidity();
  }

  onDesignatedOrSubordinateChange(value: boolean | null) {
    if (value === true) {
      this.subordinateCommitee.set(null);
    } else if (value === false) {
      this.designatingCommittee.set(null);
    } else if (value === null) {
      this.form.get('filer_designated_to_make_coordinated_expenditures')?.setValue(null);
      this.designatingCommittee.set(null);
      this.subordinateCommitee.set(null);
    }
  }

  updateSubordinateValueAndValidity() {
    this.form.get('subordinate_committee_id_number')?.updateValueAndValidity();
    this.form.get('subordinate_committee_name')?.updateValueAndValidity();
    this.form.get('subordinate_street_1')?.updateValueAndValidity();
    this.form.get('subordinate_street_2')?.updateValueAndValidity();
    this.form.get('subordinate_city')?.updateValueAndValidity();
    this.form.get('subordinate_state')?.updateValueAndValidity();
    this.form.get('subordinate_zip')?.updateValueAndValidity();
    this.form.updateValueAndValidity();
  }
}
