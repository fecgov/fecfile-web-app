import { Component, input } from '@angular/core';
import { FormField, schema, FieldTree, apply, validateHttp, debounce } from '@angular/forms/signals';
import { schema as CandidateSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Candidate';
import {
  Address,
  AddressFormComponent,
  addressSchema,
  defaultAddressData,
} from '../../signal-inputs/address-form/address-form.component';
import { NameFields, NameFormComponent } from '../../signal-inputs/name-form/name-form.component';
import { TextInputComponent } from '../../signal-inputs/text-input/text-input.component';
import {
  CandidateOfficeData,
  CandidateOfficeFormComponent,
  candidateOfficeSchema,
  defaultCandidateOfficeData,
} from '../../signal-inputs/candidate-office-form/candidate-office-form.component';
import { TelephoneInputComponent } from '../../signal-inputs/telephone-input/telephone-input.component';
import { CookieService } from 'ngx-cookie-service';
import { getFecUniqueValidator } from 'app/shared/services/contact.service';
import { generatePathMapFromForm, schemaFormValidatorBuilder } from 'app/shared/utils/schema-signal.utils';

export interface CandidateContactData {
  candidate_id: string;
  name: NameFields;
  address: Address;
  employer: string;
  occupation: string;
  office: CandidateOfficeData;
  telephone: string | null;
}

export const defaultCandidateData: CandidateContactData = {
  candidate_id: '',
  name: { last_name: '', first_name: '', middle_name: '', prefix: '', suffix: '' },
  address: { ...defaultAddressData, country: '' },
  employer: '',
  occupation: '',
  office: { ...defaultCandidateOfficeData },
  telephone: null,
};

export function getCandidateSchema(cookieService: CookieService) {
  return schema<CandidateContactData>((schemaPath) => {
    const schemaFieldMap = generatePathMapFromForm(defaultCandidateData);
    schemaFormValidatorBuilder(CandidateSchema, schemaPath, schemaFieldMap);
    apply(schemaPath.office, candidateOfficeSchema);
    apply(schemaPath.address, addressSchema);
    validateHttp(schemaPath.candidate_id, getFecUniqueValidator(cookieService));
    debounce(schemaPath.candidate_id, 300);
  });
}

@Component({
  selector: 'app-candidate-contact-form',
  imports: [
    FormField,
    AddressFormComponent,
    NameFormComponent,
    TextInputComponent,
    CandidateOfficeFormComponent,
    TelephoneInputComponent,
  ],
  templateUrl: './candidate-contact-form.component.html',
  styleUrl: './candidate-contact-form.component.scss',
})
export class CandidateContactFormComponent {
  readonly fields = input.required<FieldTree<CandidateContactData, string>>();
}
