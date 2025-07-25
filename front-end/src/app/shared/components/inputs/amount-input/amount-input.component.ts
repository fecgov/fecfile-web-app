import { Component, computed, inject, input, Input, OnInit, viewChild } from '@angular/core';
import { AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { SchETransaction } from 'app/shared/models/sche-transaction.model';
import { ScheduleIds } from 'app/shared/models/transaction.model';
import { DateUtils } from 'app/shared/utils/date.utils';
import { InputNumber } from 'primeng/inputnumber';
import { BaseInputComponent } from '../base-input.component';
import { MemoCodeInputComponent } from '../memo-code/memo-code.component';
import { Form3X } from 'app/shared/models/form-3x.model';
import { ReportTypes } from 'app/shared/models/report.model';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { CalendarComponent } from '../../calendar/calendar.component';
import { LinkedReportInputComponent } from '../linked-report-input/linked-report-input.component';
import { InputNumberComponent } from '../input-number/input-number.component';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { Store } from '@ngrx/store';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'app-amount-input',
  styleUrls: ['./amount-input.component.scss'],
  templateUrl: './amount-input.component.html',
  imports: [
    ReactiveFormsModule,
    InputText,
    CalendarComponent,
    LinkedReportInputComponent,
    MemoCodeInputComponent,
    InputNumberComponent,
    ErrorMessagesComponent,
  ],
})
export class AmountInputComponent extends BaseInputComponent implements OnInit {
  private readonly store = inject(Store);
  readonly report = this.store.selectSignal(selectActiveReport);
  @Input() contributionAmountReadOnly = false;
  @Input() negativeAmountValueOnly = false;
  @Input() showAggregate = true;
  @Input() showCalendarYTD = false;
  @Input() showPayeeCandidateYTD = false;

  readonly memoHasOptional = input(false);
  @Input() memoItemHelpText: string | undefined;

  readonly amountInput = viewChild.required<InputNumber>('amountInput');
  readonly memoCode = viewChild(MemoCodeInputComponent);

  dateIsOutsideReport = false; // True if transaction date is outside the report dates
  contributionAmountInputStyleClass = '';
  readonly isF24 = computed(() => this.report().report_type === ReportTypes.F24);

  protected readonly isLoanRepayment = computed(
    () => !!this.transaction()?.loan_id && this.transactionType()?.scheduleId !== ScheduleIds.C,
  );
  protected readonly isDebtRepayment = computed(
    () => !!this.transaction()?.debt_id && this.transactionType()?.scheduleId !== ScheduleIds.D,
  );

  ngOnInit(): void {
    if (this.contributionAmountReadOnly) {
      this.contributionAmountInputStyleClass = 'readonly';
    }

    // If this is a two-date transaction. Monitor the other date, trigger validation on changes,
    // and set up the "Just checking..." pop-up as needed.
    if (this.templateMap.date && this.templateMap.date2) {
      const dateControl = this.form.get(this.templateMap.date) as SubscriptionFormControl;
      const date2Control = this.form.get(this.templateMap.date2) as SubscriptionFormControl;
      if (dateControl && date2Control) {
        dateControl.addSubscription(() => {
          date2Control.updateValueAndValidity({ emitEvent: false });
          this.memoCode()?.coverageDateQuestion.set(
            'Did you mean to enter a date outside of the report coverage period?',
          );
          // Opening of 'Just checking...' pop-up is handled in app-memo-code component directly.
        }, this.destroy$);
        date2Control.addSubscription((date: Date) => {
          dateControl.updateValueAndValidity({ emitEvent: false });
          // Only show the 'Just checking...' pop-up if there is no date in the 'date' field.
          if (!dateControl.value) {
            this.memoCode()?.coverageDate.set(date);
            this.memoCode()?.coverageDateQuestion.set(
              'Did you mean to enter a disbursement date outside of the report coverage period?',
            );
            this.memoCode()?.updateMemoItemWithDate(date);
          }
        }, this.destroy$);
      }
    }

    if (this.isDebtRepayment() || this.isLoanRepayment()) {
      this.form.get(this.templateMap.date)?.addValidators((control: AbstractControl): ValidationErrors | null => {
        const form3X = this.report() as Form3X;
        const date = control.value;
        if (date && !DateUtils.isWithin(date, form3X.coverage_from_date, form3X.coverage_through_date)) {
          const message = 'Date must fall within the report date range.';
          return { invaliddate: { msg: message } };
        }
        return null;
      });
    }

    // For Schedule E memos, insert the calendar_ytd from the parent into the form control
    const transaction = this.transaction();
    if (transaction) {
      if (transaction.transactionType.inheritCalendarYTD) {
        this.form
          .get(transaction.transactionType.templateMap.calendar_ytd)
          ?.setValue((transaction.parent_transaction as SchETransaction)?.calendar_ytd_per_election_office);
      }
    }
  }

  onInputAmount() {
    if (this.negativeAmountValueOnly) {
      // Automatically convert the amount value to a negative dollar amount.
      const inputValue = this.amountInput().input.nativeElement.value;
      if (inputValue.startsWith('$')) {
        const value = Number(parseInt(inputValue.slice(1)).toFixed(2));
        this.amountInput().updateInput(-1 * value, undefined, 'insert', undefined);
      }
    }
  }
}
