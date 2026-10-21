import { Component, computed, effect, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, hidden, required } from '@angular/forms/signals';
import { SignalFormComponent } from 'app/shared/components/signal-form/signal-form.component';
import { mapResponseToErrors } from './create-shared-f3.utils';
import { SelectButtonInput } from 'app/shared/components/signal-inputs/select-button-input/select-button.input';
import { environment } from 'environments/environment.local';
import { requiredMessage } from 'app/shared/utils/signal-schema.utils';
import { RadioButtonModule } from 'primeng/radiobutton';
import { electionReportCodes, getCoverageDates, getReportCodes, ReportCodes } from 'app/shared/utils/report-code.utils';
import { currentYear, SharedForm3Store } from './shared-form3.store';
import { SelectInput } from 'app/shared/components/signal-inputs/select-input/select.input';
import { LabelUtils, StatesCodeLabels } from 'app/shared/utils/label.utils';
import { DateInput } from 'app/shared/components/signal-inputs/date-input/date.input';
import { Router, RouterLink } from '@angular/router';
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
import { ElectionCycleService } from 'app/tools/election-cycle/election-cycle.service';
import { ElectionCycleSelectionComponent } from './election-cycle-selection/election-cycle-selection.component';
import { CommitteeStore } from 'app/committee/committee.store';
import {
  SharedForm3Model,
  createInitialModel,
  ReportTypeCategories,
  getDefaultReportCode,
  buildJson,
  fieldsToValidate,
} from './shared-form3.model';
import { RadioButtonInput } from 'app/shared/components/signal-inputs/radio-button-input/radio-button.input';
import { DialogComponent } from 'app/shared/components/dialog/dialog.component';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-create-shared-f3',
  templateUrl: './create-shared-f3.component.html',
  styleUrl: './create-shared-f3.component.scss',
  imports: [
    FormRoot,
    SelectButtonInput,
    FormField,
    RadioButtonModule,
    SelectInput,
    DateInput,
    ButtonModule,
    ElectionCycleSelectionComponent,
    RadioButtonInput,
    DialogComponent,
    RouterLink,
  ],
  providers: [BreakpointStore, MessageWrapperService, ElectionCycleService, SharedForm3Store],
})
export class CreateSharedF3Component extends SignalFormComponent<SharedForm3Model> {
  protected readonly reportStore = inject(SharedForm3Store);
  private readonly breakpointStore = inject(BreakpointStore);
  protected readonly messageService = inject(MessageWrapperService);
  protected readonly router = inject(Router);
  private readonly cookieService = inject(CookieService);
  readonly activeService = inject(FORM_3_SERVICE);
  private readonly committeeStore = inject(CommitteeStore);

  readonly coverageDatesDialogVisible = signal(false);
  readonly isElectionReport = computed(() => electionReportCodes.includes(this.form.reportCode().value()!));

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
    getReportCodes(this.isElectionYear(), this.form.filingFrequency().value()!, this.activeService.isF3X),
  );
  readonly columnCount = computed(() => (this.breakpointStore.isAtLeast('lg') ? 3 : 2));

  protected jump: 'continue' | undefined = undefined;

  override model = signal<SharedForm3Model>(
    createInitialModel(
      this.reportStore.report(),
      this.activeService.isF3X,
      this.reportStore.usedReportCodes(),
      this.committeeStore,
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
      if (!this.activeService.isF3X) required(schema.electionCycle);

      hidden(schema.filingFrequency, () => !this.activeService.isF3X || !environment.userCanSetFilingFrequency);
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
            const buildState: [SharedForm3Model, boolean, boolean] = [
              this.form().value(),
              this.activeService.isF3X,
              !this.form.electionReport().hidden(),
            ];
            report = await (report ? this.update(report, ...buildState) : this.create(...buildState));

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

  private readonly resetReportCodeOnOptionsChange = effect(() => {
    const ff = this.form.filingFrequency();
    const rtc = this.form.reportTypeCategory();
    if (!ff.dirty() && !rtc.dirty()) return;
    ff.value();
    rtc.value();

    this.form.reportCode().value.set(getDefaultReportCode(this.reportCodes(), this.reportStore.usedReportCodes()));
  });

  private readonly syncCoverageDatesEffect = effect(() => {
    const ff = this.form.filingFrequency();
    const rtc = this.form.reportTypeCategory();
    const rc = this.form.reportCode();
    if (!ff.dirty() && !rtc.dirty() && !rc.dirty()) return;
    const reportCode = rc.value();
    const filingFrequency = ff.value();

    if (!reportCode || !filingFrequency) {
      this.form.coverage().value.set({ startDate: null, endDate: null });
      return;
    }

    const [startDate = null, endDate = null] =
      getCoverageDates(reportCode, currentYear, this.isElectionYear(), filingFrequency) ?? [];

    this.form.coverage().value.set({ startDate, endDate });
  });

  create(formValue: SharedForm3Model, isF3X: boolean, hasElectionReport: boolean) {
    const intialReport = this.activeService.isF3X
      ? Form3X.fromJSON({ form_type: F3xFormTypes.F3XN })
      : Form3.fromJSON({ form_type: F3FormTypes.F3N });
    const report = buildJson(intialReport, formValue, isF3X, hasElectionReport);
    return this.activeService.create(report, fieldsToValidate);
  }

  private async update(report: BaseForm3, formValue: SharedForm3Model, isF3X: boolean, hasElectionReport: boolean) {
    report = buildJson(report, formValue, isF3X, hasElectionReport);
    try {
      return await this.activeService.updateWithAllowedErrorCodes(
        report,
        [HttpStatusCode.BadRequest],
        fieldsToValidate,
      );
    } catch (error) {
      this.coverageDatesDialogVisible.set(true);
      throw error;
    }
  }

  readonly labelFn = (reportCode: ReportCodes) => this.reportStore.reportCodeLabelMap.value()?.[reportCode] ?? '';
  readonly disabledOptions = computed(() => {
    const options = this.reportCodes();
    const disabled = this.reportStore.disabledReportCodes();
    return new Set(options.filter((o) => disabled[o]));
  });
}
