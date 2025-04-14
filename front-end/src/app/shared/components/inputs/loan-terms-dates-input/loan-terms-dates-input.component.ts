import { AfterViewInit, Component, computed, inject, viewChild } from '@angular/core';
import { Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { isPulledForwardLoan } from 'app/shared/models/transaction.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { InputText } from 'primeng/inputtext';
import { BaseInputComponent } from '../base-input.component';
import { Form3X } from 'app/shared/models/form-3x.model';
import { buildWithinReportDatesValidator, percentageValidator } from 'app/shared/utils/validators.utils';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { DateUtils } from 'app/shared/utils/date.utils';
import { CalendarComponent } from '../../calendar/calendar.component';
import { Select } from 'primeng/select';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { effectOnceIf } from 'ngxtension/effect-once-if';

enum LoanTermsFieldSettings {
  SPECIFIC_DATE = 'specific-date',
  USER_DEFINED = 'user-defined',
  EXACT_PERCENTAGE = 'exact-percentage',
}

@Component({
  selector: 'app-loan-terms-dates-input',
  templateUrl: './loan-terms-dates-input.component.html',
  imports: [ReactiveFormsModule, CalendarComponent, Select, ErrorMessagesComponent, InputText],
})
export class LoanTermsDatesInputComponent extends BaseInputComponent implements AfterViewInit {
  private readonly store = inject(Store);
  interestInput = viewChild<InputText>('interestRatePercentage');
  clearValuesOnChange = true;

  readonly termFieldSettings = LoanTermsFieldSettings;

  dueDateSettingOptions = LabelUtils.getPrimeOptions([
    [LoanTermsFieldSettings.SPECIFIC_DATE, 'Enter a specific date'],
    [LoanTermsFieldSettings.USER_DEFINED, 'Enter a user defined value'],
  ]);

  interestRateSettingOptions = LabelUtils.getPrimeOptions([
    [LoanTermsFieldSettings.EXACT_PERCENTAGE, 'Enter an exact percentage'],
    [LoanTermsFieldSettings.USER_DEFINED, 'Enter a user defined value'],
  ]);

  readonly report = this.store.selectSignal(selectActiveReport);

  constructor() {
    super();
    this.interestRateSettingField()?.addValidators([Validators.required]);
    this.dueDateSettingField()?.addValidators([Validators.required]);

    // Add the date range validation check to the DATE INCURRED input
    effectOnceIf(
      () =>
        !isPulledForwardLoan(this.transaction()) &&
        !isPulledForwardLoan(this.transaction()?.parent_transaction) &&
        this.report(),
      () => {
        const f3x = this.report() as Form3X;
        this.form()
          .get(this.templateMap().date)
          ?.addValidators(buildWithinReportDatesValidator(f3x.coverage_from_date, f3x.coverage_through_date));
      },
    );

    this.addValidators();
    this.addSubscriptions();
  }

  addValidators() {
    this.interestRateSettingField()?.addValidators([Validators.required]);
    this.dueDateSettingField()?.addValidators([Validators.required]);
  }

  addSubscriptions() {
    this.dueDateSettingField()?.addSubscription((dueDateSetting) => {
      this.convertDueDate(dueDateSetting);
    });

    this.onInterestRateInput(this.interestRate);
    this.interestRateSettingField()?.addSubscription((interestRateSetting) => {
      if (!this.interestRateField) return;
      if (interestRateSetting === LoanTermsFieldSettings.EXACT_PERCENTAGE) {
        this.interestRateField().addValidators(percentageValidator);
      } else if (interestRateSetting === LoanTermsFieldSettings.USER_DEFINED) {
        this.interestRateField().removeValidators(percentageValidator);
      }
      if (this.clearValuesOnChange) {
        this.interestRate = '';
        this.interestRateField().markAsPristine();
        this.interestRateField().markAsUntouched();
      } else {
        this.onInterestRateInput(interestRateSetting);
      }
    });

    // Watch changes to purpose description to make sure prefix is maintained
    this.interestRateField()?.addSubscription(() => this.onInterestRateInput(this.interestRateSetting), this.destroy$);
  }

  ngAfterViewInit(): void {
    this.clearValuesOnChange = false;
    // If the interest rate converts nicely to a percentage field, then do so
    if (!this.interestRateSetting && this.interestRate) {
      const starting_interest_rate = this.interestRate;

      this.interestRateSetting = LoanTermsFieldSettings.EXACT_PERCENTAGE;
      // Otherwise, set the field setting to user-defined and restore the original value
      if (starting_interest_rate !== this.interestRate) {
        this.interestRateSetting = LoanTermsFieldSettings.USER_DEFINED;
        this.interestRate = starting_interest_rate;
      }
    }

    // If the due date converts nicely to a Date object, then do so
    if (!this.dueDateSetting && this.dueDate) {
      const starting_due_date = this.dueDate;
      this.dueDateSetting = LoanTermsFieldSettings.SPECIFIC_DATE;
      // Otherwise, set the field setting to user-defined and restore the original value
      if (!(this.dueDate instanceof Date)) {
        this.dueDateSetting = LoanTermsFieldSettings.USER_DEFINED;
        this.dueDate = starting_due_date;
      }
    }
    this.clearValuesOnChange = true;
  }

  private onInterestRateInput(newInterestRateSetting: string) {
    const previousInterestRate = this.interestRate;
    if (newInterestRateSetting === LoanTermsFieldSettings.EXACT_PERCENTAGE) {
      let newInterestRate = previousInterestRate ?? '';
      let textInput!: HTMLInputElement;
      let initialSelectionStart = 0;
      let initialSelectionEnd = 0;
      if (this.interestInput()) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        textInput = (this.interestInput() as any).nativeElement as HTMLInputElement;
        initialSelectionStart = textInput.selectionStart ?? 0;
        initialSelectionEnd = textInput.selectionEnd ?? 0;
      }

      const validNumber = newInterestRate.replaceAll(/[^0-9.%]/g, '');
      if (validNumber !== newInterestRate) {
        this.interestRate = validNumber;
        const lengthDifference = newInterestRate.length - validNumber.length;
        newInterestRate = validNumber;

        textInput?.setSelectionRange(initialSelectionStart - lengthDifference, initialSelectionEnd - lengthDifference);
        this.interestRateField().markAsTouched();
      }

      if (newInterestRate.length > 0) {
        if (!newInterestRate.endsWith('%')) {
          this.interestRate = newInterestRate + '%';
          textInput?.setSelectionRange(newInterestRate.length, newInterestRate.length);
          this.interestRateField()?.markAsTouched();
        }
      }
      if (this.interestRate === '%') {
        this.interestRate = '';
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
    if (this.clearValuesOnChange) {
      this.clearDueDate(newDueDateSetting);
    } else {
      this.convertDueDateProper(newDueDateSetting);
    }
  }

  /**
   * If clearValuesOnChange is true, values are set to null or empty string
   * @param newDueDateSetting
   */
  private clearDueDate(newDueDateSetting: string) {
    if (newDueDateSetting === LoanTermsFieldSettings.SPECIFIC_DATE) {
      this.dueDate = null;
    } else if (newDueDateSetting === LoanTermsFieldSettings.USER_DEFINED) {
      this.dueDate = '';
    }
  }

  /**
   * If clearValuesOnChange is false, values are converted properly
   * clearValuesOnChange is false when loading from backend, otherwise always true
   * @param newDueDateSetting
   */
  private convertDueDateProper(newDueDateSetting: string) {
    const fecDateFormat = /^\d{4}-\d{2}-\d{2}$/;
    const previous_due_date = this.dueDate;
    if (newDueDateSetting === LoanTermsFieldSettings.SPECIFIC_DATE) {
      if (typeof previous_due_date === 'string' && previous_due_date.search(fecDateFormat) !== -1) {
        this.dueDate = DateUtils.convertFecFormatToDate(previous_due_date);
      } else {
        this.dueDate = null;
      }
    } else if (newDueDateSetting === LoanTermsFieldSettings.USER_DEFINED) {
      const value =
        previous_due_date instanceof Date ? DateUtils.convertDateToFecFormat(previous_due_date) : previous_due_date;
      this.dueDate = value ?? '';
    }
  }

  readonly dueDateField = computed(() => this.form().get(this.templateMap()['due_date']) as SubscriptionFormControl);

  get dueDate(): Date | string | null {
    return this.dueDateField().value ?? null;
  }

  set dueDate(value: Date | string | null) {
    this.dueDateField().setValue(value);
    this.dueDateField().markAsPristine();
    this.dueDateField().markAsUntouched();
  }

  readonly dueDateSettingField = computed(
    () => this.form().get(this.templateMap().due_date_setting) as SubscriptionFormControl,
  );
  get dueDateSetting(): string {
    return this.dueDateSettingField().value ?? '';
  }

  set dueDateSetting(value: string) {
    this.dueDateSettingField().setValue(value);
  }

  readonly interestRateField = computed(
    () => this.form().get(this.templateMap()['interest_rate']) as SubscriptionFormControl,
  );
  get interestRate(): string {
    return this.interestRateField().value ?? '';
  }

  set interestRate(value: string) {
    this.interestRateField().setValue(value);
  }

  readonly interestRateSettingField = computed(
    () => this.form().get(this.templateMap()['interest_rate_setting']) as SubscriptionFormControl,
  );
  get interestRateSetting(): string {
    return this.interestRateSettingField().value ?? '';
  }

  set interestRateSetting(value: string) {
    this.interestRateSettingField().setValue(value);
  }
}
