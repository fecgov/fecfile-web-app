import { Component } from '@angular/core';
import {
  NameData,
  NameFormComponent,
  nameSchema,
  populateName,
} from '../../signal-inputs/forms/name-form/name-form.component';
import {
  AddressData,
  AddressFormComponent,
  addressSchema,
  populateAddress,
} from '../../signal-inputs/forms/address-form/address-form.component';
import { TelephoneInput, validateTelephone } from '../../signal-inputs/telephone-input/telephone.input';
import { TextInput } from '../../signal-inputs/text-input/text.input';
import { apply, FormField, schema } from '@angular/forms/signals';
import { Contact } from 'app/shared/models/contact.model';
import { validatePattern } from 'app/shared/utils/signal-validator.utils';
import { BaseContactForm } from '../base-contact-form';

export interface IndividualContactData {
  id: string | null;
  name: NameData;
  address: AddressData;
  employer: string;
  occupation: string;
  telephone: string;
}

export function populateIndividual(contact?: Contact): IndividualContactData {
  return {
    id: contact?.id ?? null,
    name: populateName(contact),
    address: populateAddress(contact),
    telephone: contact?.telephone ?? '',
    employer: contact?.employer ?? '',
    occupation: contact?.occupation ?? '',
  };
}

export const individualSchema = schema<IndividualContactData>((schemaPath) => {
  apply(schemaPath.name, nameSchema);
  apply(schemaPath.address, addressSchema);
  validateTelephone(schemaPath.telephone);
  validatePattern(schemaPath.employer, /^[ -~]{0,38}$"/, { max: 38 });
  validatePattern(schemaPath.occupation, /^[ -~]{0,38}$"/, { max: 38 });
});

@Component({
  selector: 'app-individual-contact-form',
  imports: [NameFormComponent, AddressFormComponent, TelephoneInput, TextInput, FormField],
  template: `<app-name-form [fields]="fields().name" [checkForDuplicates]="isNewItem()" />
    <hr />
    <h3>Address</h3>
    <app-address-form [fields]="fields().address" />
    <app-telephone-input class="grid-col-3" [formField]="fields().telephone" inputId="telephone" label="TELEPHONE" />
    <hr />
    <h3>Employer</h3>
    <app-text-input class="grid-col-6 start-row" label="EMPLOYER" inputId="employer" [formField]="fields().employer" />
    <app-text-input class="grid-col-6" label="OCCUPATION" inputId="occupation" [formField]="fields().occupation" />`,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class IndividualContactFormComponent extends BaseContactForm<IndividualContactData> {}
