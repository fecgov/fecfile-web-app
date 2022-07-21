import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { refreshCommitteeAccountDetailsAction } from '../../../store/committee-account.actions';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { LabelUtils, PrimeOptions, StatesCodeLabels, CountryCodeLabels } from 'app/shared/utils/label.utils';
import { ValidateService } from 'app/shared/services/validate.service';
import { schema as f3xSchema } from 'fecfile-validate/fecfile_validate_js/dist/F3X';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { F3xSummaryService } from 'app/shared/services/f3x-summary.service';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { ReportCodeLabelList } from '../../../shared/utils/reportCodeLabels.utils';
import { updateLabelLookupAction } from '../../../store/label-lookup.actions';
import { selectReportCodeLabelList } from 'app/store/label-lookup.selectors';
import { f3xReportCodeDetailedLabels } from '../../../shared/utils/label.utils';

@Component({
  selector: 'app-submit-f3x-step2',
  templateUrl: './submit-f3x-step2.component.html',
  styleUrls: ['./submit-f3x-step2.component.scss'],
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
  report: F3xSummary | undefined;
  report_code = '';
  stateOptions: PrimeOptions = [];
  countryOptions: PrimeOptions = [];
  formSubmitted = false;
  destroy$: Subject<boolean> = new Subject<boolean>();
  committeeAccount$: Observable<CommitteeAccount> = this.store.select(selectCommitteeAccount);
  reportCodeLabelList$: Observable<ReportCodeLabelList> = new Observable<ReportCodeLabelList>();
  form: FormGroup = this.fb.group(this.validateService.getFormGroupFields(this.formProperties));
  f3xReportCodeDetailedLabels = f3xReportCodeDetailedLabels;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private f3xSummaryService: F3xSummaryService,
    private validateService: ValidateService,
    private fb: FormBuilder,
    private store: Store,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // Refresh committee account details whenever page loads
    this.store.dispatch(refreshCommitteeAccountDetailsAction());
    this.stateOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);
    this.countryOptions = LabelUtils.getPrimeOptions(CountryCodeLabels);

    this.report = this.activatedRoute.snapshot.data['report'];
    if (this.report?.report_code) {
      if (this.report?.report_code?.length > 0) {
        this.report_code = this.report.report_code;
      }
    } else {
      this.report_code = '';
    }
    this.store
      .select(selectCommitteeAccount)
      .pipe(takeUntil(this.destroy$))
      .subscribe((committeeAccount) => this.setDefaultFormValues(committeeAccount));

    this.reportCodeLabelList$ = this.store.select<ReportCodeLabelList>(selectReportCodeLabelList);
    this.store.dispatch(updateLabelLookupAction());

    // Initialize validation tracking of current JSON schema and form data
    this.validateService.formValidatorSchema = f3xSchema;
    this.validateService.formValidatorForm = this.form;
    this.form.controls['filing_password'].addValidators(Validators.required);
    this.form.controls['truth_statement'].addValidators(Validators.requiredTrue);
  }

  setDefaultFormValues(committeeAccount: CommitteeAccount) {
    this.form.patchValue({
      treasurer_last_name: this.report?.treasurer_last_name
        ? this.report.treasurer_last_name
        : committeeAccount?.treasurer_name_2,
      treasurer_first_name: this.report?.treasurer_first_name
        ? this.report.treasurer_first_name
        : committeeAccount?.treasurer_name_1,
      treasurer_middle_name: this.report?.treasurer_middle_name
        ? this.report.treasurer_middle_name
        : committeeAccount?.treasurer_name_middle,
      treasurer_prefix: this.report?.treasurer_prefix
        ? this.report.treasurer_prefix
        : committeeAccount?.treasurer_name_prefix,
      treasurer_suffix: this.report?.treasurer_suffix
        ? this.report.treasurer_suffix
        : committeeAccount?.treasurer_name_suffix,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public save(jump: 'continue' | 'back' | null = null): void {
    this.formSubmitted = true;

    if (jump === 'back' && this.report?.id) {
      this.router.navigateByUrl('/reports');
      return;
    }

    if (this.form.invalid) {
      return;
    }

    const payload: F3xSummary = F3xSummary.fromJSON({
      ...this.report,
      ...this.validateService.getFormValues(this.form, this.formProperties),
    });

    this.f3xSummaryService.update(payload, this.formProperties).subscribe(() => {
      if (jump === 'continue' && this.report?.id) {
        this.router.navigateByUrl(`/reports/f3x/submit/status/${this.report.id}`);
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
