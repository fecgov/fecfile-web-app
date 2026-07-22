import { Component } from '@angular/core';
import { TextInput } from '../../signal-inputs/text-input/text.input';
import { apply, debounce, FormField, schema } from '@angular/forms/signals';
import {
  AddressData,
  AddressFormComponent,
  addressSchema,
  populateAddress,
} from '../../signal-inputs/address-form/address-form.component';
import { TelephoneInput, validateTelephone } from '../../signal-inputs/telephone-input/telephone.input';
import { validateFecUnique, validatePattern } from 'app/shared/utils/signal-validator.utils';
import type { Contact } from 'app/shared/models/contact.model';
import { DuplicateContactComponent } from '../duplicate-contact/duplicate-contact.component';
import { BaseContactForm } from '../base-contact-form';

export interface CommitteeContactData {
  id: string | null;
  committee_id: string;
  name: string;
  address: AddressData;
  telephone: string;
}

export function populateCommittee(contact?: Contact): CommitteeContactData {
  return {
    id: contact?.id ?? null,
    committee_id: contact?.committee_id ?? '',
    name: contact?.name ?? '',
    address: populateAddress(contact),
    telephone: contact?.telephone ?? '',
  };
}

export const committeeSchema = schema<CommitteeContactData>((schemaPath) => {
  validatePattern(schemaPath.name, /^[ -~]{0,200}$/, { required: true, max: 200 });
  validatePattern(schemaPath.committee_id, /^C\d{8}$/, { required: true, max: 9 });
  validateFecUnique(schemaPath.committee_id, schemaPath);
  debounce(schemaPath.committee_id, 300);
  apply(schemaPath.address, addressSchema);
  validateTelephone(schemaPath.telephone);
});

@Component({
  selector: 'app-committee-contact-form',
  imports: [TextInput, FormField, AddressFormComponent, TelephoneInput, DuplicateContactComponent],
  template: `
    <app-text-input
      class="grid-col-6 start-row"
      [formField]="fields().committee_id"
      inputId="committee_id"
      label="COMMITTEE ID"
      [forceUpper]="true"
    />
    @if (isNewItem()) {
      <app-duplicate-contact type="COM" [data]="{ committee_id: this.fields().committee_id().value() }" />
    }
    <app-text-input class="grid-col-6" [formField]="fields().name" inputId="name" label="NAME" />
    <hr />

    <h3>Address</h3>
    <app-address-form [fields]="fields().address" />
    <app-telephone-input [formField]="fields().telephone" inputId="telephone" class="grid-col-6" label="TELEPHONE" />
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class CommitteeContactFormComponent extends BaseContactForm<CommitteeContactData> {}
