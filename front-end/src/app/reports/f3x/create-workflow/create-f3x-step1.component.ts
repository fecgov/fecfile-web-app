import { HttpStatusCode } from '@angular/common/http';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormComponent } from 'app/shared/components/app-destroyer.component';
import { CalendarComponent } from 'app/shared/components/calendar/calendar.component';
import { ErrorMessagesComponent } from 'app/shared/components/error-messages/error-messages.component';
import { SaveCancelComponent } from 'app/shared/components/save-cancel/save-cancel.component';
import { F3xFormTypes, Form3X } from 'app/shared/models';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { blurActiveInput, printFormErrors } from 'app/shared/utils/form.utils';
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
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButton } from 'primeng/selectbutton';
import { TextareaModule } from 'primeng/textarea';
import { singleClickEnableAction } from '../../../store/single-click.actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { injectParams } from 'ngxtension/inject-params';
import { derivedAsync } from 'ngxtension/derived-async';
import { effectOnceIf } from 'ngxtension/effect-once-if';
import { SearchableSelectComponent } from 'app/shared/components/searchable-select/searchable-select.component';

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
    SearchableSelectComponent,
    SaveCancelComponent,
    TextareaModule,
    Dialog,
    RouterLink,
    Button,
  ],
})
export class CreateF3XStep1Component extends FormComponent implements OnInit {
  // INJECTIONS
  private readonly form3XService = inject(Form3XService);
  protected readonly messageService = inject(MessageService);
  readonly router = inject(Router);
  readonly reportId = injectParams('reportId');

