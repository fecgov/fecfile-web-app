import { Component, OnInit, Input } from '@angular/core';
import { takeUntil } from 'rxjs';
import { BaseInputComponent } from '../base-input.component';
import { Transaction } from 'app/shared/models/transaction.model';

@Component({
  selector: 'app-debt-input',
  templateUrl: './debt-input.component.html',
})
export class DebtInputComponent extends BaseInputComponent implements OnInit {
  @Input() transaction: Transaction | undefined;

  ngOnInit(): void {
    // For new create transactions, the debt calculated amounts are initialized to 0
    // They a calculated fields and not saved to the database
    if (!this.transaction?.id) {
      this.form.get(this.templateMap.balance)?.setValue(0);
      this.form.get('payment_amount')?.setValue(0);
      this.form.get('balance_at_close')?.setValue(0);
    }

    // balance_at_close is a calculated field and not saved to the database
    this.form
      .get(this.templateMap.amount)
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((amount) => {
        amount = isNaN(parseFloat(amount)) ? 0 : parseFloat(amount);
        let balance_at_close = amount;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const beginning_balance = parseFloat((<any>this.transaction)[this.templateMap.balance]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const payment_amount = parseFloat((<any>this.transaction)['payment_amount']);
        if (payment_amount) {
          balance_at_close = beginning_balance + (amount - payment_amount);
        }
        this.form.get('balance_at_close')?.setValue(balance_at_close);
      });
  }
}
