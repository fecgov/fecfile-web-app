import { Component, OnInit } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';

@Component({
  selector: 'app-support-oppose-input',
  templateUrl: './support-oppose-input.component.html',
})
export class SupportOpposeInputComponent extends BaseInputComponent implements OnInit {
  control?: SubscriptionFormControl;

  ngOnInit(): void {
    this.control = this.form.get('support_oppose_code') as SubscriptionFormControl;
  }
}