  // CONSTANTS
  readonly thisYear = new Date().getFullYear();
  readonly userCanSetFilingFrequency: boolean = environment.userCanSetFilingFrequency;
  readonly stateOptions: PrimeOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);
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
  readonly form: FormGroup = this.fb.group(SchemaUtils.getFormGroupFieldsNoBlur(this.formProperties, f3xSchema), {
    updateOn: 'blur',
  });
  readonly reportTypeCategories = [F3xReportTypeCategories.ELECTION_YEAR, F3xReportTypeCategories.NON_ELECTION_YEAR];

  // Observable to Signals
  readonly reportCode = toSignal(this.form.controls['report_code'].valueChanges);
  readonly filingFrequency = toSignal(this.form.controls['filing_frequency'].valueChanges);
  readonly reportTypeCategory = toSignal(this.form.controls['report_type_category'].valueChanges);

  // Derived Asyncs
  readonly existingCoverage = derivedAsync(async () => {
    const reportId = this.reportId();
    if (reportId && !this.report()) return undefined;
    let existingCoverage = await this.form3XService.getF3xCoverageDates();
    if (reportId) {
      existingCoverage = existingCoverage.filter(
        (coverage) =>
          coverage.coverage_from_date?.getTime() !== (this.report() as Form3X).coverage_from_date?.getTime(),
      );
    }
    this.form.addValidators(buildNonOverlappingCoverageValidator(existingCoverage));
    return existingCoverage;
  });

  readonly report = derivedAsync(() => {
    const reportId = this.reportId();
    if (!reportId) return undefined;
    return this.form3XService.get(reportId);
  });

  // SIGNALS
  readonly coverageDatesDialogVisible = signal(false);

  // COMPUTED SIGNALS
  readonly usedReportCodes = computed(() => {
    const existingCoverage = this.existingCoverage();
    if (!existingCoverage) return [];
    return existingCoverage.reduce((codes: ReportCodes[], coverage) => {
      const years = [coverage.coverage_from_date?.getFullYear(), coverage.coverage_through_date?.getFullYear()];
      if (years.includes(this.thisYear)) {
        return [...codes, coverage.report_code] as ReportCodes[];
      }
      return codes;
    }, []);
  });

  private readonly committeeFrequency = computed(() => (this.committeeAccount().filing_frequency === 'M' ? 'M' : 'Q'));

  readonly form3x = computed(() => {
    const report = this.report();
    if (!report) return undefined;
    return report as Form3X;
  });

  private readonly isMonthly = computed(() => this.filingFrequency() === 'M');

  private readonly isElectionYear = computed(() => F3xReportTypeCategories.ELECTION_YEAR === this.reportTypeCategory());
  private readonly coverages = computed(() => {
    const report = this.report();
    const coverageDatesFunction = getCoverageDatesFunction(this.reportCode());
    if (this.form.pristine && report) {
      return [report.coverageDates!['coverage_from_date'], report.coverageDates!['coverage_through_date']];
    }

    if (!coverageDatesFunction) return undefined;
    return coverageDatesFunction(this.thisYear, this.isElectionYear(), this.filingFrequency());
  });

  readonly disabledReportCodes = computed(() => {
    const statusObject = Object.values(ReportCodes).reduce(
      (accumulator, currentCode) => {
        accumulator[currentCode] = this.checkDisableReportCode(currentCode);
        return accumulator;
      },
      {} as { [key in ReportCodes]: boolean },
    );

    return statusObject;
  });

  readonly reportCodes = computed(() => {
    const isMonthly = this.isMonthly();
    switch (this.reportTypeCategory()) {
      case F3xReportTypeCategories.ELECTION_YEAR:
        return isMonthly ? monthlyElectionYearReportCodes : quarterlyElectionYearReportCodes;
      case F3xReportTypeCategories.NON_ELECTION_YEAR:
        return isMonthly ? monthlyNonElectionYearReportCodes : quarterlyNonElectionYearReportCodes;
      default:
        return [];
    }
  });

  readonly isElectionReport = computed(() => electionReportCodes.includes(this.reportCode()));

  // VARIABLES
  reportCodeLabelMap?: { [key in ReportCodes]: string };

  constructor() {
    super();
    this.form3XService.getReportCodeLabelMap().then((map) => (this.reportCodeLabelMap = map));

    effectOnceIf(
      () => this.existingCoverage() && !this.reportId(),
      () => {
        this.form.patchValue({ report_code: this.getFirstEnabledReportCode() });
      },
    );
    effectOnceIf(
      () => this.report(),
      () => this.form.patchValue(this.report()!),
    );

    effect(() => {
      const coverages = this.coverages();
      if (coverages) {
        this.form.patchValue({ coverage_from_date: coverages[0], coverage_through_date: coverages[1] });
      } else {
        this.form.patchValue({ coverage_from_date: null, coverage_through_date: null });
      }
    });

    effect(() => {
      this.filingFrequency();
      const report = this.form3x();
      if (this.form.pristine && report) {
        this.form.patchValue({ report_type_category: report.report_type_category });
      } else {
        this.form.patchValue({ report_type_category: this.reportTypeCategories[0] });
      }
    });
    effect(() => {
      this.reportTypeCategory();
      const report = this.report();
      if (this.form.pristine && report) {
        this.form.patchValue({ report_code: report.report_code });
      } else {
        this.form.patchValue({ report_code: this.getFirstEnabledReportCode() });
      }
    });
  }

  ngOnInit(): void {
    this.form.patchValue({ filing_frequency: this.committeeFrequency(), form_type: 'F3XN' });
    this.form.controls['coverage_from_date'].addValidators([Validators.required]);
    this.form.controls['coverage_through_date'].addValidators([
      Validators.required,
      buildAfterDateValidator(this.form, 'coverage_from_date'),
    ]);
    (this.form.controls['coverage_from_date'] as SubscriptionFormControl).addSubscription(() => {
      this.form.controls['coverage_through_date'].updateValueAndValidity();
    });

    SchemaUtils.addJsonSchemaValidators(this.form, f3xSchema, false);
  }

  // NON-PRIVATE Functions
  readonly onHide = () => this.store.dispatch(singleClickEnableAction());

  async save(jump: 'continue' | void) {
    this.formSubmitted = true;
    blurActiveInput(this.form);
    if (this.form.invalid) {
      printFormErrors(this.form);
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

    const reportId = this.reportId();
    const report = reportId
      ? await this.update(summary, reportId)
      : await this.form3XService.create(summary, this.formProperties);
    if (!report) return;
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

  // PRIVATE Functions
  private async update(summary: Form3X, reportId: string) {
    summary.id = reportId;
    try {
      return await this.form3XService.updateWithAllowedErrorCodes(
        summary,
        [HttpStatusCode.BadRequest],
        this.formProperties,
      );
    } catch {
      this.coverageDatesDialogVisible.set(true);
      return;
    }
  }

  private getFirstEnabledReportCode() {
    const report = this.report();
    if (report && this.reportCodes().includes(report.report_code as ReportCodes)) return report.report_code;
    return this.reportCodes().find((reportCode) => {
      return !this.usedReportCodes().includes(reportCode);
    });
  }

  private checkDisableReportCode(reportCode: ReportCodes) {
    if (this.report()?.report_code === reportCode) return false;
    return this.usedReportCodes().includes(reportCode);
  }
}

export enum F3xReportTypeCategories {
  ELECTION_YEAR = 'Election Year',
  NON_ELECTION_YEAR = 'Non-Election Year',
  SPECIAL = 'Special',
}
