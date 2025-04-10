import { Component, input } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { CandidateOfficeInputComponent } from '../candidate-office-input/candidate-office-input.component';

@Component({
  selector: 'app-candidate-input',
  templateUrl: './candidate-input.component.html',
  imports: [ReactiveFormsModule, InputText, ErrorMessagesComponent, CandidateOfficeInputComponent],
})
export class CandidateInputComponent extends BaseInputComponent {
  hasCandidateOfficeInput = input(true);
}
