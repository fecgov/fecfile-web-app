import { Component, computed, effect, inject, input, OnInit, viewChild } from '@angular/core';
import { AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { SchETransaction } from 'app/shared/models/sche-transaction.model';
import { isDebtRepayment, isLoanRepayment } from 'app/shared/models/transaction.model';
import { DateUtils } from 'app/shared/utils/date.utils';
import { InputNumber } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { BaseInputComponent } from '../base-input.component';
import { MemoCodeInputComponent } from '../memo-code/memo-code.component';
import { Form3X } from 'app/shared/models/form-3x.model';
import { ReportTypes } from 'app/shared/models/report.model';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { CalendarComponent } from '../../calendar/calendar.component';
import { LinkedReportInputComponent } from '../linked-report-input/linked-report-input.component';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-amount-input',
  styleUrls: ['./amount-input.component.scss'],
  templateUrl: './amount-input.component.html',
  imports: [
    ReactiveFormsModule,
    InputText,
    InputNumber,
    CalendarComponent,
    LinkedReportInputComponent,
    MemoCodeInputComponent,
    ErrorMessagesComponent,
  ],
})
export class AmountInputComponent extends BaseInputComponent implements OnInit {
  private readonly store = inject(Store);
  readonly report = this.store.selectSignal(selectActiveReport);

  readonly contributionAmountReadOnly = input(false);
  readonly negativeAmountValueOnly = input(false);
  readonly showAggregate = input(true);
  readonly showCalendarYTD = input(false);

  readonly memoCodeCheckboxLabel = input('');
  readonly memoItemHelpText = input<string>();

  memoCode = viewChild.required<MemoCodeInputComponent>('memoCode');

  dateIsOutsideReport = false; // True if transaction date is outside the report dates
  contributionAmountInputStyleClass = computed(() => (this.contributionAmountReadOnly() ? 'readonly' : ''));
  reportTypes = ReportTypes;

  readonly dateControl = computed(() => this.form().get(this.templateMap().date) as SubscriptionFormControl);
  readonly date2Control = computed(() => this.form().get(this.templateMap().date2) as SubscriptionFormControl);

  constructor() {
    super();
    effect(() => {
      if (isDebtRepayment(this.transaction()) || isLoanRepayment(this.transaction())) {
        this.dateControl().addValidators((control: AbstractControl): ValidationErrors | null => {
          const date = control.value;
          if (
            date &&
            !DateUtils.isWithin(
              date,
              (this.report() as Form3X).coverage_from_date,
              (this.report() as Form3X).coverage_through_date,
            )
          ) {
            const message = 'Date must fall within the report date range.';
            return { invaliddate: { msg: message } };
          }
          return null;
        });
      }
    });
  }

  ngOnInit(): void {
    // If this is a two-date transaction. Monitor the other date, trigger validation on changes,
    // and set up the "Just checking..." pop-up as needed.
    if (this.templateMap().date2) {
      this.dateControl().valueChanges.subscribe(() => {
        this.date2Control().updateValueAndValidity({ emitEvent: false });
        this.memoCode().coverageDateQuestion = 'Did you mean to enter a date outside of the report coverage period?';
      });

      this.date2Control().valueChanges.subscribe((date: Date) => {
        this.dateControl().updateValueAndValidity({ emitEvent: false });
        // Only show the 'Just checking...' pop-up if there is no date in the 'date' field.
        if (!this.dateControl().value) {
          this.memoCode().coverageDate = date;
          this.memoCode().coverageDateQuestion =
            'Did you mean to enter a disbursement date outside of the report coverage period?';
          this.memoCode().updateMemoItemWithDate(date);
        }
      });
    }

    // For Schedule E memos, insert the calendar_ytd from the parent into the form control
    const transaction = this.transaction();
    if (transaction?.transactionType.inheritCalendarYTD) {
      this.form()
        .get(transaction.transactionType.templateMap.calendar_ytd)
        ?.setValue((transaction.parent_transaction as SchETransaction)?.calendar_ytd_per_election_office);
    }
  }

  protected readonly isLoanRepayment = isLoanRepayment;
  protected readonly isDebtRepayment = isDebtRepayment;
}
