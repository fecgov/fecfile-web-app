import { HttpStatusCode } from '@angular/common/http';
import { AfterViewInit, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormComponent } from 'app/shared/components/app-destroyer.component';
import { CalendarComponent } from 'app/shared/components/calendar/calendar.component';
import { ErrorMessagesComponent } from 'app/shared/components/error-messages/error-messages.component';
import { SaveCancelComponent } from 'app/shared/components/save-cancel/save-cancel.component';
import { CoverageDates, F3xFormTypes, Form3X } from 'app/shared/models';
import { Report } from 'app/shared/models/report.model';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { blurActiveInput } from 'app/shared/utils/form.utils';
import { LabelUtils, PrimeOptions, StatesCodeLabels } from 'app/shared/utils/label.utils';
import {
  electionReportCodes,
  getCoverageDatesFunction,
  monthlyElectionYearReportCodes,
  monthlyNonElectionYearReportCodes,
  quarterlyElectionYearReportCodes,
  quarterlyNonElectionYearReportCodes,
  ReportCodes,
} from 'app/shared/utils/report-code.utils';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { buildAfterDateValidator, buildNonOverlappingCoverageValidator } from 'app/shared/utils/validators.utils';
import { environment } from 'environments/environment';
import { schema as f3xSchema } from 'fecfile-validate/fecfile_validate_js/dist/F3X';
import { MessageService } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { Ripple } from 'primeng/ripple';
import { Select } from 'primeng/select';
import { SelectButton } from 'primeng/selectbutton';
import { TextareaModule } from 'primeng/textarea';
import { combineLatest, startWith } from 'rxjs';
import { singleClickEnableAction } from '../../../store/single-click.actions';
@Component({
  selector: 'app-create-f3x-step1',
  templateUrl: './create-f3x-step1.component.html',
  styleUrl: './create-f3x-step1.component.scss',
  imports: [
    ReactiveFormsModule,
    RadioButtonModule,
    SelectButton,
    ErrorMessagesComponent,
    CalendarComponent,
    Select,
    SaveCancelComponent,
    TextareaModule,
    Dialog,
    Ripple,
    ButtonDirective,
  ],
})
export class CreateF3XStep1Component extends FormComponent implements OnInit, AfterViewInit {
  private readonly form3XService = inject(Form3XService);
  private readonly messageService = inject(MessageService);
  protected readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  readonly formProperties: string[] = [
    'filing_frequency',
    'report_type_category',
    'report_code',
    'coverage_from_date',
    'coverage_through_date',
    'date_of_election',
    'state_of_election',
    'form_type',
  ];
  readonly userCanSetFilingFrequency: boolean = environment.userCanSetFilingFrequency;
  stateOptions: PrimeOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);
  form: FormGroup = this.fb.group(SchemaUtils.getFormGroupFieldsNoBlur(this.formProperties, f3xSchema), {
    updateOn: 'blur',
  });

  readonly F3xReportTypeCategories = F3xReportTypeCategories;
  public readonly existingCoverageSignal = signal<CoverageDates[] | undefined>(undefined);
  readonly thisYear = new Date().getFullYear();
  readonly usedReportCodes = computed(() => this.getUsedReportCodes());

  reportCodeLabelMap?: { [key in ReportCodes]: string };

  readonly reportTypeCategories = [F3xReportTypeCategories.ELECTION_YEAR, F3xReportTypeCategories.NON_ELECTION_YEAR];
  private readonly filingFrequencySignal = computed(() =>
    this.committeeAccountSignal().filing_frequency === 'M' ? 'M' : 'Q',
  );

  report?: Report;
  coverageDatesDialogVisible = false;

  constructor() {
    super();

    this.form3XService.getReportCodeLabelMap().then((map) => (this.reportCodeLabelMap = map));
    this.form3XService.getF3xCoverageDates().then((coverageDates) => this.existingCoverageSignal.set(coverageDates));

    this.addFilingFrequency();
    this.addReportTypeCategory();

    effect(() => {
      const existingCoverage = this.existingCoverageSignal();
      if (this.report || !existingCoverage) return;

      this.form?.patchValue({ report_type_category: this.reportTypeCategories[0] });
      this.form?.patchValue({ report_code: this.getFirstEnabledReportCode() });

      this.form.addValidators(buildNonOverlappingCoverageValidator(existingCoverage));
    });
  }
  ngAfterViewInit(): void {
    const reportId = this.activatedRoute.snapshot.params['reportId'];
    if (reportId) {
      this.report = this.activeReportSignal();
      this.form.patchValue(this.report, { emitEvent: false });
    }
  }

  private addReportTypeCategory() {
    if (!this.form.get('report_type_category')) {
      this.form.addControl('report_type_category', new SubscriptionFormControl());
    }
    (this.form?.get('report_type_category') as SubscriptionFormControl)?.addSubscription(() => {
      this.form.patchValue({ report_code: this.getFirstEnabledReportCode() });
    }, this.destroy$);
  }

  private addFilingFrequency() {
    if (!this.form.get('filing_frequency')) {
      this.form.addControl('filing_frequency', new SubscriptionFormControl());
    }
    (this.form?.get('filing_frequency') as SubscriptionFormControl)?.addSubscription(() => {
      this.form.patchValue({
        report_type_category: this.reportTypeCategories[0],
      });
      this.form?.patchValue({ report_code: this.getFirstEnabledReportCode() });
    }, this.destroy$);

    effect(() => {
      this.form?.patchValue({ filing_frequency: this.filingFrequencySignal(), form_type: 'F3XN' });
    });
  }

  ngOnInit(): void {
    this.form.controls['coverage_from_date'].addValidators([Validators.required]);
    this.form.controls['coverage_through_date'].addValidators([
      Validators.required,
      buildAfterDateValidator(this.form, 'coverage_from_date'),
    ]);
    (this.form.controls['coverage_from_date'] as SubscriptionFormControl).addSubscription(() => {
      this.form.controls['coverage_through_date'].updateValueAndValidity();
    });
    // Prepopulate coverage dates if the report code has rules to do so
    combineLatest([
      this.form.controls['report_code'].valueChanges.pipe(startWith(this.form.controls['report_code'].value)),
      this.form.controls['filing_frequency'].valueChanges.pipe(startWith(this.form.controls['filing_frequency'].value)),
      this.form.controls['report_type_category'].valueChanges.pipe(
        startWith(this.form.controls['report_type_category'].value),
      ),
    ]).subscribe(([reportCode, filingFrequency, reportTypeCategory]) => {
      const coverageDatesFunction = getCoverageDatesFunction(reportCode);
      if (coverageDatesFunction) {
        const isElectionYear = F3xReportTypeCategories.ELECTION_YEAR === reportTypeCategory;
        const [coverage_from_date, coverage_through_date] = coverageDatesFunction(
          this.thisYear,
          isElectionYear,
          filingFrequency,
        );
        this.form.patchValue({ coverage_from_date, coverage_through_date });
      } else {
        this.form.patchValue({ coverage_from_date: null, coverage_through_date: null });
      }
    });

    SchemaUtils.addJsonSchemaValidators(this.form, f3xSchema, false);
  }

  public getReportCodes(): ReportCodes[] {
    const isMonthly = this.form?.get('filing_frequency')?.value === 'M';
    switch (this.form.get('report_type_category')?.value) {
      case F3xReportTypeCategories.ELECTION_YEAR:
        return isMonthly ? monthlyElectionYearReportCodes : quarterlyElectionYearReportCodes;
      case F3xReportTypeCategories.NON_ELECTION_YEAR:
        return isMonthly ? monthlyNonElectionYearReportCodes : quarterlyNonElectionYearReportCodes;
      default:
        return [];
    }
  }

  public getFirstEnabledReportCode() {
    return this.getReportCodes().find((reportCode) => {
      return !this.usedReportCodes().includes(reportCode);
    });
  }

  public isElectionReport() {
    return electionReportCodes.includes(this.form.get('report_code')?.value);
  }

  public goBack() {
    this.router.navigateByUrl('/reports');
  }

  public navigateToManageTransactions() {
    this.router.navigateByUrl(`/reports/transactions/report/${this.report?.id}/list`);
  }

  public onHide() {
    this.store.dispatch(singleClickEnableAction());
  }

  public async save(jump: 'continue' | void) {
    this.formSubmitted = true;
    blurActiveInput(this.form);
    if (this.form.invalid) {
      this.store.dispatch(singleClickEnableAction());
      return;
    }

    const summary: Form3X = Form3X.fromJSON(SchemaUtils.getFormValues(this.form, f3xSchema, this.formProperties));
    summary.filing_frequency = this.form.get('filing_frequency')?.value;
    summary.report_type_category = this.form.get('report_type_category')?.value;

    // If a termination report, set the form_type appropriately.
    if (summary.report_code === ReportCodes.TER) {
      summary.form_type = F3xFormTypes.F3XT;
    }

    let report: Report;
    if (this.report?.id) {
      summary.id = this.report?.id;
      try {
        report = await this.form3XService.updateWithAllowedErrorCodes(
          summary,
          [HttpStatusCode.BadRequest],
          this.formProperties,
        );
      } catch {
        this.coverageDatesDialogVisible = true;
        return;
      }
    } else {
      report = await this.form3XService.create(summary, this.formProperties);
    }

    if (report) {
      if (jump === 'continue') {
        this.router.navigateByUrl(`/reports/transactions/report/${report.id}/list`);
      } else {
        this.router.navigateByUrl('/reports');
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Report Updated',
          life: 3000,
        });
      }
    }
  }

  public checkDisableReportCode(reportCode: ReportCodes) {
    if (this.report?.report_code === reportCode) {
      return false;
    }
    return this.usedReportCodes().includes(reportCode);
  }

  private getUsedReportCodes() {
    const existingCoverage = this.existingCoverageSignal();
    if (!existingCoverage) return [];
    return existingCoverage.reduce((codes: ReportCodes[], coverage) => {
      const years = [coverage.coverage_from_date?.getFullYear(), coverage.coverage_through_date?.getFullYear()];
      if (years.includes(this.thisYear)) {
        return [...codes, coverage.report_code] as ReportCodes[];
      }
      return codes;
    }, []);
  }
}

export enum F3xReportTypeCategories {
  ELECTION_YEAR = 'Election Year',
  NON_ELECTION_YEAR = 'Non-Election Year',
  SPECIAL = 'Special',
}
