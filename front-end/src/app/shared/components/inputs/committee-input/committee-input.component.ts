import { Component, computed, effect, input } from '@angular/core';
import { BaseTransactionInputComponent } from '../base-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { SignalFormControl } from 'app/shared/utils/signal-form-control';

@Component({
  selector: 'app-committee-input',
  templateUrl: './committee-input.component.html',
  styleUrls: ['./committee-input.component.scss'],
  imports: [ReactiveFormsModule, InputText, ErrorMessagesComponent],
})
export class CommitteeInputComponent extends BaseTransactionInputComponent {
  readonly entityRole = input('CONTACT');
  readonly includeFecId = input(false);
  readonly readonly = input(false);
  readonly tertiaryContact = input(false);

  readonly orgNameControl = computed(() => this.form().get(this.templateMap().organization_name) as SignalFormControl);
  readonly committeeNameControl = computed(
    () => this.form().get(this.templateMap().committee_name) as SignalFormControl,
  );

  constructor() {
    super();
    effect(() => {
      if (this.orgNameControl() && this.committeeNameControl() && this.transactionType()?.synchronizeOrgComNameValues) {
        const value = this.orgNameControl().valueChangeSignal();
        this.committeeNameControl().setValue(value);
      }
    });
  }
}
