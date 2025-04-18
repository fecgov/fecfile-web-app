import { Component, computed, effect, input } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { MemoCodeInputComponent } from '../memo-code/memo-code.component';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-loan-info-input',
  templateUrl: './loan-info-input.component.html',
  imports: [ReactiveFormsModule, InputNumberModule, ErrorMessagesComponent, MemoCodeInputComponent],
})
export class LoanInfoInputComponent extends BaseInputComponent {
  readonly readonly = input(false);
  readonly memoItemHelpText = input<string>();

  readonly paymentControl = computed(() => {
    const control = this.form().get(this.templateMap().payment_to_date);
    if (control) {
      if (!this.transaction()?.id || !control.value) {
        control.setValue(0);
      }
    }
    return control;
  });

  readonly amountControl = computed(() => this.getControl(this.templateMap().amount));
  readonly balanceControl = computed(() => this.getControl(this.templateMap().balance));
  readonly paymentToDateControl = computed(() => this.getControl(this.templateMap().payment_to_date));

  constructor() {
    super();
    effect(() => {
      // balance is a calculated field and not saved to the database
      const amount = this.amountControl()?.valueChangeSignal();
      if (!amount) return;
      let balance = amount;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payment_to_date = (<any>this.transaction())[this.templateMap().payment_to_date];
      if (payment_to_date) {
        balance = amount - payment_to_date;
      }
      this.getControl(this.templateMap().balance)?.setValue(balance);
    });
  }
}
