import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { F3xSummaryService } from 'app/shared/services/f3x-summary.service';
import { ValidateUtils } from 'app/shared/utils/validate.utils';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { setCashOnHandAction } from 'app/store/cash-on-hand.actions';
import { schema as f3xSchema } from 'fecfile-validate/fecfile_validate_js/dist/F3X';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-cash-on-hand',
  templateUrl: './cash-on-hand.component.html',
})
export class CashOnHandComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  formProperties: string[] = ['L6a_cash_on_hand_jan_1_ytd', 'cash_on_hand_date'];
  report: F3xSummary | undefined;
  formSubmitted = false;
  form: FormGroup = this.fb.group(ValidateUtils.getFormGroupFields(this.formProperties));

  constructor(
    public router: Router,
    private f3xSummaryService: F3xSummaryService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => (this.report = report as F3xSummary));

    // Initialize validation tracking of current JSON schema and form data
    this.form.controls['L6a_cash_on_hand_jan_1_ytd'].addValidators([Validators.required]);
    this.form.controls['cash_on_hand_date'].addValidators([Validators.required]);

    // Set form default values
    this.form.patchValue({ ...this.report });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public save(): void {
    this.formSubmitted = true;

    if (this.form.invalid) {
      return;
    }

    const payload: F3xSummary = F3xSummary.fromJSON({
      ...this.report,
      ...ValidateUtils.getFormValues(this.form, this.formProperties, f3xSchema),
      ...{
        cash_on_hand_date: this.form.controls['cash_on_hand_date'].value,
        L6a_year_for_above_ytd: String(this.form.controls['cash_on_hand_date'].value.getYear() + 1900),
      },
    });

    this.f3xSummaryService.update(payload, this.formProperties).subscribe(() => {
      // Write cash on hand to store
      this.store.dispatch(
        setCashOnHandAction({
          payload: {
            report_id: payload.id,
            value: payload.L6a_cash_on_hand_jan_1_ytd,
          },
        })
      );

      if (this.report) {
        this.router.navigateByUrl(`/transactions/report/${this.report.id}/list`);
      }

      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Report Updated',
        life: 3000,
      });
    });
  }
}
