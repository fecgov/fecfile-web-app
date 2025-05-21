import { Component, computed, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { FluidModule } from 'primeng/fluid';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { TransactionTemplateMapType } from 'app/shared/models';

@Component({
  selector: 'app-address-input',
  templateUrl: './address-input.component.html',
  imports: [ReactiveFormsModule, InputText, ErrorMessagesComponent, Select, FluidModule],
})
export class AddressInputComponent {
  readonly form = input.required<FormGroup>();
  readonly formSubmitted = input.required<boolean>();
  readonly templateMap = input<TransactionTemplateMapType>({
    street_1: 'street_1',
    street_2: 'street_2',
    city: 'city',
    state: 'state',
    zip: 'zip',
  } as TransactionTemplateMapType);

  readonly readonly = input(false);
  readonly stateOptions: PrimeOptions = LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary());
  readonly templateMapKeyPrefix = input<'secondary' | 'signatory_1' | 'signatory_2' | 'candidate' | null>(null);
  readonly keyPrefix = input<'subordinate' | null>(null);

  readonly streetOneFieldName = computed(() => {
    if (this.templateMapKeyPrefix() === 'secondary') return this.templateMap()['secondary_street_1'];
    if (this.keyPrefix()) return `${this.keyPrefix()}_street_1`;
    return this.templateMap()['street_1'];
  });
  readonly streetTwoFieldName = computed(() => {
    if (this.templateMapKeyPrefix() === 'secondary') return this.templateMap()['secondary_street_2'];
    if (this.keyPrefix()) return `${this.keyPrefix()}_street_2`;
    return this.templateMap()['street_2'];
  });
  readonly cityFieldName = computed(() => {
    if (this.templateMapKeyPrefix() === 'secondary') return this.templateMap()['secondary_city'];
    if (this.keyPrefix()) return `${this.keyPrefix()}_city`;
    return this.templateMap()['city'];
  });
  readonly stateFieldName = computed(() => {
    if (this.templateMapKeyPrefix() === 'secondary') return this.templateMap()['secondary_state'];
    if (this.keyPrefix()) return `${this.keyPrefix()}_state`;
    return this.templateMap()['state'];
  });
  readonly zipFieldName = computed(() => {
    if (this.templateMapKeyPrefix() === 'secondary') return this.templateMap()['secondary_zip'];
    if (this.keyPrefix()) return `${this.keyPrefix()}_zip`;
    return this.templateMap()['zip'];
  });
}
