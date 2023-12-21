import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { Report } from 'app/shared/models/report.model';
import { ApiService } from 'app/shared/services/api.service';
import { ReportService } from 'app/shared/services/report.service';
import { CountryCodeLabels, LabelUtils, PrimeOptions, StatesCodeLabels } from 'app/shared/utils/label.utils';
import { ValidateUtils } from 'app/shared/utils/validate.utils';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { MessageService } from 'primeng/api';
import { combineLatest, takeUntil } from 'rxjs';

@Component({
  selector: 'app-submit-report-step1',
  templateUrl: './submit-report-step1.component.html',
})
export class SubmitReportStep1Component extends DestroyerComponent implements OnInit {
  formProperties: string[] = [
    'confirmation_email_1',
    'confirmation_email_2',
    'change_of_address',
    'street_1',
    'street_2',
    'city',
    'state',
    'zip',
  ];
  report?: Report;
  stateOptions: PrimeOptions = [];
  countryOptions: PrimeOptions = [];
  formSubmitted = false;
  form: FormGroup = this.fb.group(ValidateUtils.getFormGroupFields(this.formProperties));
  getBackUrl?: (report?: Report) => string;
  getContinueUrl?: (report?: Report) => string;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private reportService: ReportService,
    private fb: FormBuilder,
    private store: Store,
    private messageService: MessageService,
    private apiService: ApiService
  ) {
    super();
  }

  ngOnInit(): void {
    this.stateOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);
    this.countryOptions = LabelUtils.getPrimeOptions(CountryCodeLabels);
    const activeReport$ = this.store.select(selectActiveReport).pipe(takeUntil(this.destroy$));
    const committeeAccount$ = this.store.select(selectCommitteeAccount).pipe(takeUntil(this.destroy$));
    combineLatest([activeReport$, committeeAccount$]).subscribe(([activeReport, committeeAccount]) => {
      this.report = activeReport;
      ValidateUtils.addJsonSchemaValidators(this.form, this.report.schema, false);
      this.initializeFormWithReport(this.report, committeeAccount);
    });

    // Initialize validation tracking of current JSON schema and form data
    this.form.controls['confirmation_email_1'].addValidators([
      Validators.required,
      Validators.maxLength(44),
      this.buildEmailValidator('confirmation_email_1'),
    ]);
    this.form.controls['confirmation_email_2'].addValidators([
      Validators.maxLength(44),
      this.buildEmailValidator('confirmation_email_2'),
    ]);
    this.route.data.subscribe(({ getBackUrl, getContinueUrl }) => {
      this.getBackUrl = getBackUrl;
      this.getContinueUrl = getContinueUrl;
    });
  }

  initializeFormWithReport(report: Report, committeeAccount: CommitteeAccount) {
    this.form.patchValue({
      change_of_address: false,
      confirmation_email_1: committeeAccount?.email,
      confirmation_email_2: undefined,
    });
    this.form.patchValue(committeeAccount);
    if (report && (report as any)['confirmation_email_1']) {
      this.form.patchValue(report);
    }
  }

  public buildEmailValidator(valueFormControlName: string): ValidatorFn {
    return (): ValidationErrors | null => {
      const email: string = this.form?.get(valueFormControlName)?.value;

      if (this.checkInvalidEmail(email)) {
        return { email: 'invalid' };
      }

      if (this.checkIdenticalEmails()) {
        return { email: 'identical' };
      }

      return null;
    };
  }

  public checkInvalidEmail(email: string): boolean {
    const matches = email?.match(/^\S+@\S+\.\S{2,}/g);
    if (!email || email.length == 0) return false; //An empty email should be caught by the required validator

    return matches === null || matches.length == 0;
  }

  public checkIdenticalEmails(): boolean {
    const email_1 = this.form?.get('confirmation_email_1')?.value;
    const email_2 = this.form?.get('confirmation_email_2')?.value;

    return !!email_1 && email_1 === email_2;
  }

  public continue(): void {
    this.formSubmitted = true;
    if (this.form.invalid || this.report == undefined) {
      return;
    }
    let addressFields = {};
    if (this.form.value.change_of_address) {
      addressFields = {
        ...ValidateUtils.getFormValues(this.form, this.report?.schema, this.formProperties),
      };
    }

    const payload: Report = this.report.getFromJSON()({
      ...this.report,
      ...addressFields,
      change_of_address: this.form.value.change_of_address,
      confirmation_email_1: this.form.value.confirmation_email_1,
      confirmation_email_2: this.form.value.confirmation_email_2,
    });

    this.reportService.update(payload, true, this.formProperties).subscribe(() => {
      if (this.report?.id) {
        this.router.navigateByUrl(this.getContinueUrl?.(this.report) ?? '');
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
