import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { Report } from 'app/shared/models/report.model';
import { getReportFromJSON, ReportService } from 'app/shared/services/report.service';
import { blurActiveInput } from 'app/shared/utils/form.utils';
import { CountryCodeLabels, LabelUtils, PrimeOptions, StatesCodeLabels } from 'app/shared/utils/label.utils';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { buildGuaranteeUniqueValuesValidator, emailValidator } from 'app/shared/utils/validators.utils';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { singleClickEnableAction } from 'app/store/single-click.actions';
import { MessageService } from 'primeng/api';
import { combineLatest, takeUntil } from 'rxjs';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../shared/components/error-messages/error-messages.component';
import { RadioButton } from 'primeng/radiobutton';
import { Select } from 'primeng/select';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { SingleClickDirective } from '../../shared/directives/single-click.directive';

@Component({
  selector: 'app-submit-report-step1',
  templateUrl: './submit-report-step1.component.html',
  styleUrls: ['./submit-report-step1.component.scss'],
  imports: [
    Card,
    ReactiveFormsModule,
    InputText,
    ErrorMessagesComponent,
    FormsModule,
    RadioButton,
    Select,
    ButtonDirective,
    Ripple,
    SingleClickDirective,
  ],
})
export class SubmitReportStep1Component extends DestroyerComponent implements OnInit {
  public readonly router = inject(Router);
  public readonly route = inject(ActivatedRoute);
  private readonly reportService = inject(ReportService);
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly messageService = inject(MessageService);
  readonly formProperties: string[] = [
    'confirmation_email_1',
    'confirmation_email_2',
    'change_of_address',
    'street_1',
    'street_2',
    'city',
    'state',
    'zip',
  ];
  ingredient?: string;
  report?: Report;
  stateOptions: PrimeOptions = [];
  countryOptions: PrimeOptions = [];
  formSubmitted = false;
  form: FormGroup = this.fb.group(SchemaUtils.getFormGroupFieldsNoBlur(this.formProperties), {
    updateOn: 'blur',
  });
  getBackUrl?: (report?: Report) => string;
  getContinueUrl?: (report?: Report) => string;

  ngOnInit(): void {
    this.stateOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);
    this.countryOptions = LabelUtils.getPrimeOptions(CountryCodeLabels);
    const activeReport$ = this.store.select(selectActiveReport).pipe(takeUntil(this.destroy$));
    const committeeAccount$ = this.store.select(selectCommitteeAccount).pipe(takeUntil(this.destroy$));
    combineLatest([activeReport$, committeeAccount$]).subscribe(([activeReport, committeeAccount]) => {
      this.report = activeReport;
      SchemaUtils.addJsonSchemaValidators(this.form, this.report.schema, false);
      this.initializeFormWithReport(this.report, committeeAccount);
    });

    // Initialize validation tracking of current JSON schema and form data
    this.form.controls['confirmation_email_1'].addValidators([
      Validators.required,
      Validators.maxLength(44),
      emailValidator,
      buildGuaranteeUniqueValuesValidator(this.form, 'confirmation_email_1', ['confirmation_email_2'], 'email'),
    ]);
    this.form.controls['confirmation_email_2'].addValidators([
      Validators.maxLength(44),
      emailValidator,
      buildGuaranteeUniqueValuesValidator(this.form, 'confirmation_email_2', ['confirmation_email_1'], 'email'),
    ]);
    this.route.data.subscribe(({ getBackUrl, getContinueUrl }) => {
      this.getBackUrl = getBackUrl;
      this.getContinueUrl = getContinueUrl;
    });
  }

  initializeFormWithReport(report: Report, committeeAccount: CommitteeAccount) {
    const emails = (committeeAccount?.email || '').split(/[;,]+/);
    this.form.patchValue({
      change_of_address: false,
      confirmation_email_1: emails[0],
      confirmation_email_2: emails[1],
      ...committeeAccount,
    });
    if (report && report['confirmation_email_1']) {
      this.form.patchValue(report);
    }
  }

  public async continue(): Promise<void> {
    this.formSubmitted = true;
    blurActiveInput(this.form);
    if (this.form.invalid || this.report == undefined) {
      this.store.dispatch(singleClickEnableAction());
      return;
    }
    let addressFields = {};
    if (this.form.value.change_of_address) {
      addressFields = {
        ...SchemaUtils.getFormValues(this.form, this.report?.schema, this.formProperties),
      };
    }

    const payload: Report = getReportFromJSON({
      ...this.report,
      ...addressFields,
      change_of_address: this.form.value.change_of_address,
      confirmation_email_1: this.form.value.confirmation_email_1,
      confirmation_email_2: this.form.value.confirmation_email_2,
    });

    this.reportService.update(payload, this.formProperties).then(() => {
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
