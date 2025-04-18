import { Component, computed, effect, inject, input, viewChild } from '@angular/core';
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
import { SignalFormControl } from 'app/shared/utils/signal-form-control';
import { CalendarComponent } from '../../calendar/calendar.component';
import { LinkedReportInputComponent } from '../linked-report-input/linked-report-input.component';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { Store } from '@ngrx/store';
import { effectOnceIf } from 'ngxtension/effect-once-if';

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
export class AmountInputComponent extends BaseInputComponent {
  private readonly store = inject(Store);
  readonly report = this.store.selectSignal(selectActiveReport);

  readonly contributionAmountReadOnly = input(false);
  readonly negativeAmountValueOnly = input(false);
  readonly showAggregate = input(true);
  readonly showCalendarYTD = input(false);

  readonly memoCodeCheckboxLabel = input('');
  readonly memoItemHelpText = input<string>();

  readonly memoCode = viewChild<MemoCodeInputComponent>('memoCode');

  dateIsOutsideReport = false; // True if transaction date is outside the report dates
  readonly contributionAmountInputStyleClass = computed(() => (this.contributionAmountReadOnly() ? 'readonly' : ''));
  readonly reportTypes = ReportTypes;

  readonly dateControl = computed(() => this.form().get(this.templateMap().date) as SignalFormControl);
  readonly date2Control = computed(() => this.form().get(this.templateMap().date2) as SignalFormControl);

  constructor() {
    super();
    effectOnceIf(
      () => this.form() && this.transaction(),
      () => {
        const transaction = this.transaction();
        if (transaction?.transactionType.inheritCalendarYTD) {
          this.form()
            .get(transaction.transactionType.templateMap.calendar_ytd)
            ?.setValue((transaction.parent_transaction as SchETransaction)?.calendar_ytd_per_election_office);
        }
      },
    );
    effectOnceIf(
      () => (isDebtRepayment(this.transaction()) || isLoanRepayment(this.transaction())) && this.dateControl(),
      () => {
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
      },
    );
  }

  ngOnInit() {
    effect(
      () => {
        this.dateControl().valueChangeSignal();
        this.date2Control().updateValueAndValidity({ emitEvent: false });
        const memoCode = this.memoCode();
        if (memoCode)
          memoCode.coverageDateQuestion = 'Did you mean to enter a date outside of the report coverage period?';
      },
      { injector: this.injector },
    );

    effect(
      () => {
        const date = this.date2Control().valueChangeSignal();
        this.dateControl().updateValueAndValidity({ emitEvent: false });
        const memoCode = this.memoCode();
        // Only show the 'Just checking...' pop-up if there is no date in the 'date' field.
        if (!this.dateControl().value && memoCode) {
          memoCode.coverageDateQuestion =
            'Did you mean to enter a disbursement date outside of the report coverage period?';
          memoCode.updateMemoItemWithDate(date);
        }
      },
      { injector: this.injector },
    );
  }

  protected readonly isLoanRepayment = isLoanRepayment;
  protected readonly isDebtRepayment = isDebtRepayment;
}
