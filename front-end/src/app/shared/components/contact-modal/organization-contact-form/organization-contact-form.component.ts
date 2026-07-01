import { Component, input } from '@angular/core';
import {
  Address,
  AddressFormComponent,
  addressSchema,
  defaultAddressData,
  populateAddress,
} from '../../signal-inputs/address-form/address-form.component';
import { TextInput } from '../../signal-inputs/text-input/text.input';
import { FecInternationalPhoneInputComponent } from '../../fec-international-phone-input/fec-international-phone-input.component';
import { apply, FieldTree, FormField, schema } from '@angular/forms/signals';
import { schema as OrganizationSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Organization';
import { generatePathMapFromForm, schemaFormValidatorBuilder } from 'app/shared/utils/signal-schema.utils';
import { type Contact, ContactTypes } from 'app/shared/models/contact.model';

export interface OrganizationContactData {
  id: string | null;
  name: string;
  address: Address;
  telephone: string | null;
}

export const defaultOrganizationData = {
  id: null,
  name: '',
  address: {
    ...defaultAddressData,
    country: '',
  },
  telephone: null,
};

export function populateOrganization(contact: Contact): OrganizationContactData {
  if (contact.type !== ContactTypes.ORGANIZATION) return { ...defaultOrganizationData };
  return {
    id: contact.id!,
    name: contact.name!,
    address: populateAddress(contact),
    telephone: null,
  };
}

export const organizationSchema = schema<OrganizationContactData>((schemaPath) => {
  const schemaFieldMap = generatePathMapFromForm(defaultOrganizationData);
  schemaFormValidatorBuilder(OrganizationSchema, schemaPath, schemaFieldMap);
  apply(schemaPath.address, addressSchema);
});

@Component({
  selector: 'app-organization-contact-form',
  imports: [TextInput, AddressFormComponent, FecInternationalPhoneInputComponent, FormField],
  templateUrl: './organization-contact-form.component.html',
  styleUrl: './organization-contact-form.component.scss',
})
export class OrganizationContactFormComponent {
  readonly fields = input.required<FieldTree<OrganizationContactData, string>>();
}
