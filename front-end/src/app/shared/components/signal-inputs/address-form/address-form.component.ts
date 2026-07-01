import { Component, effect, input, untracked } from '@angular/core';
import { disabled, FieldTree, FormField, schema } from '@angular/forms/signals';
import { CountryCodeLabels, LabelUtils, StatesCodeLabels } from 'app/shared/utils/label.utils';
import { TextInput } from '../text-input/text.input';
import { SelectInput } from '../select-input/select.input';
import type { Contact } from 'app/shared/models/contact.model';

export interface Address {
  street_1: string;
  street_2: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
}

export const defaultAddressData: Address = {
  street_1: '',
  street_2: '',
  city: '',
  state: '',
  zip: '',
};

export function populateAddress(contact: Contact): Address {
  return {
    street_1: contact.street_1 ?? '',
    street_2: contact.street_2 ?? '',
    city: contact.city ?? '',
    state: contact.state ?? '',
    zip: contact.zip ?? '',
    country: contact.country ?? '',
  };
}

export const addressSchema = schema<Address>((schemaPath) => {
  disabled(schemaPath.state, ({ valueOf }) => {
    if (!schemaPath.country) return false;
    const country = valueOf(schemaPath.country);
    return country !== 'USA' && country !== '';
  });
});

@Component({
  selector: 'app-address-form',
  imports: [FormField, TextInput, SelectInput],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.scss',
})
export class AddressFormComponent {
  readonly fields = input.required<FieldTree<Address, string>>();
  readonly stateOptions = input(LabelUtils.getPrimeOptions(StatesCodeLabels));
  readonly countryOptions = LabelUtils.getPrimeOptions(CountryCodeLabels);

  constructor() {
    effect(() => {
      const countryField = this.fields().country;
      if (!countryField) return;

      const country = countryField().value();
      if (country === '') return;

      untracked(() => {
        const currentState = this.fields().state().value();

        if (country === 'USA') {
          if (currentState === 'ZZ') {
            this.fields().state().value.set('');
          }
        } else {
          if (currentState !== 'ZZ') {
            this.fields().state().value.set('ZZ');
          }
        }
      });
    });
  }
}
