import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { ConfirmationService, MessageService } from 'primeng/api';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { selectCashOnHand } from 'app/store/cash-on-hand.selectors';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { CashOnHand } from 'app/shared/interfaces/report.interface';
import { LabelUtils, PrimeOptions, StatesCodeLabels, CountryCodeLabels } from 'app/shared/utils/label.utils';
import { ValidateService } from 'app/shared/services/validate.service';
import { schema as f3xSchema } from 'fecfile-validate/fecfile_validate_js/dist/F3X';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { F3xSummaryService } from 'app/shared/services/f3x-summary.service';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { ApiService } from 'app/shared/services/api.service';
import { ReportService } from '../../../shared/services/report.service';

@Component({
  selector: 'app-submit-f3x-step2',
  templateUrl: './submit-f3x-step2.component.html',
})
export class SubmitF3xStep2Component implements OnInit, OnDestroy {
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
  stateOptions: PrimeOptions = [];
  countryOptions: PrimeOptions = [];
  formSubmitted = false;
  destroy$: Subject<boolean> = new Subject<boolean>();
  committeeAccount$: Observable<CommitteeAccount> = this.store.select(selectCommitteeAccount);
  form: FormGroup = this.fb.group(this.validateService.getFormGroupFields(this.formProperties));
  loading: 0 | 1 | 2 = 0;
  cashOnHand: CashOnHand = {
    report_id: undefined,
    value: undefined,
  };

  constructor(
    public router: Router,
    private f3xSummaryService: F3xSummaryService,
    private validateService: ValidateService,
    private fb: FormBuilder,
    private store: Store,
    private messageService: MessageService,
    protected confirmationService: ConfirmationService,
    private apiService: ApiService,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.stateOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);
    this.countryOptions = LabelUtils.getPrimeOptions(CountryCodeLabels);

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
    this.validateService.formValidatorSchema = f3xSchema;
    this.validateService.formValidatorForm = this.form;
    this.form.controls['filing_password'].addValidators(this.validateService.passwordValidator());
    this.form.controls['truth_statement'].addValidators(Validators.requiredTrue);
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
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
        this.onConfirm();
      },
    });
  }

  public onConfirm() {
    if (this.treasurerNameChanged()) {
      this.saveTreasurerName().subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Report Updated',
          life: 3000,
        });

        this.submitReport();
      });
    } else {
      this.submitReport();
    }
  }

  private saveTreasurerName() {
    this.loading = 1;
    const payload: F3xSummary = F3xSummary.fromJSON({
      ...this.report,
      ...this.validateService.getFormValues(this.form, this.formProperties),
    });

    return this.f3xSummaryService.update(payload, this.formProperties);
  }

  private submitReport(): void {
    this.loading = 2;

    const payload = {
      report_id: this.report?.id,
      password: this.form?.value['filing_password'],
    };

    this.apiService.post('/web-services/submit-to-fec/', payload).subscribe(() => {
      if (this.report?.id) {
        this.reportService.setActiveReportById(this.report.id).pipe(takeUntil(this.destroy$)).subscribe();
        this.router.navigateByUrl(`/reports/f3x/submit/status/${this.report.id}`);
      } else {
        this.router.navigateByUrl('/reports');
      }
    });
  }
}
