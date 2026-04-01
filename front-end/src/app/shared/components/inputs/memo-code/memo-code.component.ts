import { ChangeDetectorRef, Component, computed, inject, input, OnChanges, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Form3X } from 'app/shared/models/reports/form-3x.model';
import { ReportTypes } from 'app/shared/models/reports/report.model';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { ButtonDirective } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectButton } from 'primeng/selectbutton';
import { Tooltip } from 'primeng/tooltip';
import { combineLatest, distinctUntilChanged, map, of, startWith, takeUntil } from 'rxjs';
import { FecDatePipe } from '../../../pipes/fec-date.pipe';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { TransactionFormUtils } from '../../transaction-type-base/transaction-form.utils';
import { BaseInputComponent } from '../base-input.component';
import { DialogComponent } from '../../dialog/dialog.component';

@Component({
  selector: 'app-memo-code',
  styleUrls: ['./memo-code.component.scss'],
  templateUrl: './memo-code.component.html',
  imports: [
    ReactiveFormsModule,
    Tooltip,
    ErrorMessagesComponent,
    SelectButton,
    DialogComponent,
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
  readonly coverageDate = signal<Date | null>(null);
  readonly coverageDateQuestion = signal(
    'Did you mean to date this transaction outside of the report coverage period?',
  );
  reportTypes = ReportTypes;

  dateIsOutsideReport = false; // True if transaction date is outside the report dates
  private readonly report = this.store.selectSignal(selectActiveReport);
  readonly coverageFromDate = computed(() => (this.report() as Form3X)?.coverage_from_date);
  readonly coverageThroughDate = computed(() => (this.report() as Form3X)?.coverage_through_date);

  memoControl: SubscriptionFormControl<boolean> = new SubscriptionFormControl<boolean>();
  readonly outOfDateDialogVisible = signal(false);
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
    const dateControl = this.form.get(this.templateMap.date) as SubscriptionFormControl<Date | null>;
    const date2Control = this.form.get(this.templateMap.date2) as SubscriptionFormControl<Date | null>;
    const d1$ = dateControl ? dateControl.valueChanges.pipe(startWith(dateControl.value)) : of(null);
    const d2$ = date2Control ? date2Control.valueChanges.pipe(startWith(date2Control.value)) : of(null);
    const activeDate$ = combineLatest([d1$, d2$]).pipe(
      map(([d1, d2]) => {
        const val1 = dateControl?.enabled ? d1 : null;
        const val2 = date2Control?.enabled ? d2 : null;
        return val1 || val2;
      }),
      distinctUntilChanged((prev, curr) => prev?.getTime() === curr?.getTime()),
    );

    this.memoControl = this.form.get(this.templateMap.memo_code) as SubscriptionFormControl<boolean>;
    const memo$ = this.memoControl.valueChanges.pipe(startWith(this.memoControl.value));
    combineLatest([activeDate$, memo$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([activeDate, isMemoChecked]) => {
        this.updateTransactionTypeIdentifier();
        if (!isMemoChecked && activeDate) {
          this.updateMemoItemWithDate(activeDate);
        } else {
          this.clearOutOfDateRequirement();
        }
      });
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

  private clearOutOfDateRequirement(): void {
    if (this.dateIsOutsideReport && this.memoControl.hasValidator(Validators.requiredTrue)) {
      this.memoControl.removeValidators([Validators.requiredTrue]);
      this.memoControl.markAsTouched();
      this.memoControl.updateValueAndValidity({ emitEvent: false });
    }
    this.dateIsOutsideReport = false;
  }

  private setOutOfDateRequirement(date: Date): void {
    this.coverageDate.set(date);
    this.memoControl.addValidators(Validators.requiredTrue);
    this.memoControl.markAsTouched();
    this.memoControl.markAsDirty();
    this.memoControl.updateValueAndValidity({ emitEvent: false });
    this.dateIsOutsideReport = true;
    if (!this.memoControl.value) {
      this.outOfDateDialogVisible.set(true);
    }
  }

  private isMemoDateWithinCoverage(date: Date, coverageFromDate: Date, coverageThroughDate: Date): boolean {
    return date >= coverageFromDate && date <= coverageThroughDate;
  }

  updateMemoItemWithDate(date: Date | null | undefined) {
    const coverageFromDate = this.coverageFromDate();
    const coverageThrough = this.coverageThroughDate();
    if (!this.transactionType()?.doMemoCodeDateCheck || !coverageFromDate || !coverageThrough) {
      return;
    }

    if (!date || this.isMemoDateWithinCoverage(date, coverageFromDate, coverageThrough)) {
      this.clearOutOfDateRequirement();
      return;
    }

    this.setOutOfDateRequirement(date);
  }
}
