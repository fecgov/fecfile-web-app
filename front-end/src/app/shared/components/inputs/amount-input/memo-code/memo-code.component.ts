import { ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { takeUntil } from 'rxjs';
import { BaseInputComponent } from '../../base-input.component';
import { Transaction } from 'app/shared/models/transaction.model';

@Component({
  selector: 'app-memo-code',
  styleUrls: ['./memo-code.component.scss'],
  templateUrl: './memo-code.component.html',
})
export class MemoCodeInputComponent extends BaseInputComponent implements OnInit, OnChanges {
  @Input() overrideMemoItemHelpText: string | undefined;
  @Input() overrideMemoCodeReadOnly: boolean | undefined;
  @Input() transaction: Transaction | undefined;
  @Input() checkboxLabel = 'MEMO ITEM';
  @Input() doDateCheck = true;

  memoItemHelpText = 'The dollar amount in a memo item is not incorporated into the total figures for the schedule.';
  memoCodeReadOnly = false;

  dateIsOutsideReport = false; // True if transaction date is outside the report dates
  report?: F3xSummary;

  memoControl: FormControl = new FormControl();
  outOfDateDialogVisible = false;
  memoCodeMapOptions: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any

  constructor(private changeDetectorRef: ChangeDetectorRef, private store: Store) {
    super();
  }

  ngOnInit(): void {
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

    if (this.overrideMemoCodeReadOnly) this.memoCodeReadOnly = this.overrideMemoCodeReadOnly;
    if (this.overrideMemoItemHelpText) this.memoItemHelpText = this.overrideMemoItemHelpText;

    this.memoControl = (this.form.get(this.templateMap.memo_code) as FormControl) || this.memoControl;
    const savedDate: Date | null = this.form.get(this.templateMap.date)?.value as Date | null;
    if (savedDate) {
      this.updateMemoItemWithDate(savedDate);
    }

    if (this.transaction?.transactionType?.memoCodeMap) {
      const memoCodeMap = this.transaction.transactionType.memoCodeMap;
      this.memoCodeMapOptions = [
        {
          value: false,
          label: memoCodeMap.false,
        },
        {
          value: true,
          label: memoCodeMap.true,
        },
      ];
    }

    if (this.transaction?.transactionType?.memoCodeTransactionTypes) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      this.memoControl?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
        this.updateTransactionTypeIdentifier();
      });
    }

    this.updateTransactionTypeIdentifier();
  }

  ngOnChanges(): void {
    this.changeDetectorRef.detectChanges();
  }

  updateTransactionTypeIdentifier(): void {
    if (this.transaction?.transactionType?.memoCodeTransactionTypes) {
      const memo_code = this.form.get(this.templateMap.memo_code)?.value as boolean;
      if (memo_code) {
        this.transaction.transaction_type_identifier = this.transaction.transactionType.memoCodeTransactionTypes.true;
      } else {
        this.transaction.transaction_type_identifier = this.transaction.transactionType.memoCodeTransactionTypes.false;
      }
    }
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
    if (this.doDateCheck && this.report?.coverage_from_date && this.report?.coverage_through_date) {
      if (date && (date < this.report.coverage_from_date || date > this.report.coverage_through_date)) {
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
}
