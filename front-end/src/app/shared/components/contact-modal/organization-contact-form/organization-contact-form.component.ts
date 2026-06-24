import { Component, input } from '@angular/core';
import {
  Address,
  AddressFormComponent,
  addressSchema,
  defaultAddressData,
} from '../../signal-inputs/address-form/address-form.component';
import { TextInputComponent } from '../../signal-inputs/text-input/text-input.component';
import { FecInternationalPhoneInputComponent } from '../../fec-international-phone-input/fec-international-phone-input.component';
import { apply, FieldTree, FormField, schema } from '@angular/forms/signals';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { schema as OrganizationSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Organization';

export interface OrganizationContactData {
  name: string;
  address: Address;
  telephone: string | null;
}

export const defaultOrganizationData = {
  name: '',
  address: {
    ...defaultAddressData,
    country: '',
  },
  telephone: null,
};

export const organizationSchema = schema<OrganizationContactData>((schemaPath) => {
  const schemaFieldMap = SchemaUtils.generatePathMapFromForm(defaultOrganizationData);
  SchemaUtils.schemaFormValidatorBuilder(OrganizationSchema, schemaPath, schemaFieldMap);
  apply(schemaPath.address, addressSchema);
});

@Component({
  selector: 'app-organization-contact-form',
  imports: [TextInputComponent, AddressFormComponent, FecInternationalPhoneInputComponent, FormField],
  templateUrl: './organization-contact-form.component.html',
  styleUrl: './organization-contact-form.component.scss',
})
export class OrganizationContactFormComponent {
  readonly fields = input.required<FieldTree<OrganizationContactData, string>>();
}
