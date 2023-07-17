import { Component, OnInit } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'app-loan-terms-input',
  templateUrl: './loan-terms-input.component.html',
})
export class LoanTermsInputComponent extends BaseInputComponent implements OnInit {
  ngOnInit(): void {
    if (this.form.get('secured')?.value === null) {
      this.form.get('secured')?.setValue(false);
    }

    // Set empty values until ticket #1156 implemented
    this.form.get('loan_due_date')?.setValue('-');
    this.form.get('loan_interest_rate')?.setValue('-');
  }
}
