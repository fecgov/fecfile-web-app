import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { BaseInputComponent } from '../base-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputNumberComponent } from '../input-number/input-number.component';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { SchDTransaction } from 'app/shared/models';

@Component({
  selector: 'app-debt-input',
  templateUrl: './debt-input.component.html',
  imports: [ReactiveFormsModule, InputNumberComponent, ErrorMessagesComponent],
})
export class DebtInputComponent extends BaseInputComponent implements OnInit {
  ngOnInit(): void {
    const beginningBalanceControl = this.form.get('beginning_balance');
    const paymentAmountControl = this.form.get('payment_amount');
    const balanceAtCloseControl = this.form.get('balance_at_close');

    // For existing debts, nullish computed fields are normalized to 0 for deterministic display.
    if (this.transaction()?.id) {
      // Existing debts may come back with nullish computed fields; display deterministic 0 values.
      if (beginningBalanceControl && (beginningBalanceControl.value == null || beginningBalanceControl.value === '')) {
        beginningBalanceControl.setValue(0, { emitEvent: false });
      }
      if (paymentAmountControl && (paymentAmountControl.value == null || paymentAmountControl.value === '')) {
        paymentAmountControl.setValue(0, { emitEvent: false });
      }
    } else {
      // For new create transactions, the debt calculated amounts are initialized to 0.
      // They are calculated fields and not saved to the database.
      beginningBalanceControl?.setValue(0, { emitEvent: false });
      paymentAmountControl?.setValue(0, { emitEvent: false });
      balanceAtCloseControl?.setValue(0, { emitEvent: false });
    }

    // balance_at_close is a calculated field and not saved to the database
    this.form
      .get('incurred_amount')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((amount) => {
        const parsedAmount = Number.parseFloat(String(amount));
        const amountNumber = Number.isNaN(parsedAmount) ? 0 : parsedAmount;
        const tx = this.transaction() as SchDTransaction | undefined;
        const beginning_balance = tx?.beginning_balance ?? 0;
        const payment_amount = tx?.payment_amount ?? 0;
        const balance_at_close = beginning_balance + amountNumber - payment_amount;

        this.form.get('balance_at_close')?.setValue(balance_at_close);
      });
  }
}
