import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormComponent } from 'app/shared/components/app-destroyer.component';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { Report } from 'app/shared/models/report.model';
import { getReportFromJSON, ReportService } from 'app/shared/services/report.service';
import { blurActiveInput, printFormErrors } from 'app/shared/utils/form.utils';
import { CountryCodeLabels, LabelUtils, PrimeOptions, StatesCodeLabels } from 'app/shared/utils/label.utils';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { buildGuaranteeUniqueValuesValidator, emailValidator } from 'app/shared/utils/validators.utils';
import { singleClickEnableAction } from 'app/store/single-click.actions';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InputText } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../shared/components/error-messages/error-messages.component';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { SearchableSelectComponent } from 'app/shared/components/searchable-select/searchable-select.component';
import { ApiService } from 'app/shared/services/api.service';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { takeUntil } from 'rxjs';
import { Tooltip } from 'primeng/tooltip';
import { Checkbox } from 'primeng/checkbox';
import { Password } from 'primeng/password';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Form3, Form3X } from 'app/shared/models';
import { injectRouteData } from 'ngxtension/inject-route-data';

@Component({
  selector: 'app-submit-report',
  templateUrl: './submit-report.component.html',
  styleUrls: ['./submit-report.component.scss'],
  imports: [
    ReactiveFormsModule,
    InputText,
    ErrorMessagesComponent,
    FormsModule,
    ButtonDirective,
    Ripple,
    SelectButtonModule,
    SearchableSelectComponent,
    Password,
    Checkbox,
    Tooltip,
    RouterLink,
  ],
})
export class SubmitReportComponent extends FormComponent implements OnInit {
  readonly router = inject(Router);
  readonly confirmationService = inject(ConfirmationService);
  readonly apiService = inject(ApiService);
  readonly reportService = inject(ReportService);
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
    'treasurer_first_name',
    'treasurer_last_name',
    'treasurer_middle_name',
    'treasurer_prefix',
    'treasurer_suffix',
    'filingPassword',
    'userCertified',
  ];

  loading: 0 | 1 | 2 = 0;
  readonly backdoorCodeHelpText =
    'This is only needed if you have amended or deleted <b>more than 50% of the activity</b> in the original report, or have <b>fixed an incorrect date range</b>.';
  showBackdoorCode = false;

  readonly stateOptions: PrimeOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);
  readonly countryOptions: PrimeOptions = LabelUtils.getPrimeOptions(CountryCodeLabels);
  readonly form: FormGroup = this.fb.group(SchemaUtils.getFormGroupFieldsNoBlur(this.formProperties), {
    updateOn: 'blur',
  });
  readonly changeOfAddressOptions = [
    { label: 'No', value: false },
    { label: 'Yes', value: true },
  ];
  readonly getBackUrl = injectRouteData<(report?: Report) => string | undefined | null>('getBackUrl');
  readonly getContinueUrl = injectRouteData<(report?: Report) => string | undefined | null>('getContinueUrl');
  readonly continueUrl = computed(() => this.getContinueUrl()?.(this.activeReport()) || '/reports/');
  readonly backUrl = computed(() => this.getBackUrl()?.(this.activeReport()) || '');

  constructor() {
    super();
    effect(() => {
      SchemaUtils.addJsonSchemaValidators(this.form, this.activeReport().schema, false);
      this.initializeFormWithReport(this.activeReport(), this.committeeAccount());
    });
  }

  ngOnInit(): void {
    // Initialize validation tracking of current JSON schema and form data
    // STEP 1
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

    // STEP 2
    this.form.addControl('backdoorYesNo', new SubscriptionFormControl<string | null>(null, { updateOn: 'change' }));

    // Initialize validation tracking of current JSON schema and form data
    this.form.controls['filingPassword'].addValidators(Validators.required);
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
  }

  initializeFormWithReport(report: Report, committeeAccount: CommitteeAccount) {
    // STEP 1
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

    // STEP 2
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

  async submitClicked(): Promise<void> {
    this.formSubmitted = true;
    blurActiveInput(this.form);
    if (this.form.invalid) printFormErrors(this.form);
    if (this.form.invalid || this.activeReport() == undefined) {
      this.store.dispatch(singleClickEnableAction());
      return;
    }

    this.confirmationService.confirm({
      message: this.activeReport().submitAlertText,
      header: 'Are you sure?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.saveAndSubmit();
      },
    });
  }

  async saveAndSubmit(): Promise<boolean> {
    await this.updateReport();
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Report Updated',
      life: 3000,
    });

    return this.submitReport();
  }

  async updateReport(): Promise<Report | undefined> {
    this.loading = 1;
    const payload = getReportFromJSON({
      ...this.activeReport(),
      ...SchemaUtils.getFormValues(this.form, this.activeReport().schema, this.formProperties),
    });

    if (payload instanceof Form3X || payload instanceof Form3) {
      if (this.form.controls['change_of_address']) {
        payload.change_of_address = this.form.value.change_of_address;
        payload.confirmation_email_1 = this.form.value.confirmation_email_1;
        payload.confirmation_email_2 = this.form.value.confirmation_email_2;
      }
      payload.qualified_committee = this.committeeAccount().qualified;
      payload.committee_name = this.committeeAccount().name;
      payload.street_1 = this.committeeAccount().street_1;
      payload.street_2 = this.committeeAccount().street_2;
      payload.city = this.committeeAccount().city;
      payload.state = this.committeeAccount().state;
      payload.zip = this.committeeAccount().zip;
    }

    return this.reportService.update(payload, this.formProperties);
  }

  async submitReport(): Promise<boolean> {
    this.loading = 2;

    const payload = {
      report_id: this.activeReport().id,
      password: this.form?.value['filingPassword'],
      backdoor_code: this.form?.value['backdoor_code'],
    };
    await this.apiService.post('/web-services/submit-to-fec/', payload);
    this.loading = 0;
    return this.router.navigateByUrl(this.continueUrl());
  }
}
