import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { Form3X } from 'app/shared/models/form-3x.model';
import { Report } from 'app/shared/models/report.model';
import { ApiService } from 'app/shared/services/api.service';
import { getReportFromJSON, ReportService } from 'app/shared/services/report.service';
import { blurActiveInput } from 'app/shared/utils/form.utils';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { passwordValidator } from 'app/shared/utils/validators.utils';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { ConfirmationService, MessageService } from 'primeng/api';
import { combineLatest, firstValueFrom, takeUntil } from 'rxjs';

@Component({
  selector: 'app-submit-report-step2',
  templateUrl: './submit-report-step2.component.html',
  styleUrls: ['../../styles.scss', './submit-report-step2.component.scss'],
})
export class SubmitReportStep2Component extends DestroyerComponent implements OnInit {
  formProperties: string[] = [
    'treasurer_first_name',
    'treasurer_last_name',
    'treasurer_middle_name',
    'treasurer_prefix',
    'treasurer_suffix',
    'filingPassword',
    'userCertified',
  ];
  report?: Report;
  formSubmitted = false;
  form: FormGroup = this.fb.group(SchemaUtils.getFormGroupFieldsNoBlur(this.formProperties), {
    updateOn: 'blur',
  });
  loading: 0 | 1 | 2 = 0;
  backdoorCodeHelpText =
    'This is only needed if you have amended or deleted <b>more than 50% of the activity</b> in the original report, or have <b>fixed an incorrect date range</b>.';
  showBackdoorCode = false;
  getBackUrl?: (report?: Report) => string;
  getContinueUrl?: (report?: Report) => string;
  committeeAccount?: CommitteeAccount;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private fb: FormBuilder,
    private store: Store,
    private messageService: MessageService,
    public confirmationService: ConfirmationService,
    public apiService: ApiService,
    public reportService: ReportService,
  ) {
    super();
  }

  ngOnInit(): void {
    const activeReport$ = this.store.select(selectActiveReport).pipe(takeUntil(this.destroy$));
    const committeeAccount$ = this.store.select(selectCommitteeAccount).pipe(takeUntil(this.destroy$));
    combineLatest([activeReport$, committeeAccount$]).subscribe(([activeReport, committeeAccount]) => {
      this.report = activeReport;
      this.committeeAccount = committeeAccount;
      SchemaUtils.addJsonSchemaValidators(this.form, this.report.schema, false);
      this.initializeFormWithReport(this.report, committeeAccount);
    });

    this.form.addControl('backdoorYesNo', new SubscriptionFormControl());

    // Initialize validation tracking of current JSON schema and form data
    this.form.controls['filingPassword'].addValidators(passwordValidator);
    this.form.controls['userCertified'].addValidators(Validators.requiredTrue);
    this.form
      .get('backdoorYesNo')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.showBackdoorCode = value;
        if (value) {
          this.form.addControl(
            'backdoor_code',
            new SubscriptionFormControl('', [Validators.required, Validators.maxLength(16)]),
          );
        } else {
          this.form.removeControl('backdoor_code');
        }
      });
    this.route.data.subscribe(({ getBackUrl, getContinueUrl }) => {
      this.getBackUrl = getBackUrl;
      this.getContinueUrl = getContinueUrl;
    });
  }

  initializeFormWithReport(report: Report, committeeAccount: CommitteeAccount) {
    this.form.patchValue({
      treasurer_first_name: committeeAccount?.treasurer_name_1,
      treasurer_last_name: committeeAccount?.treasurer_name_2,
      treasurer_middle_name: committeeAccount?.treasurer_name_middle,
      treasurer_prefix: committeeAccount?.treasurer_name_prefix,
      treasurer_suffix: committeeAccount?.treasurer_name_suffix,
    });
    if (report && report['treasurer_last_name' as keyof Report]) {
      this.form.patchValue(report);
    }
  }

  submitClicked(): void {
    this.formSubmitted = true;
    blurActiveInput(this.form);
    if (this.form.invalid) {
      return;
    }

    this.confirmationService.confirm({
      message: this.report?.submitAlertText,
      header: 'Are you sure?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.saveAndSubmit();
      },
    });
  }

  async saveAndSubmit(): Promise<boolean> {
    await this.saveTreasurerName();
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Report Updated',
      life: 3000,
    });

    return this.submitReport();
  }

  async saveTreasurerName(): Promise<Report | undefined> {
    if (!this.report) return undefined;
    this.loading = 1;
    const payload: Report = getReportFromJSON({
      ...this.report,
      ...SchemaUtils.getFormValues(this.form, this.report.schema, this.formProperties),
    });
    if (payload instanceof Form3X) {
      payload.qualified_committee = this.committeeAccount?.qualified;
      payload.committee_name = this.committeeAccount?.name;
      payload.street_1 = this.committeeAccount?.street_1;
      payload.street_2 = this.committeeAccount?.street_2;
      payload.city = this.committeeAccount?.city;
      payload.state = this.committeeAccount?.state;
      payload.zip = this.committeeAccount?.zip;
    }

    return firstValueFrom(this.reportService.update(payload, this.formProperties));
  }

  async submitReport(): Promise<boolean> {
    this.loading = 2;

    const payload = {
      report_id: this.report?.id,
      password: this.form?.value['filingPassword'],
      backdoor_code: this.form?.value['backdoor_code'],
    };
    await firstValueFrom(this.apiService.post('/web-services/submit-to-fec/', payload));
    this.loading = 0;
    return this.router.navigateByUrl(this.getContinueUrl?.(this.report) || '/reports/');
  }
}
