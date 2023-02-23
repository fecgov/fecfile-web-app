import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { BaseInputComponent } from '../base-input.component';
import { InputNumber } from 'primeng/inputnumber';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { Subject, takeUntil } from 'rxjs';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-amount-input',
  templateUrl: './amount-input.component.html',
})
export class AmountInputComponent extends BaseInputComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() memoCodeReadOnly = false;
  @Input() contributionAmountReadOnly = false;
  @Input() memoItemHelpText =
    'The dollar amount in a memo item is not incorporated into the total figure for the schedule.';
  @Input() negativeAmountValueOnly = false;

  @ViewChild('amountInput') amountInput!: InputNumber;
  @ViewChild('memoItem', { read: ElementRef }) memoItem!: ElementRef;

  defaultMemoCodeReadOnly = false; // True if the memo code is readonly at all times
  defaultMemoItemHelpText = this.memoItemHelpText; // Original default value of the memo item help text
  dateIsOutsideReport = false; // True if transaction date is outside the report dates
  contributionAmountInputStyleClass = '';
  report?: F3xSummary;
  destroy$: Subject<boolean> = new Subject<boolean>();
  unlistener!: () => void;

  constructor(private store: Store, protected confirmationService: ConfirmationService, private renderer2: Renderer2) {
    super();
  }

  ngOnInit(): void {
    if (this.contributionAmountReadOnly) {
      this.contributionAmountInputStyleClass = 'readonly';
    }

    // These property records if the memo code is supposed to be readonly at all times
    this.defaultMemoCodeReadOnly = this.memoCodeReadOnly;

    // This property records the default value of the memo item help text
    this.defaultMemoItemHelpText = this.memoItemHelpText;

    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => {
        this.report = report as F3xSummary;
        // const date: Date = this.form.get(this.templateMap.date)?.value;
        // if (date) {
        //   this.updateMemoItemWithDate(date);
        // }
      });

    this.form
      .get(this.templateMap.date)
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((date) => {
        this.updateMemoItemWithDate(date);
      });
  }

  ngAfterViewInit(): void {
    this.unlistener = this.renderer2.listen(this.memoItem.nativeElement, 'click', this.onMemoItemClick.bind(this));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.unlistener();
  }

  // prettier-ignore
  onMemoItemClick($event: MouseEvent) { // eslint-disable-line @typescript-eslint/no-unused-vars
    if (!this.defaultMemoCodeReadOnly && this.dateIsOutsideReport) {
      this.confirmationService.confirm({
        key: 'memo-item-dialog',
        header: 'Confirm',
        icon: 'pi pi-info-circle',
        message: 'Hey-o',
        acceptLabel: 'Continue',
        rejectLabel: 'Cancel',
        accept: () => {
          console.log('Yes please');
        },
        reject: () => {
          return;
        },
      });
    }
  }

  updateMemoItemWithDate(date: Date) {
    if (this.defaultMemoCodeReadOnly) return;

    if (this.report?.coverage_from_date && this.report?.coverage_through_date) {
      if (date < this.report.coverage_from_date || date > this.report.coverage_through_date) {
        this.memoCodeReadOnly = true;
        this.memoItemHelpText =
          'Memo item is required since your transaction date falls outside of report coverage dates';
        this.dateIsOutsideReport = true;
        this.form.patchValue({
          memo_code: true,
        });
      } else {
        this.memoCodeReadOnly = false;
        this.memoItemHelpText = this.defaultMemoItemHelpText;
        this.dateIsOutsideReport = false;
        this.form.patchValue({
          memo_code: false,
        });
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
