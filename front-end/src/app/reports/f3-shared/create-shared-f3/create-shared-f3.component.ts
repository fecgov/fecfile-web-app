import { Component, computed, effect, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, hidden, required } from '@angular/forms/signals';
import { SignalFormComponent } from 'app/shared/components/signal-form/signal-form.component';
import {
  createInitialModel,
  getColumns,
  mapResponseToErrors,
  ReportTypeCategories,
  SharedForm3Model,
} from './create-shared-f3.utils';
import { SelectButtonInput } from 'app/shared/components/signal-inputs/select-button-input/select-button.input';
import { environment } from 'environments/environment.local';
import { requiredMessage } from 'app/shared/utils/signal-schema.utils';
import { RadioButtonModule } from 'primeng/radiobutton';
import { electionReportCodes, getCoverageDates, getReportCodes, ReportCodes } from 'app/shared/utils/report-code.utils';
import { currentYear, SharedForm3Store } from './shared-form3.store';
import { SelectInput } from 'app/shared/components/signal-inputs/select-input/select.input';
import { LabelUtils, StatesCodeLabels } from 'app/shared/utils/label.utils';
import { DateInput } from 'app/shared/components/signal-inputs/date-input/date.input';
import { Router } from '@angular/router';
import { BreakpointStore } from 'app/store/breakpoint.store';
import { ButtonModule } from 'primeng/button';
import {
  validateDate,
  validateDateAfter,
  validateDateOverlap,
} from 'app/shared/components/signal-inputs/date-input/date.validators';
import { CookieService } from 'ngx-cookie-service';
import { FORM_3_SERVICE } from 'app/shared/services/base-form-3.service';
import { F3FormTypes, F3xFormTypes, Form3, Form3X } from 'app/shared/models';
import { BaseForm3 } from 'app/shared/models/reports/base-form-3';
import { MessageWrapperService } from 'app/shared/services/message-wrapper.service';
import { Ripple } from 'primeng/ripple';
import { ElectionCycleService } from 'app/tools/election-cycle/election-cycle.service';
import { FormsModule } from '@angular/forms';
import { ElectionCycleSelectionComponent } from './election-cycle-selection/election-cycle-selection.component';
import { CommitteeStore } from 'app/committee/committee.store';

const fieldsToValidate: string[] = [
  'filing_frequency',
  'report_type_category',
  'report_code',
  'coverage_from_date',
  'coverage_through_date',
  'date_of_election',
  'state_of_election',
  'form_type',
] as const;

@Component({
  selector: 'app-create-shared-f3',
  templateUrl: './create-shared-f3.component.html',
  styleUrl: './create-shared-f3.component.scss',
  imports: [
    FormsModule,
    FormRoot,
    SelectButtonInput,
    FormField,
    RadioButtonModule,
    SelectInput,
    DateInput,
    ButtonModule,
    Ripple,
    ElectionCycleSelectionComponent,
  ],
  providers: [SharedForm3Store, BreakpointStore, MessageWrapperService, ElectionCycleService],
})
export class CreateSharedF3Component extends SignalFormComponent<SharedForm3Model> {
  protected readonly reportStore = inject(SharedForm3Store);
  private readonly breakpointStore = inject(BreakpointStore);
  protected readonly messageService = inject(MessageWrapperService);
  protected readonly router = inject(Router);
  private readonly cookieService = inject(CookieService);
  private readonly activeService = inject(FORM_3_SERVICE);
  private readonly committeeStore = inject(CommitteeStore);

  private readonly committeeFrequency = computed(() => {
    if (!this.reportStore.isF3X) return 'Q';
    return (this.reportStore.report() as Form3X)?.filing_frequency === 'M' ||
      this.committeeStore.filingFrequency() === 'M'
      ? 'M'
      : 'Q';
  });

  readonly isElectionReport = computed(() => electionReportCodes.includes(this.form.reportCode().value()!));

  override model = signal<SharedForm3Model>(
    createInitialModel(
      this.reportStore.report(),
      this.reportStore.isF3X,
      this.committeeFrequency(),
      this.committeeStore.committee()?.candidate_state ?? null,
    ),
  );

