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
    // For new create transactions, the debt calculated amounts are initialized to 0
    // They a calculated fields and not saved to the database
    if (!this.transaction()?.id) {
      this.form.get('beginning_balance')?.setValue(0);
      this.form.get('payment_amount')?.setValue(0);
      this.form.get('balance_at_close')?.setValue(0);
    }

    // balance_at_close is a calculated field and not saved to the database
    this.form
      .get('incurred_amount')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((amount) => {
        const amountNumber = isNaN(parseFloat(amount)) ? 0 : parseFloat(amount);
        const tx = this.transaction() as SchDTransaction | undefined;
        const beginning_balance = tx?.beginning_balance ?? 0;
        const payment_amount = tx?.payment_amount ?? 0;
        const balance_at_close = beginning_balance + amountNumber - payment_amount;

        this.form.get('balance_at_close')?.setValue(balance_at_close);
      });
  }
}
