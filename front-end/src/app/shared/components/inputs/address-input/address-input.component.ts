import { Component, Input, OnInit } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';
import { PrimeOptions, LabelUtils } from 'app/shared/utils/label.utils';
import { ReactiveFormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-address-input',
  templateUrl: './address-input.component.html',
  imports: [ReactiveFormsModule, InputText, ErrorMessagesComponent, Select],
})
export class AddressInputComponent extends BaseInputComponent implements OnInit {
  @Input() readonly = false;
  @Input() stateOptions: PrimeOptions = LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary());
  @Input() templateMapKeyPrefix = '';

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
    } else {
      this.streetOneFieldName = this.templateMap['street_1'];
      this.streetTwoFieldName = this.templateMap['street_2'];
      this.cityFieldName = this.templateMap['city'];
      this.stateFieldName = this.templateMap['state'];
      this.zipFieldName = this.templateMap['zip'];
    }
  }
}
