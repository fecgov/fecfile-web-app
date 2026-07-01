import { Component, input } from '@angular/core';
import { FormField, schema, FieldTree, apply, debounce } from '@angular/forms/signals';
import { schema as CandidateSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Candidate';
import {
  Address,
  AddressFormComponent,
  addressSchema,
  defaultAddressData,
  populateAddress,
} from '../../signal-inputs/address-form/address-form.component';
import { NameFields, NameFormComponent, populateName } from '../../signal-inputs/name-form/name-form.component';
import { TextInput } from '../../signal-inputs/text-input/text.input';
import {
  CandidateOfficeData,
  CandidateOfficeFormComponent,
  candidateOfficeSchema,
  defaultCandidateOfficeData,
  populateOffice,
} from '../../signal-inputs/candidate-office-form/candidate-office-form.component';
import { TelephoneInputComponent } from '../../signal-inputs/telephone-input/telephone-input.component';
import { generatePathMapFromForm, schemaFormValidatorBuilder } from 'app/shared/utils/signal-schema.utils';
import { ContactTypes, type Contact } from 'app/shared/models/contact.model';
import { validateFecUnique } from 'app/shared/utils/validators.signals.utils';

export interface CandidateContactData {
  id: string | null;
  candidate_id: string;
  name: NameFields;
  address: Address;
  employer: string;
  occupation: string;
  office: CandidateOfficeData;
  telephone: string | null;
}

export function populateCandidate(contact: Contact): CandidateContactData {
  if (contact.type !== ContactTypes.CANDIDATE) return { ...defaultCandidateData };
  return {
    id: contact.id!,
    candidate_id: contact.candidate_id!,
    name: populateName(contact),
    address: populateAddress(contact),
    employer: contact.employer ?? '',
    occupation: contact.occupation ?? '',
    office: populateOffice(contact),
    telephone: contact.telephone ?? null,
  };
}

export const defaultCandidateData: CandidateContactData = {
  id: null,
  candidate_id: '',
  name: { last_name: '', first_name: '', middle_name: '', prefix: '', suffix: '' },
  address: { ...defaultAddressData, country: '' },
  employer: '',
  occupation: '',
  office: { ...defaultCandidateOfficeData },
  telephone: null,
};

export const candidateSchema = schema<CandidateContactData>((schemaPath) => {
  const schemaFieldMap = generatePathMapFromForm(defaultCandidateData);
  schemaFormValidatorBuilder(CandidateSchema, schemaPath, schemaFieldMap);
  apply(schemaPath.office, candidateOfficeSchema);
  apply(schemaPath.address, addressSchema);
  validateFecUnique(schemaPath.candidate_id, schemaPath);
  debounce(schemaPath.candidate_id, 300);
});

@Component({
  selector: 'app-candidate-contact-form',
  imports: [
    FormField,
    AddressFormComponent,
    NameFormComponent,
    TextInput,
    CandidateOfficeFormComponent,
    TelephoneInputComponent,
  ],
  templateUrl: './candidate-contact-form.component.html',
  styleUrl: './candidate-contact-form.component.scss',
})
export class CandidateContactFormComponent {
  readonly fields = input.required<FieldTree<CandidateContactData, string>>();
}
