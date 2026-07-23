import { Component, effect, input, untracked } from '@angular/core';
import { SelectInput } from '../../select-input/select.input';
import { TextInput } from '../../text-input/text.input';
import { disabled, FormField, required, schema } from '@angular/forms/signals';
import { LabelUtils, StatesCodeLabels, CountryCodeLabels } from 'app/shared/utils/label.utils';
import type { Contact } from 'app/shared/models/contact.model';
import { requiredMessage, validatePattern } from 'app/shared/utils/signal-validator.utils';
import { BaseForm } from '../base-form';

export interface AddressData {
  street_1: string;
  street_2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export function populateAddress(contact?: Contact): AddressData {
  return {
    street_1: contact?.street_1 ?? '',
    street_2: contact?.street_2 ?? '',
    city: contact?.city ?? '',
    state: contact?.state ?? '',
    zip: contact?.zip ?? '',
    country: contact?.country ?? '',
  };
}

export const addressSchema = schema<AddressData>((schemaPath) => {
  validatePattern(schemaPath.street_1, /^[ -~]{0,34}$/, { required: true, max: 34 });
  validatePattern(schemaPath.street_2, /^[ -~]{0,34}$/, { max: 34 });
  validatePattern(schemaPath.city, /^[ -~]{0,30}$/, { required: true, max: 30 });
  validatePattern(schemaPath.state, /^[A-Z]{2}$/, { required: true, max: 2 });
  validatePattern(schemaPath.zip, /^[ -~]{0,9}$/, { max: 9 });
  required(schemaPath.zip, { when: ({ valueOf }) => valueOf(schemaPath.country) === 'USA', message: requiredMessage });
  required(schemaPath.country, { message: requiredMessage });
  disabled(schemaPath.state, ({ valueOf }) => {
    if (!schemaPath.country) return false;
    const country = valueOf(schemaPath.country);
    return country !== 'USA' && country !== '';
  });
});

@Component({
  selector: 'app-address-form',
  imports: [SelectInput, TextInput, FormField],
  template: `
    <app-select-input
      class="grid-col-6"
      labelId="country-label"
      label="COUNTRY/<wbr />REGION"
      [formField]="fields().country!"
      [options]="countryOptions"
    />

    <app-text-input
      class="start-row grid-col-6"
      label="STREET ADDRESS"
      inputId="street_1"
      [formField]="fields().street_1"
    />
    <app-text-input
      class="grid-col-6"
      label="APARTMENT, SUITE, ETC."
      inputId="street_2"
      [formField]="fields().street_2"
    />
    <app-text-input class="grid-col-6" label="CITY" inputId="city" [formField]="fields().city" />
    <app-select-input
      class="grid-col-3"
      labelId="state-label"
      label="STATE/<wbr />TERRITORY"
      [formField]="fields().state"
      [options]="stateOptions()"
    />
    <app-text-input class="grid-col-3" label="ZIP/POSTAL CODE" inputId="zip" [formField]="fields().zip" />
  `,
  styles: `
    :host {
      display: contents;
    }
  `,
})
export class AddressFormComponent extends BaseForm<AddressData> {
  readonly stateOptions = input(LabelUtils.getPrimeOptions(StatesCodeLabels));
  readonly countryOptions = LabelUtils.getPrimeOptions(CountryCodeLabels);

  constructor() {
    super();
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
