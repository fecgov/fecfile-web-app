import { Component, OnInit } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { ReactiveFormsModule } from '@angular/forms';
import { RadioButton } from 'primeng/radiobutton';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';

@Component({
  selector: 'app-support-oppose-input',
  templateUrl: './support-oppose-input.component.html',
  imports: [ReactiveFormsModule, RadioButton, ErrorMessagesComponent],
})
export class SupportOpposeInputComponent extends BaseInputComponent implements OnInit {
  control?: SubscriptionFormControl;

  ngOnInit(): void {
    this.control = this.form.get('support_oppose_code') as SubscriptionFormControl;
  }
}
