import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { take } from 'rxjs';
import { BaseInputComponent } from '../base-input.component';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
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
  selector: 'app-loan-terms-dates-input',
  templateUrl: './loan-terms-dates-input.component.html',
})
export class LoanTermsDatesInputComponent extends BaseInputComponent implements OnInit {
  constructor(private store: Store) {
    super();
  }

  ngOnInit(): void {
    // Set empty values until ticket #1156 implemented
    this.form.get(this.templateMap['due_date'])?.setValue('-');
    this.form.get(this.templateMap['interest_rate'])?.setValue('-');

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