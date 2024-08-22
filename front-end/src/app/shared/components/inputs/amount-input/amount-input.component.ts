import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Form3X } from 'app/shared/models/form-3x.model';
import { Report, ReportTypes } from 'app/shared/models/report.model';
import { SchETransaction } from 'app/shared/models/sche-transaction.model';
import { isDebtRepayment, isLoanRepayment } from 'app/shared/models/transaction.model';
import { DateUtils } from 'app/shared/utils/date.utils';
import { InputNumber } from 'primeng/inputnumber';
import { Observable, takeUntil } from 'rxjs';
import { BaseInputComponent } from '../base-input.component';
import { MemoCodeInputComponent } from '../memo-code/memo-code.component';

@Component({
  selector: 'app-amount-input',
  styleUrls: ['./amount-input.component.scss'],
  templateUrl: './amount-input.component.html',
})
export class AmountInputComponent extends BaseInputComponent implements OnInit, OnChanges {
  @Input() contributionAmountReadOnly = false;
  @Input() negativeAmountValueOnly = false;
  @Input() showAggregate = true;
  @Input() showCalendarYTD = false;
  @Input() activeReport$?: Observable<Report>;

  @Input() memoCodeCheckboxLabel = '';
  @Input() memoItemHelpText: string | undefined;

  @ViewChild('amountInput') amountInput!: InputNumber;
  @ViewChild('memoCode') memoCode!: MemoCodeInputComponent;

  dateIsOutsideReport = false; // True if transaction date is outside the report dates
  contributionAmountInputStyleClass = '';
  reportTypes = ReportTypes;
  hasMemoCodeFlag?: boolean;
  isDebtRepaymentFlag?: boolean;
  isLoanRepaymentFlag?: boolean;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private store: Store,
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.contributionAmountReadOnly) {
      this.contributionAmountInputStyleClass = 'readonly';
    }

    // If this is a two-date transaction. Monitor the other date, trigger validation on changes,
    // and set up the "Just checking..." pop-up as needed.
    if (this.templateMap.date2) {
      this.form
        .get(this.templateMap.date)
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.form.get(this.templateMap.date2)?.updateValueAndValidity({ emitEvent: false });
          this.memoCode.coverageDateQuestion = 'Did you mean to enter a date outside of the report coverage period?';
          // Opening of 'Just checking...' pop-up is handled in app-memo-code component directly.
        });
      this.form
        .get(this.templateMap.date2)
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((date: Date) => {
          this.form.get(this.templateMap.date)?.updateValueAndValidity({ emitEvent: false });
          // Only show the 'Just checking...' pop-up if there is no date in the 'date' field.
          if (!this.form.get(this.templateMap.date)?.value) {
            this.memoCode.coverageDate = date;
            this.memoCode.coverageDateQuestion =
              'Did you mean to enter a disbursement date outside of the report coverage period?';
            this.memoCode.updateMemoItemWithDate(date);
          }
        });
    }

    // For Schedule E memos, insert the calendar_ytd from the parent into the form control
    if (this.transaction?.transactionType.inheritCalendarYTD) {
      this.form
        .get(this.transaction.transactionType.templateMap.calendar_ytd)
        ?.setValue((this.transaction.parent_transaction as SchETransaction)?.calendar_ytd_per_election_office);
    }

    if (isDebtRepayment(this.transaction) || isLoanRepayment(this.transaction)) {
      this.activeReport$?.subscribe((report) => {
        this.form.get(this.templateMap.date)?.addValidators((control: AbstractControl): ValidationErrors | null => {
          const date = control.value;
          if (
            date &&
            !DateUtils.isWithin(date, (report as Form3X).coverage_from_date, (report as Form3X).coverage_through_date)
          ) {
            const message = 'Date must fall within the report date range.';
            return { invaliddate: { msg: message } };
          }
          return null;
        });
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transaction'] && this.transaction) {
      this.hasMemoCodeFlag = this.transaction.transactionType.hasMemoCode();
      this.isDebtRepaymentFlag = isDebtRepayment(this.transaction);
      this.isLoanRepaymentFlag = isLoanRepayment(this.transaction);
    }
    this.changeDetectorRef.detectChanges();
  }

  onInputAmount() {
    if (this.negativeAmountValueOnly) {
      // Automatically convert the amount value to a negative dollar amount.
      const inputValue = this.amountInput.input.nativeElement.value;
      if (inputValue.startsWith('$')) {
        const value = Number(parseInt(inputValue.slice(1)).toFixed(2));
        this.amountInput.updateInput(-1 * value, undefined, 'insert', undefined);
      }
    }
  }

  protected readonly isLoanRepayment = isLoanRepayment;
  protected readonly isDebtRepayment = isDebtRepayment;
}
