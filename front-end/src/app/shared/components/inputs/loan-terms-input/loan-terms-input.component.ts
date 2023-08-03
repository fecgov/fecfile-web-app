import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { take, takeUntil } from 'rxjs';
import { BaseInputComponent } from '../base-input.component';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DateUtils } from 'app/shared/utils/date.utils';

function dateWithinReportRange(coverage_from_date?: Date, coverage_through_date?: Date): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const date = control.value;

    if (!DateUtils.isWithin(date, coverage_from_date, coverage_through_date)) {
      const message = `This date must fall within the coverage dates of ${DateUtils.convertDateToSlashFormat(
        coverage_from_date
      )} - ${DateUtils.convertDateToSlashFormat(coverage_through_date)} for this report.`;
      return { invaliddate: { msg: message } };
    }

    return null;
  };
}

@Component({
  selector: 'app-loan-terms-input',
  templateUrl: './loan-terms-input.component.html',
})
export class LoanTermsInputComponent extends BaseInputComponent implements OnInit {
  securedControl: AbstractControl | null = null;

  constructor(private store: Store) {
    super();
  }

  ngOnInit(): void {
    // Set empty values until ticket #1156 implemented
    this.form.get('loan_due_date')?.setValue('-');
    this.form.get('loan_interest_rate')?.setValue('-');

    this.securedControl = this.form.get(this.templateMap['secured']);

    // Add the date range validation check to the DATE INCURRED input
    this.store
      .select(selectActiveReport)
      .pipe(take(1))
      .subscribe((report) => {
        this.form
          .get(this.templateMap.date)
          ?.addValidators(dateWithinReportRange(report.coverage_from_date, report.coverage_through_date));
      });
  }
}
