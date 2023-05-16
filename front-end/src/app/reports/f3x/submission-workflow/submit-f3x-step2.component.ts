import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, takeUntil, from, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CashOnHand } from 'app/shared/interfaces/report.interface';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { ApiService } from 'app/shared/services/api.service';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { F3xSummaryService } from 'app/shared/services/f3x-summary.service';
import { ValidateUtils } from 'app/shared/utils/validate.utils';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { selectCashOnHand } from 'app/store/cash-on-hand.selectors';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { schema as f3xSchema } from 'fecfile-validate/fecfile_validate_js/dist/F3X';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ReportService } from '../../../shared/services/report.service';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';

@Component({
  selector: 'app-submit-f3x-step2',
  templateUrl: './submit-f3x-step2.component.html',
})
export class SubmitF3xStep2Component extends DestroyerComponent implements OnInit {
  formProperties: string[] = [
    'treasurer_first_name',
    'treasurer_last_name',
    'treasurer_middle_name',
    'treasurer_prefix',
    'treasurer_suffix',
    'filing_password',
    'truth_statement',
  ];
  report?: F3xSummary;
  formSubmitted = false;
  committeeAccount$: Observable<CommitteeAccount> = this.store.select(selectCommitteeAccount);
  form: FormGroup = this.fb.group(ValidateUtils.getFormGroupFields(this.formProperties));
  loading: 0 | 1 | 2 = 0;
  cashOnHand: CashOnHand = {
    report_id: undefined,
    value: undefined,
  };

  constructor(
    public router: Router,
    private f3xSummaryService: F3xSummaryService,
    private fb: FormBuilder,
    private store: Store,
    private messageService: MessageService,
    protected confirmationService: ConfirmationService,
    private apiService: ApiService,
    private reportService: ReportService
  ) {
    super();
  }

  ngOnInit(): void {
    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => {
        this.report = report as F3xSummary;
      });
    this.store
      .select(selectCommitteeAccount)
      .pipe(takeUntil(this.destroy$))
      .subscribe((committeeAccount) => this.setDefaultFormValues(committeeAccount));
    this.store
      .select(selectCashOnHand)
      .pipe(takeUntil(this.destroy$))
      .subscribe((cashOnHand: CashOnHand) => (this.cashOnHand = cashOnHand));

    // Initialize validation tracking of current JSON schema and form data
    this.form.controls['filing_password'].addValidators(ValidateUtils.passwordValidator());
    this.form.controls['truth_statement'].addValidators(Validators.requiredTrue);

    ValidateUtils.addJsonSchemaValidators(this.form, f3xSchema, false);
  }

  setDefaultFormValues(committeeAccount: CommitteeAccount) {
    //If the report provided them, take the remaining fields from the report
    if (this.report?.treasurer_last_name && this.report?.treasurer_first_name) {
      this.form.patchValue({
        treasurer_first_name: this.report.treasurer_first_name,
        treasurer_last_name: this.report.treasurer_last_name,
        treasurer_middle_name: this.report.treasurer_middle_name,
        treasurer_prefix: this.report.treasurer_prefix,
        treasurer_suffix: this.report.treasurer_suffix,
      });
    } else {
      //Else, take them from the Committee Account
      this.form.patchValue({
        treasurer_first_name: committeeAccount?.treasurer_name_1,
        treasurer_last_name: committeeAccount?.treasurer_name_2,
        treasurer_middle_name: committeeAccount?.treasurer_name_middle,
        treasurer_prefix: committeeAccount?.treasurer_name_prefix,
        treasurer_suffix: committeeAccount?.treasurer_name_suffix,
      });
    }
  }

  /**
   * Checks whether or not the form's treasurer name is different from the report's.
   * This is used to determine whether or not the report needs to be updated before
   * being submitted to the FEC.
   *
   * @returns a boolean
   */
  public treasurerNameChanged(): boolean {
    if (!this.report || !this.form) return true;

    return (
      this.form.value['treasurer_last_name'] != this.report.treasurer_last_name ||
      this.form.value['treasurer_first_name'] != this.report.treasurer_first_name ||
      this.form.value['treasurer_middle_name'] != this.report.treasurer_middle_name ||
      this.form.value['treasurer_prefix'] != this.report.treasurer_prefix ||
      this.form.value['treasurer_suffix'] != this.report.treasurer_suffix
    );
  }

  public submit(): void {
    this.formSubmitted = true;

    if (this.form.invalid) {
      return;
    }

    this.confirmationService.confirm({
      message:
        'Are you sure you want to submit this form electronically? Please note that you cannot undo this action. Any changes needed will need to be filed as an amended report.',
      header: 'Are you sure?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.onConfirm().subscribe();
      },
    });
  }

  public onConfirm(): Observable<boolean> {
    if (this.treasurerNameChanged()) {
      return this.saveTreasurerName().pipe(
        switchMap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Report Updated',
            life: 3000,
          });

          return this.submitReport();
        })
      );
    } else {
      return this.submitReport();
    }
  }

  private saveTreasurerName() {
    this.loading = 1;
    const payload: F3xSummary = F3xSummary.fromJSON({
      ...this.report,
      ...ValidateUtils.getFormValues(this.form, f3xSchema, this.formProperties),
    });

    return this.f3xSummaryService.update(payload, this.formProperties);
  }

  private submitReport(): Observable<boolean> {
    this.loading = 2;

    const payload = {
      report_id: this.report?.id,
      password: this.form?.value['filing_password'],
    };
    return this.apiService.post('/web-services/submit-to-fec/', payload).pipe(
      switchMap(() => {
        if (this.report?.id) {
          this.reportService.setActiveReportById(this.report.id).pipe(takeUntil(this.destroy$)).subscribe();
          return from(this.router.navigateByUrl(`/reports/f3x/submit/status/${this.report.id}`));
        } else {
          return from(this.router.navigateByUrl('/reports'));
        }
      })
    );
  }
}
