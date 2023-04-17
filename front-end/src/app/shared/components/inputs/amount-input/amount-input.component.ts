import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';
import { InputNumber } from 'primeng/inputnumber';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { Subject, takeUntil } from 'rxjs';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-amount-input',
  styleUrls: ['./amount-input.component.scss'],
  templateUrl: './amount-input.component.html',
})
export class AmountInputComponent extends BaseInputComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() memoCodeReadOnly = false;
  @Input() contributionAmountReadOnly = false;
  @Input() amountReadOnly = false;
  @Input() memoCodeHelpText =
    'The dollar amount in a memo item is not incorporated into the total figure for the schedule.';
  @Input() negativeAmountValueOnly = false;
  @Input() showAggregate = true;

  @ViewChild('amountInput') amountInput!: InputNumber;
  @ViewChild('memoCode', { read: ElementRef }) memoCode!: ElementRef;

  defaultMemoCodeReadOnly = false; // True if the memo code is readonly at all times
  defaultMemoCodeHelpText = this.memoCodeHelpText; // Original default value of the memo item help text
  dateIsOutsideReport = false; // True if transaction date is outside the report dates
  amountInputStyleClass = '';
  report?: F3xSummary;
  destroy$: Subject<boolean> = new Subject<boolean>();

  outOfDateDialogVisible = false;
  unlistener!: () => void;

  constructor(private store: Store, private renderer2: Renderer2) {
    super();
  }

  ngOnInit(): void {
    if (this.amountReadOnly) {
      this.amountInputStyleClass = 'readonly';
    }

    // These property records if the memo code is supposed to be readonly at all times
    this.defaultMemoCodeReadOnly = this.memoCodeReadOnly;

    // This property records the default value of the memo item help text
    this.defaultMemoCodeHelpText = this.memoCodeHelpText;

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
  }

  ngAfterViewInit(): void {
    this.unlistener = this.renderer2.listen(this.memoCode.nativeElement, 'click', this.onMemoItemClick.bind(this));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.unlistener();
  }

  closeOutOfDateDialog() {
    this.outOfDateDialogVisible = false;
  }

  // prettier-ignore
  onMemoItemClick($event: MouseEvent) { // eslint-disable-line @typescript-eslint/no-unused-vars
    if (!this.defaultMemoCodeReadOnly && this.dateIsOutsideReport) {
      if (!this.form.get(this.templateMap.memo_code)?.value){
        this.outOfDateDialogVisible = true;
      }
    }
  }

  updateMemoItemWithDate(date: Date) {
    if (this.defaultMemoCodeReadOnly) return;

    if (this.report?.coverage_from_date && this.report?.coverage_through_date && !this.memoCodeReadOnly) {
      const memo_code = this.form.get(this.templateMap.memo_code);
      if (date < this.report.coverage_from_date || date > this.report.coverage_through_date) {
        this.outOfDateDialogVisible = true;
        memo_code?.addValidators(Validators.requiredTrue);
        memo_code?.markAsTouched();
        memo_code?.updateValueAndValidity();
        this.dateIsOutsideReport = true;
      } else {
        if (this.dateIsOutsideReport && memo_code?.hasValidator(Validators.required)) {
          memo_code?.clearValidators();
          memo_code?.updateValueAndValidity();
        }
        this.dateIsOutsideReport = false;
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
