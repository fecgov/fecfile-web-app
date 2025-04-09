import { Component, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
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
export class LoanInfoInputComponent extends BaseInputComponent implements OnInit {
  @Input() readonly = false;

  @Input() memoItemHelpText: string | undefined;

  ngOnInit(): void {
    // For new create transactions, the PAYMENT TO DATE is initialized to 0
    // It is a calculated field and not saved to the database
    const paymentControl = this.form.get(this.templateMap.payment_to_date);
    if (paymentControl) {
      if (!this.transaction?.id || !paymentControl.value) {
        paymentControl.setValue(0);
      }
    }

    // balance is a calculated field and not saved to the database
    this.form
      .get(this.templateMap.amount)
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((amount) => {
        let balance = amount;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const payment_to_date = (<any>this.transaction)[this.templateMap.payment_to_date];
        if (payment_to_date) {
          balance = amount - payment_to_date;
        }
        this.form.get(this.templateMap.balance)?.setValue(balance);
      });
  }
}
