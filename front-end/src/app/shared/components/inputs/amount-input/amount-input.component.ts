import { Component, computed, inject, input, OnInit, viewChild } from '@angular/core';
import { AbstractControl, ValidationErrors, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ScheduleETransactionTypes, SchETransaction } from 'app/shared/models/sche-transaction.model';
import { ScheduleIds } from 'app/shared/models/transaction.model';
import { DateUtils } from 'app/shared/utils/date.utils';
import { InputNumber, InputNumberModule } from 'primeng/inputnumber';
import { BaseInputComponent } from '../base-input.component';
import { MemoCodeInputComponent } from '../memo-code/memo-code.component';
import { Form3X } from 'app/shared/models/form-3x.model';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { CalendarComponent } from '../../calendar/calendar.component';
import {
  LinkedReportInputComponent,
  LinkedReportTooltipText,
} from '../linked-report-input/linked-report-input.component';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { Store } from '@ngrx/store';
import { InputText } from 'primeng/inputtext';
import { Form24, ReportTypes } from 'app/shared/models';
import { TooltipModule } from 'primeng/tooltip';
import { Form24Service } from 'app/shared/services/form-24.service';
import { derivedAsync } from 'ngxtension/derived-async';

@Component({
  selector: 'app-amount-input',
  styleUrls: ['./amount-input.component.scss'],
  templateUrl: './amount-input.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputText,
    CalendarComponent,
    LinkedReportInputComponent,
    MemoCodeInputComponent,
    ErrorMessagesComponent,
    TooltipModule,
    InputNumberModule,
  ],
})
export class AmountInputComponent extends BaseInputComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly form24Service = inject(Form24Service);
  readonly report;
  readonly contributionAmountReadOnly = input(false);
  readonly negativeAmountValueOnly = input(false);
  readonly showAggregate = input(true);
  readonly showCalendarYTD = input(false);
  readonly showPayeeCandidateYTD = input(false);
  readonly memoHasOptional = input(false);
  readonly memoItemHelpText = input<string | undefined>();

  readonly amountInput = viewChild.required<InputNumber>('amountInput');
  readonly memoCode = viewChild(MemoCodeInputComponent);
  readonly contributionAmountInputStyleClass;

  readonly isF24;
  readonly isIE;
  readonly linked24;
  readonly linked24Label;
  readonly tooltipText = LinkedReportTooltipText;

  protected readonly isLoanRepayment;
  protected readonly isDebtRepayment;

  constructor() {
    super();
    this.report = this.store.selectSignal(selectActiveReport);
    this.contributionAmountInputStyleClass = computed(() => (this.contributionAmountReadOnly() ? 'readonly' : ''));
    this.isF24 = computed(() => this.report().report_type === ReportTypes.F24);
    this.isIE = computed(() => {
      const transactionType = this.transaction()?.transaction_type_identifier;
      if (!transactionType) return false;
      return Object.keys(ScheduleETransactionTypes).includes(transactionType);
    });
    this.linked24 = derivedAsync(async () => {
      if (!this.isIE()) return undefined;
      const reports = this.transaction()?.reports;
      const report = reports?.find((report) => report.report_type === ReportTypes.F24);
      if (!report) return undefined;
      return (await this.form24Service.get(report.id!)) as Form24;
    });
    this.linked24Label = computed(() => {
      const report = this.linked24();
      if (!report) return '';
      return report.name ?? '';
    });
    this.isLoanRepayment = computed(
      () => !!this.transaction()?.loan_id && this.transactionType()?.scheduleId !== ScheduleIds.C,
    );
    this.isDebtRepayment = computed(
      () => !!this.transaction()?.debt_id && this.transactionType()?.scheduleId !== ScheduleIds.D,
    );
  }

  ngOnInit(): void {
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
    if (this.negativeAmountValueOnly()) {
      // Automatically convert the amount value to a negative dollar amount.
      const inputValue = this.amountInput().input.nativeElement.value;
      if (inputValue.startsWith('$')) {
        const value = Number(parseInt(inputValue.slice(1)).toFixed(2));
        this.amountInput().updateInput(-1 * value, undefined, 'insert', undefined);
      }
    }
  }
}
