import { Component, input } from '@angular/core';
import {
  Address,
  AddressFormComponent,
  addressSchema,
  defaultAddressData,
} from '../../signal-inputs/address-form/address-form.component';
import { apply, debounce, FieldTree, FormField, schema, validateHttp } from '@angular/forms/signals';
import { TextInputComponent } from '../../signal-inputs/text-input/text-input.component';
import { schema as CommitteeSchema } from 'fecfile-validate/fecfile_validate_js/dist/Contact_Committee';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { FecInternationalPhoneInputComponent } from '../../fec-international-phone-input/fec-international-phone-input.component';
import { CookieService } from 'ngx-cookie-service';
import { getFecUniqueValidator } from 'app/shared/services/contact.service';

export interface CommitteeContactData {
  committee_id: string;
  name: string;
  address: Address;
  telephone: string | null;
}

export const defaultCommitteeData = {
  committee_id: '',
  name: '',
  address: {
    ...defaultAddressData,
    country: '',
  },
  telephone: null,
};

export function getCommitteeSchema(cookieService: CookieService) {
  return schema<CommitteeContactData>((schemaPath) => {
    const schemaFieldMap = SchemaUtils.generatePathMapFromForm(defaultCommitteeData);
    SchemaUtils.schemaFormValidatorBuilder(CommitteeSchema, schemaPath, schemaFieldMap);
    validateHttp(schemaPath.committee_id, getFecUniqueValidator(cookieService));
    debounce(schemaPath.committee_id, 300);
    apply(schemaPath.address, addressSchema);
  });
}

@Component({
  selector: 'app-committee-contact-form',
  imports: [FormField, AddressFormComponent, TextInputComponent, FecInternationalPhoneInputComponent],
  templateUrl: './committee-contact-form.component.html',
  styleUrl: './committee-contact-form.component.scss',
})
export class CommitteeContactFormComponent {
  readonly fields = input.required<FieldTree<CommitteeContactData, string>>();
}
