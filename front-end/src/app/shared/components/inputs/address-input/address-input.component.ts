import { Component, Input } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';
import { PrimeOptions } from 'app/shared/utils/label.utils';
import { LabelUtils } from 'app/shared/utils/label.utils';

@Component({
  selector: 'app-address-input',
  templateUrl: './address-input.component.html',
})
export class AddressInputComponent extends BaseInputComponent {
  @Input() stateOptions: PrimeOptions = LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary());
}
