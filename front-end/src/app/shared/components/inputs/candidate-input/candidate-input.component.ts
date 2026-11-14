import { Component, input } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { ToUpperDirective } from 'app/shared/directives/to-upper.directive';
import { candidatePatternMessage } from 'app/shared/models';
import { FieldTree } from '@angular/forms/signals';
import {
  CandidateOfficeModel,
  CandidateOfficeFormComponent,
} from '../../signal-form/candidate-office-form/candidate-office-form.component';

@Component({
  selector: 'app-candidate-input',
  templateUrl: './candidate-input.component.html',
  imports: [ReactiveFormsModule, InputText, ErrorMessagesComponent, ToUpperDirective, CandidateOfficeFormComponent],
})
export class CandidateInputComponent extends BaseInputComponent {
  readonly hasCandidateOfficeInput = input(true);
  readonly candidateOfficeFields = input.required<FieldTree<CandidateOfficeModel, string | number>>();
  readonly patternMessage = candidatePatternMessage;
}
