import { Component, Input } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { CandidateOfficeInputComponent } from '../candidate-office-input/candidate-office-input.component';
import { ToUpperDirective } from 'app/shared/directives/to-upper.directive';
import { candidatePatternMessage } from 'app/shared/models';

@Component({
  selector: 'app-candidate-input',
  templateUrl: './candidate-input.component.html',
  imports: [ReactiveFormsModule, InputText, ErrorMessagesComponent, CandidateOfficeInputComponent, ToUpperDirective],
})
export class CandidateInputComponent extends BaseInputComponent {
  @Input() hasCandidateOfficeInput = true;
  readonly patternMessage = candidatePatternMessage;
}
