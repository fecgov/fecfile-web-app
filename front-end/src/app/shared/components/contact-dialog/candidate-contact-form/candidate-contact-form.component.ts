import { Component, input } from '@angular/core';
import { TextInput } from '../../signal-inputs/text-input/text.input';
import {
  AddressData,
  AddressFormComponent,
  addressSchema,
  populateAddress,
} from '../../signal-inputs/address-form/address-form.component';
import { apply, debounce, FieldTree, FormField, schema } from '@angular/forms/signals';
import {
  NameData,
  NameFormComponent,
  nameSchema,
  populateName,
} from '../../signal-inputs/name-form/name-form.component';
import {
  CandidateOfficeData,
  CandidateOfficeFormComponent,
  candidateOfficeSchema,
  populateOffice,
} from '../../signal-inputs/candidate-office-form/candidate-office-form.component';
import { TelephoneInput, validateTelephone } from '../../signal-inputs/telephone-input/telephone.input';
import { validateFecUnique, validatePattern } from 'app/shared/utils/signal-validator.utils';
import type { Contact } from 'app/shared/models/contact.model';

export interface CandidateContactData {
  id: string | null;
  candidate_id: string;
  name: NameData;
  address: AddressData;
  employer: string;
  occupation: string;
  office: CandidateOfficeData;
  telephone: string;
}

export function populateCandidate(contact?: Contact): CandidateContactData {
  return {
    id: contact?.id ?? null,
    candidate_id: contact?.candidate_id ?? '',
    name: populateName(contact),
    address: populateAddress(contact),
    employer: contact?.employer ?? '',
    occupation: contact?.occupation ?? '',
    office: populateOffice(contact),
    telephone: contact?.telephone ?? '',
  };
}

export const candidateSchema = schema<CandidateContactData>((schemaPath) => {
  validatePattern(schemaPath.candidate_id, /^P\d{8}$|^[H|S]\d[A-Z]{2}\d{5}$/, { required: true, max: 9 });
  validateFecUnique(schemaPath.candidate_id, schemaPath);
  debounce(schemaPath.candidate_id, 300);

  apply(schemaPath.name, nameSchema);
  apply(schemaPath.office, candidateOfficeSchema);
  apply(schemaPath.address, addressSchema);

  validateTelephone(schemaPath.telephone);
  validatePattern(schemaPath.employer, /^[ -~]{0,38}$"/, { max: 38 });
  validatePattern(schemaPath.occupation, /^[ -~]{0,38}$"/, { max: 38 });
});

@Component({
  selector: 'app-candidate-contact-form',
  imports: [
    TextInput,
    AddressFormComponent,
    TelephoneInput,
    CandidateOfficeFormComponent,
    NameFormComponent,
    FormField,
  ],
  template: ` <app-text-input
      class="grid-col-6 start-row"
      [formField]="fields().candidate_id"
      inputId="candidate_id"
      label="CANDIDATE ID"
      [forceUpper]="true"
    />
    <app-name-form [fields]="fields().name" />
    <hr />
    <h3>Address</h3>
    <app-address-form [fields]="fields().address" />
    <app-telephone-input class="grid-col-6" [formField]="fields().telephone" inputId="telephone" label="TELEPHONE" />
    <hr />
    <h3>Employer</h3>
    <app-text-input class="grid-col-6 start-row" label="EMPLOYER" inputId="employer" [formField]="fields().employer" />
    <app-text-input class="grid-col-6" label="OCCUPATION" inputId="occupation" [formField]="fields().occupation" />
    <hr />
    <h3>Office</h3>
    <app-candidate-office-form [fields]="fields().office" />`,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class CandidateContactFormComponent {
  readonly fields = input.required<FieldTree<CandidateContactData, string>>();
}
