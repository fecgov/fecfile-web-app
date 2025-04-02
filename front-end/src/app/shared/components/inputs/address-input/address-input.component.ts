import { Component, Input, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
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
export class AddressInputComponent extends BaseInputComponent implements OnInit {
  @Input() readonly = false;
  @Input() stateOptions: PrimeOptions = LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary());
  @Input() templateMapKeyPrefix = '';
  @Input() keyPrefix = '';

  streetOneFieldName = '';
  streetTwoFieldName = '';
  cityFieldName = '';
  stateFieldName = '';
  zipFieldName = '';

  ngOnInit(): void {
    if (this.templateMapKeyPrefix === 'secondary') {
      this.streetOneFieldName = this.templateMap['secondary_street_1'];
      this.streetTwoFieldName = this.templateMap['secondary_street_2'];
      this.cityFieldName = this.templateMap['secondary_city'];
      this.stateFieldName = this.templateMap['secondary_state'];
      this.zipFieldName = this.templateMap['secondary_zip'];
    } else if (!this.keyPrefix) {
      this.streetOneFieldName = this.templateMap['street_1'];
      this.streetTwoFieldName = this.templateMap['street_2'];
      this.cityFieldName = this.templateMap['city'];
      this.stateFieldName = this.templateMap['state'];
      this.zipFieldName = this.templateMap['zip'];
    } else {
      this.streetOneFieldName = `${this.keyPrefix}street_1`;
      this.streetTwoFieldName = `${this.keyPrefix}street_2`;
      this.cityFieldName = `${this.keyPrefix}city`;
      this.stateFieldName = `${this.keyPrefix}state`;
      this.zipFieldName = `${this.keyPrefix}zip`;
    }
  }
}
