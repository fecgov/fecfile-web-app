import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';
import { InputNumber } from 'primeng/inputnumber';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { Subject, takeUntil } from 'rxjs';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';

@Component({
  selector: 'app-amount-input',
  templateUrl: './amount-input.component.html',
})
export class AmountInputComponent extends BaseInputComponent implements OnInit, OnDestroy {
  @Input() memoCodeReadOnly = false;
  @Input() contributionAmountReadOnly = false;
  @Input() memoItemHelpText =
    'The dollar amount in a memo item is not incorporated into the total figure for the schedule.';
  @Input() negativeAmountValueOnly = false;

  @ViewChild('amountInput') amountInput!: InputNumber;

  defaultMemoCodeReadOnly = false;
  defaultMemoItemHelpText = this.memoItemHelpText;
  contributionDateOutsideReport = false;
  contributionAmountInputStyleClass = '';
  destroy$: Subject<boolean> = new Subject<boolean>();
  report?: F3xSummary;

  constructor(private store: Store) {
    super();
  }

  ngOnInit(): void {
    if (this.contributionAmountReadOnly) {
      this.contributionAmountInputStyleClass = 'readonly';
    }

    this.defaultMemoCodeReadOnly = this.memoCodeReadOnly;
    this.defaultMemoItemHelpText = this.memoItemHelpText;

    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => {
        this.report = report as F3xSummary;
        const date: Date = this.form.get('contribution_date')?.value;
        if (date) {
          this.updateMemoItemWithDate(date);
        }
      });

    this.form
      .get('contribution_date')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((date) => {
        this.updateMemoItemWithDate(date);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  updateMemoItemWithDate(date: Date) {
    if (this.report?.coverage_from_date && this.report?.coverage_through_date) {
      if (date < this.report.coverage_from_date || date > this.report.coverage_through_date) {
        this.memoCodeReadOnly = true;
        this.memoItemHelpText =
          'Memo item is required since your transaction date falls outside of report coverage dates';
        this.contributionDateOutsideReport = true;
        this.form.patchValue({
          memo_code: true,
        });
      } else {
        this.memoCodeReadOnly = this.defaultMemoCodeReadOnly;
        this.memoItemHelpText = this.defaultMemoItemHelpText;
        this.contributionDateOutsideReport = false;
      }
    }
  }

  // prettier-ignore
  onInputAmount($event: KeyboardEvent) { // eslint-disable-line @typescript-eslint/no-unused-vars
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
