import { Component, effect } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { InputNumber } from 'primeng/inputnumber';
import { effectOnceIf } from 'ngxtension/effect-once-if';

@Component({
  selector: 'app-debt-input',
  templateUrl: './debt-input.component.html',
  imports: [ReactiveFormsModule, InputNumber, ErrorMessagesComponent],
})
export class DebtInputComponent extends BaseInputComponent {
  constructor() {
    super();
    // For new create transactions, the debt calculated amounts are initialized to 0
    // They a calculated fields and not saved to the database
    effectOnceIf(
      () => this.transaction()?.id,
      () => {
        this.form().get(this.templateMap().balance)?.setValue(0);
        this.form().get('payment_amount')?.setValue(0);
        this.form().get('balance_at_close')?.setValue(0);
      },
    );

    effect(() => {
      // balance_at_close is a calculated field and not saved to the database
      let amount = this.getControl(this.templateMap().amount)?.valueChangeSignal();
      amount = isNaN(parseFloat(amount)) ? 0 : parseFloat(amount);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const beginning_balance = parseFloat((<any>this.transaction())[this.templateMap().balance] ?? '0');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payment_amount = parseFloat((<any>this.transaction())['payment_amount'] ?? '0');
      const balance_at_close = beginning_balance + amount - payment_amount;

      this.form().get('balance_at_close')?.setValue(balance_at_close);
    });
  }
}
