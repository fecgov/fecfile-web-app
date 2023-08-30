import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { take, takeUntil } from 'rxjs';
import { BaseInputComponent } from '../base-input.component';
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DateUtils } from 'app/shared/utils/date.utils';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { InputText } from 'primeng/inputtext';

enum LoanTermsFieldSettings {
  SPECIFIC_DATE = 'specific-date',
  USER_DEFINED = 'user-defined',
  EXACT_PERCENTAGE = 'exact-percentage',
}

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

  termFieldSettings = LoanTermsFieldSettings;

  dueDateSettingOptions = LabelUtils.getPrimeOptions([
    [LoanTermsFieldSettings.SPECIFIC_DATE, 'Enter a specific date'],
    [LoanTermsFieldSettings.USER_DEFINED, 'Enter a user defined value'],
  ]);

  interestRateSettingOptions = LabelUtils.getPrimeOptions([
    [LoanTermsFieldSettings.EXACT_PERCENTAGE, 'Enter an exact percentage'],
    [LoanTermsFieldSettings.USER_DEFINED, 'Enter a user defined value'],
  ]);

  percentageValidator?: ValidatorFn;

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

    this.percentageValidator = Validators.pattern('^\\d+(\\.\\d{1,5})?%$');

    this.form.get(this.templateMap.interest_rate_setting)?.addValidators(Validators.required);
    this.form.get(this.templateMap.due_date_setting)?.addValidators(Validators.required);

    this.convertDueDate(this.form.get(this.templateMap['due_date_setting'])?.value);
    this.form.get(this.templateMap['due_date_setting'])?.valueChanges?.subscribe((dueDateSetting) => {
      this.convertDueDate(dueDateSetting);
    });

    this.onInterestRateInput(this.form.get(this.templateMap.interest_rate)?.value);
    this.form.get(this.templateMap['interest_rate_setting'])?.valueChanges?.subscribe((interestRateSetting) => {
      const interestRateField = this.form.get(this.templateMap['interest_rate']);
      if (interestRateField) {
        if (interestRateSetting === LoanTermsFieldSettings.EXACT_PERCENTAGE) {
          interestRateField.addValidators(this.percentageValidator as ValidatorFn);
        } else if (interestRateSetting === LoanTermsFieldSettings.USER_DEFINED) {
          interestRateField.removeValidators(this.percentageValidator as ValidatorFn);
        }
      }
      this.onInterestRateInput(interestRateSetting);
    });

    // Watch changes to purpose description to make sure prefix is maintained
    this.form
      .get(this.templateMap['interest_rate'])
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.onInterestRateInput(this.form.get(this.templateMap.interest_rate_setting)?.value);
      });
  }

  ngAfterViewInit(): void {
    const interest_rate_field = this.form.get(this.templateMap['interest_rate']);
    const interest_rate_setting_field = this.form.get(this.templateMap['interest_rate_setting']);
    // If the interest rate converts nicely to a percentage field, then do so
    if (!interest_rate_setting_field?.value && interest_rate_field?.value) {
      const starting_interest_rate = interest_rate_field?.value;
      interest_rate_setting_field?.setValue(LoanTermsFieldSettings.EXACT_PERCENTAGE);
      // Otherwise, set the field setting to user-defined and restore the original value
      if (starting_interest_rate !== interest_rate_field?.value) {
        interest_rate_setting_field?.setValue(LoanTermsFieldSettings.USER_DEFINED);
        interest_rate_field.setValue(starting_interest_rate);
      }
    }

    const due_date_field = this.form.get(this.templateMap['due_date']);
    const due_date_setting_field = this.form.get(this.templateMap['due_date_setting']);
    // If the due date converts nicely to a Date object, then do so
    if (!due_date_setting_field?.value && due_date_field?.value) {
      const starting_due_date = due_date_field?.value;
      due_date_setting_field?.setValue(LoanTermsFieldSettings.SPECIFIC_DATE);
      // Otherwise, set the field setting to user-defined and restore the original value
      if (!(due_date_field?.value instanceof Date)) {
        due_date_setting_field?.setValue(LoanTermsFieldSettings.USER_DEFINED);
        due_date_field?.setValue(starting_due_date);
      }
    }
  }

  onInterestRateInput(newInterestRateSetting: string) {
    const interestField = this.form.get(this.templateMap.interest_rate);
    if (interestField) {
      const previousInterestRate = interestField.value;
      let newInterestRate = previousInterestRate ?? '';
      if (newInterestRateSetting === LoanTermsFieldSettings.EXACT_PERCENTAGE) {
        let textInput!: HTMLInputElement;
        let initialSelectionStart = 0;
        let initialSelectionEnd = 0;
        if (this.interestInput) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          textInput = (this.interestInput as any).nativeElement as HTMLInputElement;
          initialSelectionStart = textInput.selectionStart ?? 0;
          initialSelectionEnd = textInput.selectionEnd ?? 0;
        }

        const validNumber = newInterestRate.replaceAll(/[^0-9.%]/g, '');
        if (validNumber !== newInterestRate) {
          interestField.setValue(validNumber);
          const lengthDifference = newInterestRate.length - validNumber.length;
          newInterestRate = validNumber;

          textInput?.setSelectionRange(
            initialSelectionStart - lengthDifference,
            initialSelectionEnd - lengthDifference
          );
        }

        if (newInterestRate.length > 0) {
          if (!newInterestRate.endsWith('%')) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            interestField.setValue(newInterestRate + '%');

            textInput?.setSelectionRange(newInterestRate.length, newInterestRate.length);
          }
        }
        if (interestField.value === '%') {
          interestField.setValue('');
        }
      }

      interestField.markAsTouched();
    }
  }

  convertDueDate(newDueDateSetting: string) {
    const due_date_field = this.form.get(this.templateMap['due_date']);
    const fecDateFormat = /^\d{4}-\d{2}-\d{2}$/;
    if (due_date_field) {
      const previous_due_date = due_date_field.value ?? '';
      if (newDueDateSetting === LoanTermsFieldSettings.SPECIFIC_DATE) {
        if (previous_due_date.search(fecDateFormat) !== -1) {
          due_date_field.setValue(DateUtils.convertFecFormatToDate(previous_due_date));
        } else {
          due_date_field.setValue(undefined);
        }
      } else if (newDueDateSetting === LoanTermsFieldSettings.USER_DEFINED) {
        if (previous_due_date instanceof Date) {
          due_date_field.setValue(DateUtils.convertDateToFecFormat(previous_due_date));
        } else {
          due_date_field.setValue(undefined);
        }
      }
      due_date_field.markAsTouched();
    }
  }
}
