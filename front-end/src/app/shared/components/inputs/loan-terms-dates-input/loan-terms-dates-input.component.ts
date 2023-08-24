import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
export class LoanTermsDatesInputComponent extends BaseInputComponent implements OnInit, AfterViewInit {
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

    this.convertDueDate(this.form.get(this.templateMap['due_date_setting'])?.value);
    this.form.get(this.templateMap['due_date_setting'])?.valueChanges?.subscribe((dueDateSetting) => {
      this.convertDueDate(dueDateSetting);
    });

    this.onInterestRateInput(this.form.get(this.templateMap.interest_rate)?.value);
    this.form.get(this.templateMap['interest_rate_setting'])?.valueChanges?.subscribe(() => {
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

  ngAfterViewInit(): void {
    // If the interest rate converts nicely to a percentage field, then do so
    const interest_rate_field = this.form.get(this.templateMap['interest_rate']);
    const interest_rate_setting_field = this.form.get(this.templateMap['interest_rate_setting']);
    if (!interest_rate_setting_field?.value && interest_rate_field?.value) {
      const starting_interest_rate = interest_rate_field?.value;
      interest_rate_setting_field?.setValue('percentage');
      // Otherwise, set the field setting to user-defined and restore the original value
      if (starting_interest_rate !== interest_rate_field?.value) {
        interest_rate_setting_field?.setValue('user-defined');
        interest_rate_field.setValue(starting_interest_rate);
      }
    }

    // If the due date converts nicely to a Date object, then do so
    const due_date_field = this.form.get(this.templateMap['due_date']);
    const due_date_setting_field = this.form.get(this.templateMap['due_date_setting']);
    if (!due_date_setting_field?.value && due_date_field?.value) {
      const starting_due_date = due_date_field?.value;
      due_date_setting_field?.setValue('specific');
      // Otherwise, set the field setting to user-defined and restore the original value
      if (!(due_date_field?.value instanceof Date)) {
        due_date_setting_field?.setValue('user-defined');
        due_date_field?.setValue(starting_due_date);
      }
    }
  }

  onInterestRateInput(value: string) {
    const interestField = this.form.get(this.templateMap.interest_rate);
    if (this.form.get(this.templateMap['interest_rate_setting'])?.value === 'percentage') {
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
      if (interestField?.value?.length === 1) {
        interestField?.setValue('');
      }
    }

    interestField?.markAsTouched();
  }

  convertDueDate(dueDateSetting: string) {
    const due_date = this.form.get(this.templateMap['due_date']);
    if (due_date) {
      if (dueDateSetting === 'specific') {
        // If there is a due date and it is not a Date object
        if (!(due_date.value instanceof Date) && due_date.value?.length > 0) {
          // Convert the value to a date object
          const date = new Date(due_date.value);
          // If the date is formatted yyyy-mm-dd, counteract timezone adjustment
          if ((due_date.value as string).search(/\d{4}-\d{2}-\d{2}$/) !== -1) {
            date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
          }
          // If the date converts nicely to a number, it's valid
          if (!isNaN(date as unknown as number)) {
            due_date.setValue(date);
          } else {
            // Otherwise, empty the field
            due_date.setValue(undefined);
          }
        }
      }

      due_date.markAsTouched();
    }
  }
}
