import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { InputNumber } from 'primeng/inputnumber';
import { BaseInputComponent } from '../base-input.component';
import { MemoCodeInputComponent } from '../memo-code/memo-code.component';
import { SchETransaction } from 'app/shared/models/sche-transaction.model';

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

  @Input() memoCodeCheckboxLabel = '';
  @Input() memoItemHelpText: string | undefined;

  @ViewChild('amountInput') amountInput!: InputNumber;
  @ViewChild('memoCode') memoCode!: MemoCodeInputComponent;

  dateIsOutsideReport = false; // True if transaction date is outside the report dates
  contributionAmountInputStyleClass = '';

  constructor(private changeDetectorRef: ChangeDetectorRef, private store: Store) {
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
        ?.setValue((this.transaction.parent_transaction as SchETransaction)?.calendar_ytd);
    }
  }

  ngOnChanges(): void {
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
}
