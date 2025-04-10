import { Component, computed, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { FluidModule } from 'primeng/fluid';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'app-address-input',
  templateUrl: './address-input.component.html',
  imports: [ReactiveFormsModule, InputText, ErrorMessagesComponent, Select, FluidModule],
})
export class AddressInputComponent extends BaseInputComponent {
  readonly = input(false);
  readonly stateOptions = input(LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary()));
  readonly templateMapKeyPrefix = input('');
  readonly keyPrefix = input('');

  readonly streetOneFieldName = computed(() => {
    if (this.templateMapKeyPrefix() === 'secondary') return this.templateMap()['secondary_street_1'];
    if (!this.keyPrefix()) return this.templateMap()['street_1'];
    return `${this.keyPrefix}street_1`;
  });
  readonly streetTwoFieldName = computed(() => {
    if (this.templateMapKeyPrefix() === 'secondary') return this.templateMap()['secondary_street_2'];
    if (!this.keyPrefix()) return this.templateMap()['street_2'];
    return `${this.keyPrefix}street_2`;
  });
  readonly cityFieldName = computed(() => {
    if (this.templateMapKeyPrefix() === 'secondary') return this.templateMap()['secondary_city'];
    if (!this.keyPrefix()) return this.templateMap()['city'];
    return `${this.keyPrefix}city`;
  });
  readonly stateFieldName = computed(() => {
    if (this.templateMapKeyPrefix() === 'secondary') return this.templateMap()['secondary_state'];
    if (!this.keyPrefix()) return this.templateMap()['state'];
    return `${this.keyPrefix}state`;
  });
  readonly zipFieldName = computed(() => {
    if (this.templateMapKeyPrefix() === 'secondary') return this.templateMap()['secondary_zip'];
    if (!this.keyPrefix()) return this.templateMap()['zip'];
    return `${this.keyPrefix}zip`;
  });
}
