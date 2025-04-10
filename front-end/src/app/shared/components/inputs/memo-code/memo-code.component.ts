import { ChangeDetectorRef, Component, computed, inject, input, Input, OnChanges, OnInit } from '@angular/core';
import { Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Form3X } from 'app/shared/models/form-3x.model';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { takeUntil } from 'rxjs';
import { TransactionFormUtils } from '../../transaction-type-base/transaction-form.utils';
import { BaseInputComponent } from '../base-input.component';
import { ReportTypes } from 'app/shared/models/report.model';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { CheckboxModule } from 'primeng/checkbox';
import { Tooltip } from 'primeng/tooltip';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { SelectButton } from 'primeng/selectbutton';
import { Dialog } from 'primeng/dialog';
import { ButtonDirective } from 'primeng/button';
import { FecDatePipe } from '../../../pipes/fec-date.pipe';

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

  readonly memoItemHelpText = computed(() => {
    if (this.overrideMemoItemHelpText()) return this.overrideMemoItemHelpText();
    return 'The dollar amount in a memo item is not incorporated into the total figures for the schedule.';
  });
  memoCodeReadOnly = false;
  coverageDate: Date = new Date();
  coverageDateQuestion = 'Did you mean to date this transaction outside of the report coverage period?';
  reportTypes = ReportTypes;

  dateIsOutsideReport = false; // True if transaction date is outside the report dates
  report?: Form3X;

  readonly memoControl = computed(() => this.form().get(this.templateMap().memo_code) as SubscriptionFormControl);
  outOfDateDialogVisible = false;
  memoCodeMapOptions: any[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any

  ngOnInit(): void {
    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => {
        this.report = report as Form3X;
      });

    const dateControl = this.form().get(this.templateMap().date) as SubscriptionFormControl;
    if (dateControl?.enabled) {
      dateControl.addSubscription((date: Date) => {
        this.coverageDate = date;
        this.updateMemoItemWithDate(date);
      }, this.destroy$);
    }

    this.memoCodeReadOnly = TransactionFormUtils.isMemoCodeReadOnly(this.transaction()?.transactionType);

    const savedDate: Date | null = this.form().get(this.templateMap().date)?.value as Date | null;
    if (savedDate) {
      this.updateMemoItemWithDate(savedDate);
    }

    if (this.transaction()?.transactionType?.memoCodeMap) {
      const memoCodeMap = this.transaction()!.transactionType.memoCodeMap!;
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

    if (this.transaction()?.transactionType?.memoCodeTransactionTypes) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      this.memoControl()
        .valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((value) => {
          this.updateTransactionTypeIdentifier();
        });
    }

    this.updateTransactionTypeIdentifier();
  }

  ngOnChanges(): void {
    this.changeDetectorRef.detectChanges();
  }

  updateTransactionTypeIdentifier(): void {
    if (this.transaction()?.transactionType?.memoCodeTransactionTypes) {
      const memo_code = this.memoControl().value as boolean;
      if (memo_code) {
        this.transaction()!.transaction_type_identifier =
          this.transaction()!.transactionType.memoCodeTransactionTypes!.true;
      } else {
        this.transaction()!.transaction_type_identifier =
          this.transaction()!.transactionType.memoCodeTransactionTypes!.false;
      }
    }
  }

  closeOutOfDateDialog() {
    this.outOfDateDialogVisible = false;
  }

  onMemoItemClick() {
    if (!this.memoCodeReadOnly && this.dateIsOutsideReport && !this.memoControl().value) {
      this.outOfDateDialogVisible = true;
    }
  }

  updateMemoItemWithDate(date: Date) {
    if (
      this.transaction()?.transactionType?.doMemoCodeDateCheck &&
      this.report?.coverage_from_date &&
      this.report?.coverage_through_date
    ) {
      if (date && (date < this.report.coverage_from_date || date > this.report.coverage_through_date)) {
        this.memoControl().addValidators(Validators.requiredTrue);
        this.memoControl().markAsTouched();
        this.memoControl().markAsDirty();
        this.memoControl().updateValueAndValidity();
        this.dateIsOutsideReport = true;
        if (!this.memoControl().value) {
          this.outOfDateDialogVisible = true;
        }
      } else {
        if (this.dateIsOutsideReport && this.memoControl().hasValidator(Validators.requiredTrue)) {
          this.memoControl().removeValidators([Validators.requiredTrue]);
          this.memoControl().markAsTouched();
          this.memoControl().updateValueAndValidity();
        }
        this.dateIsOutsideReport = false;
      }
    }
  }
}
