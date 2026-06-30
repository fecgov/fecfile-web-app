import { Component, input } from '@angular/core';
import { NameFields, NameFormComponent } from '../../signal-inputs/name-form/name-form.component';
import {
  Address,
  AddressFormComponent,
  addressSchema,
  defaultAddressData,
} from '../../signal-inputs/address-form/address-form.component';
import { FecInternationalPhoneInputComponent } from '../../fec-international-phone-input/fec-international-phone-input.component';
import { TextInputComponent } from '../../signal-inputs/text-input/text-input.component';
import { apply, FieldTree, FormField, schema } from '@angular/forms/signals';
import { schema as IndividualSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Individual';
import { generatePathMapFromForm, schemaFormValidatorBuilder } from 'app/shared/utils/schema-signal.utils';

export interface IndividualContactData {
  name: NameFields;
  address: Address;
  employer: string;
  occupation: string;
  telephone: string | null;
}

export const defaultIndividualData = {
  name: { last_name: '', first_name: '', middle_name: '', prefix: '', suffix: '' },
  address: {
    ...defaultAddressData,
    country: '',
  },
  employer: '',
  occupation: '',
  telephone: null,
};

export const individualSchema = schema<IndividualContactData>((schemaPath) => {
  const schemaFieldMap = generatePathMapFromForm(defaultIndividualData);
  schemaFormValidatorBuilder(IndividualSchema, schemaPath, schemaFieldMap);
  apply(schemaPath.address, addressSchema);
});

@Component({
  selector: 'app-individual-contact-form',
  imports: [
    FormField,
    NameFormComponent,
    AddressFormComponent,
    FecInternationalPhoneInputComponent,
    TextInputComponent,
  ],
  templateUrl: './individual-contact-form.component.html',
  styleUrl: './individual-contact-form.component.scss',
})
export class IndividualContactFormComponent {
  readonly fields = input.required<FieldTree<IndividualContactData, string>>();
}
