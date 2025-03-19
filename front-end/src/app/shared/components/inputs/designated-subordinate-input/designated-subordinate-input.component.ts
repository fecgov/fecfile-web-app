import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Contact, ContactTypeLabels, ContactTypes } from 'app/shared/models/contact.model';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
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
    InputText
  ],
})
export class DesignatedSubordinateInputComponent extends BaseInputComponent {
  committeeContactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.COMMITTEE]);
  designatedOrSubordinateOptions = LabelUtils.getPrimeOptions([
    [null as any, 'Neither'],
    [true as any, 'Designating committee'],
    [false as any, 'Subordinate committee'],
  ]);

  get designatedOrSubordinateField(): SubscriptionFormControl | null {
    return this.form.get('filer_designated_to_make_coordinated_expenditures') as SubscriptionFormControl;
  }

  set designatedOrSubordinateField(control: SubscriptionFormControl) {
    control.markAsPristine();
    this.form.setControl('filer_designated_to_make_coordinated_expenditures', control);
  }

  get designatedOrSubordinate(): boolean {
    return this.designatedOrSubordinateField?.value ?? '';
  }

  set designatedOrSubordinate(value: boolean | null) {
    this.designatedOrSubordinateField?.setValue(value);
  }

  updateFormWithDesignatingCommittee(selectItem: SelectItem<Contact>) {
    const contact: Contact = selectItem?.value;
    this.form.get('designating_committee_id_number')?.setValue(contact.committee_id);
    this.form.get('designating_committee_name')?.setValue(contact.name);
  }

  updateFormWithSubordinateCommittee(selectItem: SelectItem<Contact>) {
    const contact: Contact = selectItem?.value;
    this.form.get('subordinate_committee_id_number')?.setValue(contact.committee_id);
    this.form.get('subordinate_committee_name')?.setValue(contact.name);
    this.form.get('subordinate_street_1')?.setValue(contact.street_1);
    this.form.get('subordinate_street_2')?.setValue(contact.street_2);
    this.form.get('subordinate_city')?.setValue(contact.city);
    this.form.get('subordinate_state')?.setValue(contact.state);
    this.form.get('subordinate_zip')?.setValue(contact.zip);
  }

}
