import { Component, OnInit } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'app-loan-terms-input',
  templateUrl: './loan-terms-input.component.html',
  styleUrls: ['./loan-terms-input.component.scss'],
})
export class LoanTermsInputComponent extends BaseInputComponent implements OnInit {
  ngOnInit(): void {
    // Set empty values until ticket #1156 implemented
    this.form.get('loan_due_date')?.setValue(' ');
    this.form.get('loan_interest_rate')?.setValue(' ');
  }
}
