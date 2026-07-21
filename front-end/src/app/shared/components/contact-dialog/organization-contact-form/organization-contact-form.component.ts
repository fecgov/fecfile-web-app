import { Component, input } from '@angular/core';
import {
  AddressData,
  AddressFormComponent,
  addressSchema,
  populateAddress,
} from '../../signal-inputs/address-form/address-form.component';
import { apply, FieldTree, FormField, schema } from '@angular/forms/signals';
import { TextInput } from '../../signal-inputs/text-input/text.input';
import { TelephoneInput, validateTelephone } from '../../signal-inputs/telephone-input/telephone.input';
import { Contact } from 'app/shared/models/contact.model';
import { validatePattern } from 'app/shared/utils/signal-validator.utils';

export interface OrganizationContactData {
  id: string | null;
  name: string;
  address: AddressData;
  telephone: string;
}

export function populateOrganization(contact?: Contact): OrganizationContactData {
  return {
    id: contact?.id ?? null,
    name: contact?.name ?? '',
    address: populateAddress(contact),
    telephone: contact?.telephone ?? '',
  };
}

export const organizationSchema = schema<OrganizationContactData>((schemaPath) => {
  validatePattern(schemaPath.name, /^[ -~]{0,200}$/, { required: true, max: 200 });
  validateTelephone(schemaPath.telephone);
  apply(schemaPath.address, addressSchema);
});

@Component({
  selector: 'app-organization-contact-form',
  imports: [TextInput, AddressFormComponent, TelephoneInput, FormField],
  template: `
    <app-text-input class="grid-col-6 start-row" label="NAME" inputId="name" [formField]="fields().name" />
    <hr />
    <h3>Address</h3>
    <app-address-form [fields]="fields().address" />
    <app-telephone-input [formField]="fields().telephone" inputId="telephone" label="TELEPHONE" class="grid-col-6" />
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class OrganizationContactFormComponent {
  readonly fields = input.required<FieldTree<OrganizationContactData, string>>();
}
