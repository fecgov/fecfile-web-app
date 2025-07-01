import { ChangeDetectorRef, Component, computed, inject, input, OnChanges, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Form3X } from 'app/shared/models/form-3x.model';
import { ReportTypes } from 'app/shared/models/report.model';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { ButtonDirective } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { Dialog } from 'primeng/dialog';
import { SelectButton } from 'primeng/selectbutton';
import { Tooltip } from 'primeng/tooltip';
import { takeUntil } from 'rxjs';
import { FecDatePipe } from '../../../pipes/fec-date.pipe';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { TransactionFormUtils } from '../../transaction-type-base/transaction-form.utils';
import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'app-memo-code',
  styleUrls: ['./memo-code.component.scss'],
  templateUrl: './memo-code.component.html',
  imports: [
    ReactiveFormsModule,
    Tooltip,
    ErrorMessagesComponent,
    SelectButton,
    Dialog,
    ButtonDirective,
    FecDatePipe,
    CheckboxModule,
  ],
})
export class MemoCodeInputComponent extends BaseInputComponent implements OnInit, OnChanges {
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly store = inject(Store);
  readonly overrideMemoItemHelpText = input<string>();
  readonly checkboxLabel = input('');
  readonly parenLabel = input<string>();

  readonly memoItemHelpText = computed(() =>
    this.overrideMemoItemHelpText()
      ? this.overrideMemoItemHelpText()!
      : 'The dollar amount in a memo item is not incorporated into the total figures for the schedule.',
  );
  readonly memoCodeReadOnly = computed(() => TransactionFormUtils.isMemoCodeReadOnly(this.transactionType()));
  coverageDate: Date = new Date();
  coverageDateQuestion = 'Did you mean to date this transaction outside of the report coverage period?';
  reportTypes = ReportTypes;

  dateIsOutsideReport = false; // True if transaction date is outside the report dates
  private readonly report = this.store.selectSignal(selectActiveReport);
  readonly coverageFromDate = computed(() => (this.report() as Form3X)?.coverage_from_date);
  readonly coverageThroughDate = computed(() => (this.report() as Form3X)?.coverage_through_date);

  memoControl: SubscriptionFormControl<boolean> = new SubscriptionFormControl<boolean>();
  outOfDateDialogVisible = false;
  readonly memoCodeMapOptions = computed(() => {
    const memoCodeMap = this.transactionType()?.memoCodeMap;
    if (memoCodeMap) {
      return [
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
    return [];
  });

  ngOnInit(): void {
    const dateControl = this.form.get(this.templateMap.date) as SubscriptionFormControl;
    if (dateControl?.enabled) {
      dateControl.addSubscription((date: Date) => {
        if (date && date.getTime() !== this.coverageDate.getTime()) {
          this.coverageDate = date;
          this.updateMemoItemWithDate(date);
        }
      }, this.destroy$);
    }

    this.memoControl =
      (this.form.get(this.templateMap.memo_code) as SubscriptionFormControl<boolean>) || this.memoControl;
    const savedDate: Date | null = this.form.get(this.templateMap.date)?.value as Date | null;
    if (savedDate) {
      this.updateMemoItemWithDate(savedDate);
    }

    if (this.transactionType()?.memoCodeTransactionTypes) {
      this.memoControl?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
        this.updateTransactionTypeIdentifier();
      });
    }

    this.updateTransactionTypeIdentifier();
  }

  ngOnChanges(): void {
    this.changeDetectorRef.detectChanges();
  }

  updateTransactionTypeIdentifier(): void {
    const transaction = this.transaction();
    if (transaction?.transactionType.memoCodeTransactionTypes) {
      transaction.transaction_type_identifier = this.memoControl.value
        ? transaction.transactionType.memoCodeTransactionTypes.true
        : transaction.transactionType.memoCodeTransactionTypes.false;
    }
  }

  closeOutOfDateDialog() {
    this.outOfDateDialogVisible = false;
  }

  onMemoItemClick() {
    if (!this.memoCodeReadOnly() && this.dateIsOutsideReport && !this.memoControl.value) {
      this.outOfDateDialogVisible = true;
    }
  }

  updateMemoItemWithDate(date: Date) {
    const coverageFromDate = this.coverageFromDate();
    const coverageThrough = this.coverageThroughDate();
    if (this.transactionType()?.doMemoCodeDateCheck && coverageFromDate && coverageThrough) {
      if (date && (date < coverageFromDate || date > coverageThrough)) {
        this.memoControl.addValidators(Validators.requiredTrue);
        this.memoControl.markAsTouched();
        this.memoControl.markAsDirty();
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
