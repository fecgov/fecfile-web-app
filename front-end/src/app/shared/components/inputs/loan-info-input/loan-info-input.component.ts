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

  @Input() memoCodeReadOnly: boolean | undefined;
  @Input() memoItemHelpText: string | undefined;
  @Input() transaction: Transaction | undefined;

  ngOnInit(): void {
    // Set value to zero until ticket #1103 implemented
    this.form.get('loan_payment_to_date')?.setValue(0);

    // Set balance to amount until ticket #1103 implemented
    this.form
      .get(this.templateMap.amount)
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.form.get(this.templateMap.balance)?.setValue(value);
      });
  }
}
