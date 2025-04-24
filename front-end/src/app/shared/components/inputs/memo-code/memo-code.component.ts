import { Component, computed, effect, inject, input } from '@angular/core';
import { Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Form3X } from 'app/shared/models/form-3x.model';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { TransactionFormUtils } from '../../transaction-type-base/transaction-form.utils';
import { BaseTransactionInputComponent } from '../base-input.component';
import { ReportTypes } from 'app/shared/models/report.model';
import { CheckboxModule } from 'primeng/checkbox';
import { Tooltip } from 'primeng/tooltip';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { SelectButton } from 'primeng/selectbutton';
import { Dialog } from 'primeng/dialog';
import { ButtonDirective } from 'primeng/button';
import { FecDatePipe } from '../../../pipes/fec-date.pipe';
import { effectOnceIf } from 'ngxtension/effect-once-if';

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
export class MemoCodeInputComponent extends BaseTransactionInputComponent {
  private readonly store = inject(Store);
  readonly overrideMemoItemHelpText = input<string>();
  readonly checkboxLabel = input('');

  readonly memoItemHelpText = computed(() => {
    if (this.overrideMemoItemHelpText()) return this.overrideMemoItemHelpText();
    return 'The dollar amount in a memo item is not incorporated into the total figures for the schedule.';
  });
  readonly memoCodeReadOnly = computed(() => TransactionFormUtils.isMemoCodeReadOnly(this.transactionType()));
  readonly coverageDate = computed(() => {
    const date2Control = this.date2Control();
    if (date2Control) return (date2Control.valueChangeSignal() as Date) ?? new Date();
    return (this.dateControl()?.valueChangeSignal() as Date) ?? new Date();
  });
  coverageDateQuestion = 'Did you mean to date this transaction outside of the report coverage period?';
  readonly reportTypes = ReportTypes;

  dateIsOutsideReport = false; // True if transaction date is outside the report dates
  readonly activeReport = this.store.selectSignal(selectActiveReport);
  readonly report = computed(() => this.activeReport() as Form3X);
  readonly coverageFrom = computed(() => this.report().coverage_from_date);
  readonly coverageThrough = computed(() => this.report().coverage_through_date);

  readonly memoControl = computed(() => this.getControl(this.templateMap().memo_code));
  outOfDateDialogVisible = false;
  readonly memoCodeMapOptions = computed(() => {
    const memoCodeMap = this.transactionType().memoCodeMap;
    if (!memoCodeMap) return [];
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
  });

  readonly dateControl = computed(() => this.getControl(this.templateMap().date));
  readonly date2Control = computed(() => this.getControl(this.templateMap().date2));

  constructor() {
    super();
    effectOnceIf(
      () => this.dateControl(),
      () => {
        const dateControl = this.dateControl()!;
        const savedDate: Date | null = dateControl.value as Date | null;
        if (savedDate) {
          this.updateMemoItemWithDate(savedDate);
        }
      },
    );
    effect(() => {
      const date = this.dateControl()?.valueChangeSignal();
      this.updateMemoItemWithDate(date);
    });

    effectOnceIf(
      () => this.transactionType()?.memoCodeTransactionTypes && this.memoControl(),
      () => {
        this.updateTransactionTypeIdentifier();
        effect(
          () => {
            this.memoControl()!.valueChangeSignal();
            this.updateTransactionTypeIdentifier();
          },
          { injector: this.injector },
        );
      },
    );
  }

  private updateTransactionTypeIdentifier(): void {
    if (this.transactionType()?.memoCodeTransactionTypes) {
      const memo_code = this.memoControl()!.value as boolean;
      if (memo_code) {
        this.transaction().transaction_type_identifier =
          this.transaction().transactionType.memoCodeTransactionTypes!.true;
      } else {
        this.transaction().transaction_type_identifier =
          this.transaction().transactionType.memoCodeTransactionTypes!.false;
      }
    }
  }

  closeOutOfDateDialog() {
    this.outOfDateDialogVisible = false;
  }

  onMemoItemClick() {
    if (!this.memoCodeReadOnly && this.dateIsOutsideReport && !this.memoControl()?.value) {
      this.outOfDateDialogVisible = true;
    }
  }

  updateMemoItemWithDate(date: Date) {
    const coverageFrom = this.coverageFrom();
    const coverageThrough = this.coverageThrough();
    const memoControl = this.memoControl();
    if (this.transactionType()?.doMemoCodeDateCheck && coverageFrom && coverageThrough && memoControl) {
      if (
        date &&
        !memoControl.hasValidator(Validators.requiredTrue) &&
        (date < coverageFrom || date > coverageThrough)
      ) {
        memoControl.addValidators(Validators.requiredTrue);
        memoControl.markAsTouched();
        memoControl.markAsDirty();
        memoControl.updateValueAndValidity();
        this.dateIsOutsideReport = true;
        if (!memoControl.value) {
          this.outOfDateDialogVisible = true;
        }
      } else {
        if (this.dateIsOutsideReport && memoControl.hasValidator(Validators.requiredTrue)) {
          memoControl.removeValidators([Validators.requiredTrue]);
          memoControl.markAsTouched();
          memoControl.updateValueAndValidity();
        }
        this.dateIsOutsideReport = false;
      }
    }
  }
}
