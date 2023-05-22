import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { InputNumber } from 'primeng/inputnumber';
import { takeUntil } from 'rxjs';
import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'app-amount-input',
  styleUrls: ['./amount-input.component.scss'],
  templateUrl: './amount-input.component.html',
})
export class AmountInputComponent extends BaseInputComponent implements OnInit, OnChanges {
  @Input() memoCodeReadOnly = false;
  @Input() contributionAmountReadOnly = false;
  @Input() memoItemHelpText =
    'The dollar amount in a memo item is not incorporated into the total figures for the schedule.';
  @Input() negativeAmountValueOnly = false;
  @Input() showAggregate = true;

  @ViewChild('amountInput') amountInput!: InputNumber;

  dateIsOutsideReport = false; // True if transaction date is outside the report dates
  contributionAmountInputStyleClass = '';
  report?: F3xSummary;

  memoControl: FormControl = new FormControl();
  outOfDateDialogVisible = false;

  constructor(private changeDetectorRef: ChangeDetectorRef, private store: Store) {
    super();
  }

  ngOnInit(): void {
    if (this.contributionAmountReadOnly) {
      this.contributionAmountInputStyleClass = 'readonly';
    }

    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => {
        this.report = report as F3xSummary;
      });

    this.form
      .get(this.templateMap.date)
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((date: Date) => {
        this.updateMemoItemWithDate(date);
      });

    this.memoControl = (this.form.get(this.templateMap.memo_code) as FormControl) || this.memoControl;
    const savedDate: Date | null = this.form.get(this.templateMap.date)?.value as Date | null;
    if (savedDate) {
      this.updateMemoItemWithDate(savedDate);
    }
  }

  ngOnChanges(): void {
    this.changeDetectorRef.detectChanges();
  }

  closeOutOfDateDialog() {
    this.outOfDateDialogVisible = false;
  }

  onMemoItemClick() {
    if (!this.memoCodeReadOnly && this.dateIsOutsideReport && !this.memoControl.value) {
      this.outOfDateDialogVisible = true;
    }
  }

  updateMemoItemWithDate(date: Date) {
    if (date && this.report?.coverage_from_date && this.report?.coverage_through_date) {
      if (date < this.report.coverage_from_date || date > this.report.coverage_through_date) {
        this.memoControl.addValidators(Validators.requiredTrue);
        this.memoControl.markAsTouched();
        this.memoControl.updateValueAndValidity();
        this.dateIsOutsideReport = true;
        if (!this.memoControl.value) {
          this.outOfDateDialogVisible = true;
        }
      } else {
        if (this.dateIsOutsideReport && this.memoControl.hasValidator(Validators.requiredTrue)) {
          this.memoControl.removeValidators([Validators.requiredTrue]);
          this.memoControl.markAsTouched();
          this.memoControl.updateValueAndValidity();
        }
        this.dateIsOutsideReport = false;
      }
    }
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
