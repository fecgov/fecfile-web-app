import { Component, Input } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'app-candidate-input',
  templateUrl: './candidate-input.component.html',
})
export class CandidateInputComponent extends BaseInputComponent {
  @Input() hasCandidateOfficeInput = true;
}
