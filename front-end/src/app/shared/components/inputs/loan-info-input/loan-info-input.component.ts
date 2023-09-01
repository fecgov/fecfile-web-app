import { Component, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { BaseInputComponent } from '../base-input.component';
import { Transaction } from 'app/shared/models/transaction.model';

@Component({
  selector: 'app-loan-info-input',
  templateUrl: './loan-info-input.component.html',
})
export class LoanInfoInputComponent extends BaseInputComponent implements OnInit {
  @Input() readonly = false;

  @Input() memoItemHelpText: string | undefined;
  @Input() transaction: Transaction | undefined;

  ngOnInit(): void {
    // For new create transactions, the PAYMENT TO DATE is set to 0 and BALANCE
    // OUTSTANDING is updated to match the ORIGINAL AMOUNT.
    // These are a calculated fields so these initial values are not saved to the database.
    if (!this.transaction?.id) {
      this.form.get(this.templateMap.payment_to_date)?.setValue(0);

      this.form
        .get(this.templateMap.amount)
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((value) => {
          this.form.get(this.templateMap.balance)?.setValue(value);
        });
    }
  }
}
