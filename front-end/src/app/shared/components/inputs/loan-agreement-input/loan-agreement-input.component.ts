import { Component, OnInit } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-loan-agreement-input',
  templateUrl: './loan-agreement-input.component.html',
  styleUrls: ['./loan-agreement-input.component.scss'],
})
export class LoanAgreementInputComponent extends BaseInputComponent implements OnInit {
  showLoanRestructured = false;

  ngOnInit(): void {
    this.form
      .get('loan_restructured')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.showLoanRestructured = value;
        if (!value) {
          this.form.get('loan_originally_incurred_date')?.setValue(null);
        }
      });
  }
}
