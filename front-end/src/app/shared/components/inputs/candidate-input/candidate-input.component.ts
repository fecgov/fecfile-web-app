import { Component } from '@angular/core';
import { PrimeOptions } from 'app/shared/utils/label.utils';
import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'app-candidate-input',
  templateUrl: './candidate-input.component.html',
})
export class CandidateInputComponent extends BaseInputComponent {
  candidateOfficeTypeOptions: PrimeOptions = [];
  candidateStateOptions: PrimeOptions = [];
  candidateDistrictOptions: PrimeOptions = [];
}