  override form = form(
    this.model,
    (schema) => {
      required(schema.filingFrequency, { message: requiredMessage });
      required(schema.reportTypeCategory, { message: requiredMessage });
      required(schema.reportCode, { message: requiredMessage });
      required(schema.coverage.startDate, { message: requiredMessage });
      required(schema.coverage.endDate, { message: requiredMessage });
      if (!this.reportStore.isF3X) required(schema.electionCycle);

      hidden(schema.filingFrequency, () => !this.reportStore.isF3X || !environment.userCanSetFilingFrequency);
      hidden(schema.electionReport, () => !this.isElectionReport());

      required(schema.electionReport.date, { when: () => this.isElectionReport(), message: requiredMessage });
      required(schema.electionReport.state, { when: () => this.isElectionReport(), message: requiredMessage });

      validateDate(schema.coverage.startDate);
      validateDate(schema.coverage.endDate);
      validateDateAfter(schema.coverage);
      validateDateOverlap(schema.coverage, `${environment.apiUrl}/reports/check-overlap/`, this.cookieService, {
        excludeId: this.reportStore.report()?.id ?? undefined,
        mapResponseToErrors,
      });
    },
    {
      submission: {
        action: async () => {
          try {
            let report = this.reportStore.report();
            const isUpdate = report !== null;
            report = await (report ? this.update(report) : this.create());

            if (this.jump === 'continue') {
              this.router.navigateByUrl(`/reports/transactions/report/${report.id}/list`);
            } else {
              this.router.navigateByUrl('/reports');
              this.messageService.success(`Report ${isUpdate ? 'Updated' : 'Created'}`);
            }
          } catch {
            return;
          }
        },
      },
    },
  );

  readonly filingFrequencyLabel = computed(() =>
    this.form.filingFrequency().value() === 'M' ? 'MONTHLY' : 'QUARTERLY',
  );

  readonly filingFrequencyOptions = [
    { label: 'Quarterly', value: 'Q' },
    { label: 'Monthly', value: 'M' },
  ];

  readonly reportTypeCategories = [
    { label: 'Election Year', value: ReportTypeCategories.ELECTION_YEAR },
    { label: 'Non-Election Year', value: ReportTypeCategories.NON_ELECTION_YEAR },
  ];

  readonly stateOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);

  private readonly isElectionYear = computed(
    () => ReportTypeCategories.ELECTION_YEAR === this.form.reportTypeCategory().value(),
  );
  readonly reportCodes = computed(() =>
    getReportCodes(this.isElectionYear(), this.form.filingFrequency().value()!, this.reportStore.isF3X),
  );
  readonly columnCount = computed(() => (this.breakpointStore.isAtLeast('lg') ? 3 : 2));
  readonly reportCodesColumns = computed(() => getColumns(this.reportCodes(), this.columnCount()));

  protected jump: 'continue' | undefined = undefined;

  readonly defaultReportCode = computed(() => {
    const report = this.reportStore.report();
    if (report && this.reportCodes().includes(report.report_code as ReportCodes))
      return report.report_code as ReportCodes;
    return this.reportCodes().find((code) => !this.reportStore.usedReportCodes().includes(code)) ?? null;
  });

  private readonly resetReportCodeOnOptionsChange = effect(() => {
    this.form.filingFrequency().value();
    this.form.reportTypeCategory().value();

    this.model.update((model) => ({
      ...model,
      reportCode: this.defaultReportCode(),
    }));
  });

  private readonly syncCoverageDatesEffect = effect(() => {
    const report = this.reportStore.report();
    if (report && !this.form().dirty()) {
      this.model.update((current) => ({
        ...current,
        coverage: {
          startDate: report.coverageDates['coverage_from_date']!,
          endDate: report.coverageDates['coverage_through_date']!,
        },
      }));
      return;
    }

    const reportCode = this.form.reportCode().value();
    const filingFrequency = this.form.filingFrequency().value();

    if (!reportCode || !filingFrequency) {
      this.model.update((current) => ({
        ...current,
        coverage: { startDate: null, endDate: null },
      }));
      return;
    }

    const coverageResult = getCoverageDates(reportCode, currentYear, this.isElectionYear(), filingFrequency);
    const [startDate = null, endDate = null] = coverageResult ?? [];

    this.model.update((current) => ({
      ...current,
      coverage: { startDate, endDate },
    }));
  });

  create() {
    const report = this.buildJson(
      this.reportStore.isF3X
        ? Form3X.fromJSON({ form_type: F3xFormTypes.F3XN })
        : Form3.fromJSON({ form_type: F3FormTypes.F3N }),
    );
    return this.activeService.create(report, fieldsToValidate);
  }

  private update(report: BaseForm3) {
    report = this.buildJson(report);
    return this.activeService.update(report);
  }

  buildJson(report: BaseForm3) {
    const formValue = this.form().value();
    if (this.reportStore.isF3X) (report as Form3X).filing_frequency = formValue.filingFrequency!;
    else (report as Form3).electionCycle = formValue.electionCycle!;
    report.report_type_category = formValue.reportTypeCategory!;
    report.report_code = formValue.reportCode!;
    if (report.report_code === ReportCodes.TER) {
      report.form_type = this.reportStore.isF3X ? F3xFormTypes.F3XT : F3FormTypes.F3T;
    }
    report.coverage_from_date = formValue.coverage.startDate!;
    report.coverage_through_date = formValue.coverage.endDate!;
    const hasElectionReport = !this.form.electionReport().hidden();
    report.date_of_election = hasElectionReport ? formValue.electionReport.date! : undefined;
    report.state_of_election = hasElectionReport ? formValue.electionReport.state! : undefined;
    return report;
  }
}
