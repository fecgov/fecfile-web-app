import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { isPulledForwardLoan } from 'app/shared/models/transaction.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { InputText } from 'primeng/inputtext';
import { take, takeUntil } from 'rxjs';
import { BaseInputComponent } from '../base-input.component';
import { Form3X } from 'app/shared/models/form-3x.model';
import { buildWithinReportDatesValidator, percentageValidator } from 'app/shared/utils/validators.utils';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';

enum LoanTermsFieldSettings {
  SPECIFIC_DATE = 'specific-date',
  USER_DEFINED = 'user-defined',
  EXACT_PERCENTAGE = 'exact-percentage',
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

  ngOnInit(): void {
    // Add the date range validation check to the DATE INCURRED input
    if (!isPulledForwardLoan(this.transaction) && !isPulledForwardLoan(this.transaction?.parent_transaction)) {
      this.store
        .select(selectActiveReport)
        .pipe(take(1))
        .subscribe((report) => {
          this.form
            .get(this.templateMap.date)
            ?.addValidators(
              buildWithinReportDatesValidator(
                (report as Form3X).coverage_from_date,
                (report as Form3X).coverage_through_date,
              ),
            );
        });
    }

    this.form.get(this.templateMap.interest_rate_setting)?.addValidators([Validators.required]);
    this.form.get(this.templateMap.due_date_setting)?.addValidators([Validators.required]);

    this.form.get(this.templateMap['due_date_setting'])?.valueChanges?.subscribe((dueDateSetting) => {
      this.convertDueDate(dueDateSetting);
    });

    this.onInterestRateInput(this.form.get(this.templateMap.interest_rate)?.value);
    this.form.get(this.templateMap['interest_rate_setting'])?.valueChanges?.subscribe((interestRateSetting) => {
      const interestRateField = this.form.get(this.templateMap['interest_rate']);
      if (interestRateField) {
        if (interestRateSetting === LoanTermsFieldSettings.EXACT_PERCENTAGE) {
          interestRateField.addValidators(percentageValidator);
        } else if (interestRateSetting === LoanTermsFieldSettings.USER_DEFINED) {
          interestRateField.removeValidators(percentageValidator);
        }

        interestRateField.setValue(null);
        interestRateField.markAsPristine();
        interestRateField.markAsUntouched();
      }
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
            initialSelectionEnd - lengthDifference,
          );
          interestField.markAsTouched();
        }

        if (newInterestRate.length > 0) {
          if (!newInterestRate.endsWith('%')) {
            interestField.setValue(newInterestRate + '%');
            textInput?.setSelectionRange(newInterestRate.length, newInterestRate.length);
            interestField.markAsTouched();
          }
        }
        if (interestField.value === '%') {
          interestField.setValue('');
        }
      }
    }
  }

  /**
   * Alternates between a date form control and a string form control.
   * The new CalendarComponent replaces the string form control with a Date control.
   * This happens on Init, which means when the ngIf condition is met.
   * This means when returning to the string control we need to recreate the control.
   * @param newDueDateSetting
   */
  convertDueDate(newDueDateSetting: string) {
    const due_date_field = this.form.get(this.templateMap['due_date']);
    if (due_date_field) {
      if (newDueDateSetting === LoanTermsFieldSettings.SPECIFIC_DATE) {
        due_date_field.setValue(null);
        due_date_field.markAsPristine();
        due_date_field.markAsUntouched();
      } else if (newDueDateSetting === LoanTermsFieldSettings.USER_DEFINED) {
        const stringDueDate = new SubscriptionFormControl<string>('', {
          validators: due_date_field.validator,
          asyncValidators: due_date_field.asyncValidator,
          updateOn: 'blur',
        });
        stringDueDate.markAsPristine();
        this.form.setControl(this.templateMap['due_date'], stringDueDate);
      }
    }
  }
}
