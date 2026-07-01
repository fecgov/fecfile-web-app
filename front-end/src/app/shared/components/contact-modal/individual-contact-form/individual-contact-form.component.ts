import { Component, input } from '@angular/core';
import { NameFields, NameFormComponent, populateName } from '../../signal-inputs/name-form/name-form.component';
import {
  Address,
  AddressFormComponent,
  addressSchema,
  defaultAddressData,
  populateAddress,
} from '../../signal-inputs/address-form/address-form.component';
import { FecInternationalPhoneInputComponent } from '../../fec-international-phone-input/fec-international-phone-input.component';
import { TextInput } from '../../signal-inputs/text-input/text.input';
import { apply, FieldTree, FormField, schema } from '@angular/forms/signals';
import { schema as IndividualSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Individual';
import { generatePathMapFromForm, schemaFormValidatorBuilder } from 'app/shared/utils/signal-schema.utils';
import { ContactTypes, type Contact } from 'app/shared/models/contact.model';

export interface IndividualContactData {
  id: string | null;
  name: NameFields;
  address: Address;
  employer: string;
  occupation: string;
  telephone: string | null;
}

export const defaultIndividualData = {
  id: null,
  name: { last_name: '', first_name: '', middle_name: '', prefix: '', suffix: '' },
  address: {
    ...defaultAddressData,
    country: '',
  },
  employer: '',
  occupation: '',
  telephone: null,
};

export function populateIndividual(contact: Contact): IndividualContactData {
  if (contact.type !== ContactTypes.INDIVIDUAL) return { ...defaultIndividualData };
  return {
    id: contact.id!,
    name: populateName(contact),
    address: populateAddress(contact),
    employer: contact.employer ?? '',
    occupation: contact.occupation ?? '',
    telephone: contact.telephone ?? null,
  };
}

export const individualSchema = schema<IndividualContactData>((schemaPath) => {
  const schemaFieldMap = generatePathMapFromForm(defaultIndividualData);
  schemaFormValidatorBuilder(IndividualSchema, schemaPath, schemaFieldMap);
  apply(schemaPath.address, addressSchema);
});

@Component({
  selector: 'app-individual-contact-form',
  imports: [FormField, NameFormComponent, AddressFormComponent, FecInternationalPhoneInputComponent, TextInput],
  templateUrl: './individual-contact-form.component.html',
  styleUrl: './individual-contact-form.component.scss',
})
export class IndividualContactFormComponent {
  readonly fields = input.required<FieldTree<IndividualContactData, string>>();
}
