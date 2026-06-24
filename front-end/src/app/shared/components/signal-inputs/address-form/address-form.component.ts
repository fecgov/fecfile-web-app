import { Component, effect, input, untracked } from '@angular/core';
import { disabled, FieldTree, schema } from '@angular/forms/signals';
import { CountryCodeLabels, LabelUtils, StatesCodeLabels } from 'app/shared/utils/label.utils';
import { TextInputComponent } from '../text-input/text-input.component';
import { SelectInputComponent } from '../select-input/select-input.component';

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

export const addressSchema = schema<Address>((schemaPath) => {
  disabled(schemaPath.state, ({ valueOf }) => {
    if (!schemaPath.country) return false;
    const country = valueOf(schemaPath.country);
    return country !== 'USA' && country !== '';
  });
});

@Component({
  selector: 'app-address-form',
  imports: [TextInputComponent, SelectInputComponent],
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
        if (country === 'USA') {
          this.fields().state().value.set('');
        } else {
          this.fields().state().value.set('ZZ');
        }
      });
    });
  }
}
