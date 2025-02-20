import { Component } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';

@Component({
  selector: 'app-employer-input',
  templateUrl: './employer-input.component.html',
  imports: [ReactiveFormsModule, InputText, ErrorMessagesComponent],
})
export class EmployerInputComponent extends BaseInputComponent {}
