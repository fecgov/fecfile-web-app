import { Component, input } from '@angular/core';
import {
  Address,
  AddressFormComponent,
  addressSchema,
  defaultAddressData,
  populateAddress,
} from '../../signal-inputs/address-form/address-form.component';
import { apply, debounce, FieldTree, FormField, schema } from '@angular/forms/signals';
import { TextInput } from '../../signal-inputs/text-input/text.input';
import { schema as CommitteeSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Committee';
import { generatePathMapFromForm, schemaFormValidatorBuilder } from 'app/shared/utils/signal-schema.utils';
import { TelephoneInputComponent } from '../../signal-inputs/telephone-input/telephone-input.component';
import { ContactTypes, type Contact } from 'app/shared/models/contact.model';
import { validateFecUnique } from 'app/shared/utils/validators.signals.utils';

export interface CommitteeContactData {
  id: string | null;
  committee_id: string;
  name: string;
  address: Address;
  telephone: string | null;
}

export const defaultCommitteeData = {
  id: null,
  committee_id: '',
  name: '',
  address: {
    ...defaultAddressData,
    country: '',
  },
  telephone: null,
};

export function populateCommittee(contact: Contact): CommitteeContactData {
  if (contact.type !== ContactTypes.COMMITTEE) return { ...defaultCommitteeData };
  return {
    id: contact.id!,
    committee_id: contact.committee_id!,
    name: contact.name!,
    address: populateAddress(contact),
    telephone: contact.telephone ?? null,
  };
}

export const committeeSchema = schema<CommitteeContactData>((schemaPath) => {
  const schemaFieldMap = generatePathMapFromForm(defaultCommitteeData);
  schemaFormValidatorBuilder(CommitteeSchema, schemaPath, schemaFieldMap);
  validateFecUnique(schemaPath.committee_id, schemaPath);
  debounce(schemaPath.committee_id, 300);
  apply(schemaPath.address, addressSchema);
});

@Component({
  selector: 'app-committee-contact-form',
  imports: [FormField, AddressFormComponent, TextInput, TelephoneInputComponent],
  templateUrl: './committee-contact-form.component.html',
  styleUrl: './committee-contact-form.component.scss',
})
export class CommitteeContactFormComponent {
  readonly fields = input.required<FieldTree<CommitteeContactData, string>>();
}
