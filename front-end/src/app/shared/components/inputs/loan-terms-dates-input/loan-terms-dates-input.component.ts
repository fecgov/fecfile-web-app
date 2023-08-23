import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { take, takeUntil } from 'rxjs';
import { BaseInputComponent } from '../base-input.component';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DateUtils } from 'app/shared/utils/date.utils';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { InputText } from 'primeng/inputtext';

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
  @ViewChild('interestRatePercentage') interestInput!: InputText;
  constructor(private store: Store) {
    super();
  }

  dueDateSettingOptions = LabelUtils.getPrimeOptions([
    ['specific', 'Enter a specific date'],
    ['user-defined', 'Enter a user defined value'],
  ]);

  interestRateSettingOptions = LabelUtils.getPrimeOptions([
    ['percentage', 'Enter an exact percentage'],
    ['user-defined', 'Enter a user defined value'],
  ]);

  ngOnInit(): void {
    // Add the date range validation check to the DATE INCURRED input
    this.store
      .select(selectActiveReport)
      .pipe(take(1))
      .subscribe((report) => {
        this.form
          .get(this.templateMap.date)
          ?.addValidators(dateWithinReportRange(report.coverage_from_date, report.coverage_through_date));
      });

    this.convertDueDate(this.form.get('due_date_setting')?.value);
    this.form.get('due_date_setting')?.valueChanges?.subscribe((dueDateSetting) => {
      this.convertDueDate(dueDateSetting);
    });

    this.onInterestRateInput(this.form.get(this.templateMap.interest_rate)?.value);
    this.form.get('interest_rate_setting')?.valueChanges?.subscribe(() => {
      this.onInterestRateInput(this.form.get(this.templateMap.interest_rate)?.value);
    });

    // Watch changes to purpose description to make sure prefix is maintained
    this.form
      .get(this.templateMap['interest_rate'])
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => {
        this.onInterestRateInput(value);
      });
  }

  onInterestRateInput(value: string) {
    if (this.form.get('interest_rate_setting')?.value === 'percentage') {
      const interestField = this.form.get(this.templateMap.interest_rate);

      let textInput!: HTMLInputElement;
      let initialSelectionStart = 0;
      let initialSelectionEnd = 0;
      if (this.interestInput) {
        textInput = (this.interestInput as any).nativeElement as HTMLInputElement;
        initialSelectionStart = textInput.selectionStart || 0;
        initialSelectionEnd = textInput.selectionEnd || 0;
      }

      const validNumber = value.replaceAll(/[^0-9.%]/g, '');
      if (validNumber !== value) {
        interestField?.setValue(validNumber);
        const lengthDifference = value.length - validNumber.length;
        value = validNumber;

        textInput?.setSelectionRange(initialSelectionStart - lengthDifference, initialSelectionEnd - lengthDifference);
      }

      if (value.length > 0) {
        if (!value.endsWith('%')) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          interestField?.setValue(value + '%');

          textInput?.setSelectionRange(value.length, value.length);
        }
      }
      if (interestField?.value.length == 1) {
        interestField?.setValue('');
      }
    }
  }

  convertDueDate(dueDateSetting: string) {
    const due_date = this.form.get(this.templateMap['due_date']);
    if (due_date) {
      if (dueDateSetting === 'specific') {
        // If the due date is not a valid Date object
        if (!(due_date.value instanceof Date)) {
          const date = new Date(due_date.value);
          // Convert the value to a Date object if possible
          if (!isNaN(date as unknown as number)) {
            due_date.setValue(date);
          } else {
            // Otherwise, empty the field
            due_date.setValue(undefined);
          }
        }
      }

      due_date.markAsTouched();
      due_date.updateValueAndValidity();
    }
  }
}
