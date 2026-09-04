import { HttpStatusCode } from '@angular/common/http';
import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SaveCancelComponent } from 'app/shared/components/save-cancel/save-cancel.component';
import { LabelUtils, PrimeOptions, StateCode, StatesCodeLabels } from 'app/shared/utils/label.utils';
import { electionReportCodes, getCoverageDates, getReportCodes, ReportCodes } from 'app/shared/utils/report-code.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { injectParams } from 'ngxtension/inject-params';
import { derivedAsync } from 'ngxtension/derived-async';
import { FORM_3_SERVICE } from 'app/shared/services/base-form-3.service';
import { BaseForm3 } from 'app/shared/models/reports/base-form-3';
import { BreakpointStore } from 'app/store/breakpoint.store';
import { form, FormField, hidden, required, submit } from '@angular/forms/signals';
import { DateInput, validateDate, validateDateAfter } from 'app/shared/components/signal-inputs/date-input/date.input';
import { SelectButtonInput } from 'app/shared/components/signal-inputs/select-button-input/select-button.input';
import { SelectInput } from 'app/shared/components/signal-inputs/select-input/select.input';
import { Store } from '@ngrx/store';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { SignalFormComponent } from 'app/shared/components/signal-form/signal-form.component';
import { SharedF3Store } from 'app/reports/shared-f3.store';
import {
  deserializeBaseForm3,
  serializeForm3,
  serializeForm3X,
  SharedForm3Data,
  validateNonOverlappingCoverage,
} from '../shared-f3.validator';
import { effectOnceIf } from 'ngxtension/effect-once-if';
import { F3FormTypes, F3xFormTypes, FilingFrequency } from 'app/shared/models';
import { requiredMessage } from 'app/shared/utils/signal-schema.utils';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { FEATURE_FLAGS } from 'environments/tokens/feature-flags.config';

const formProperties: string[] = [
  'filing_frequency',
  'report_type_category',
  'report_code',
  'coverage_from_date',
  'coverage_through_date',
  'date_of_election',
  'state_of_election',
  'form_type',
];

@Component({
  selector: 'app-create-shared-f3',
  templateUrl: './create-shared-f3.component.html',
  styleUrl: './create-shared-f3.component.scss',
  imports: [
    ReactiveFormsModule,
    RadioButtonModule,
    SaveCancelComponent,
    ButtonModule,
    SelectButtonInput,
    FormField,
    DateInput,
    SelectInput,
  ],
  providers: [BreakpointStore, SharedF3Store],
})
export class CreateSharedF3Component extends SignalFormComponent<SharedForm3Data> {
  // INJECTIONS
  private readonly featureFlags = inject(FEATURE_FLAGS);
  private readonly confirmService = inject(ConfirmationService);
  private readonly activeService = inject(FORM_3_SERVICE);
  readonly sharedF3Store = inject(SharedF3Store);
  private readonly messageService = inject(MessageService);
  protected readonly router = inject(Router);
  private readonly breakpointStore = inject(BreakpointStore);
  private readonly store = inject(Store);
  private readonly committee = this.store.selectSignal(selectCommitteeAccount);

  readonly reportId = injectParams('reportId');
  readonly isF3X = computed(() => this.router.url.includes('/f3x/'));
  readonly title = computed(() => (this.isF3X() ? 'Form 3X' : 'Form 3'));
  readonly subLabel = computed(() =>
    this.isF3X()
      ? 'REPORT OF RECEIPTS AND DISBURSEMENTS FOR OTHER THAN AN AUTHORIZED COMMITTEE'
      : 'REPORT OF RECEIPTS AND DISBURSEMENTS FOR AN AUTHORIZED COMMITTEE',
  );
  readonly filingFrequencyLabel = computed(() =>
    this.form.filingFrequency().value() === 'M' ? 'MONTHLY' : 'QUARTERLY',
  );

  readonly model = signal<SharedForm3Data>({
    coverages: { from: null, to: null },
    filingFrequency: null,
    reportCode: null,
    reportTypeCategory: null,
    election: {
      state: null,
      date: null,
    },
  });
  readonly form = form(this.model, (schema) => {
    hidden(schema.filingFrequency, () => !(this.isF3X() && this.featureFlags.userCanSetFilingFrequency));
    hidden(schema.election, ({ valueOf }) => {
      const reportCode = valueOf(schema.reportCode);
      if (reportCode === null) return true;
      return !electionReportCodes.has(reportCode);
    });

    required(schema.coverages.from, { message: requiredMessage });
    required(schema.coverages.to, { message: requiredMessage });
    required(schema.filingFrequency, { message: requiredMessage });
    required(schema.reportCode, { message: requiredMessage });
    required(schema.reportTypeCategory, { message: requiredMessage });

    validateDate(schema.coverages.from);
    validateDate(schema.coverages.to);
    validateDate(schema.election.date);

    validateNonOverlappingCoverage(schema.coverages, this.sharedF3Store.existingCoverage);
    validateDateAfter(schema.coverages.to, schema.coverages.from);
  });

  readonly stateOptions: PrimeOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);
  readonly filingFrequencyOptions: PrimeOptions = [
    { label: 'Quarterly', value: 'Q' },
    { label: 'Monthly', value: 'M' },
  ];
  readonly reportTypeCategoriesOptions = LabelUtils.getPrimeOptions([
    ['Election Year', 'Election Year'],
    ['Non-Election Year', 'Non-Election Year'],
  ]);

  readonly coverageDatesDialogVisible = signal(false);

  private readonly isElectionYear = computed(() => 'Election Year' === this.form.reportTypeCategory().value());

  readonly reportCodes = computed(() =>
    getReportCodes(this.isElectionYear(), this.form.filingFrequency().value(), this.isF3X()),
  );

  readonly numReportCodeColumns = computed(() => (this.breakpointStore.screenSize() === 'lg' ? 3 : 2));
  readonly reportCodesColumns = computed(() => {
    const codes = this.reportCodes();
    const numColumns = this.numReportCodeColumns();
    const result: ReportCodes[][] = [];
    let startIndex = 0;

    for (let i = 0; i < numColumns; i++) {
      const baseSize = Math.floor(codes.size / numColumns);
      const extra = i < codes.size % numColumns ? 1 : 0;
      const colSize = baseSize + extra;
      const chunk = Array.from(codes).slice(startIndex, startIndex + colSize);
      result.push(chunk);
      startIndex += colSize;
    }
    return result;
  });

  readonly reportCodeLabelMap = derivedAsync(() => this.activeService.getReportCodeLabelMap());
  constructor() {
    super();
    effectOnceIf(
      () => {
        const committee = this.committee();
        if (!this.sharedF3Store.existingCoverage()) return undefined;

        return {
          filingFrequency: this.isF3X() && committee.filing_frequency === 'M' ? 'M' : 'Q',
          candidateState: committee.candidate_state ?? null,
        } satisfies {
          filingFrequency: FilingFrequency;
          candidateState: StateCode | null;
        };
      },
      (data) => {
        const report: BaseForm3 = this.sharedF3Store.report.value();
        if (report !== null) {
          if (!report.state_of_election) report.state_of_election = data.candidateState ?? undefined;
          this.form().reset(deserializeBaseForm3(report));
        } else {
          const reportCodes = getReportCodes(true, data.filingFrequency, this.isF3X());
          const code = this.sharedF3Store.firstEnabledReportCode(reportCodes);
          const coverages = getCoverageDates(code, true, data.filingFrequency);

          this.form().reset({
            coverages,
            filingFrequency: data.filingFrequency,
            reportCode: code,
            reportTypeCategory: 'Election Year',
            election: {
              state: data.candidateState,
              date: null,
            },
          });
        }
      },
    );

    effect(() => {
      const reportCodes = this.reportCodes();
      const reportCode = this.sharedF3Store.firstEnabledReportCode(reportCodes);
      if (!untracked(() => this.form().dirty())) return;
      this.form.reportCode().value.set(reportCode);
    });

    effect(() => {
      const reportCode = this.form.reportCode().value();
      untracked(() => {
        if (!this.form().dirty()) return;
        const coverages = getCoverageDates(reportCode, this.isElectionYear(), this.form.filingFrequency().value());
        this.form.coverages().value.set(coverages);
      });
    });
  }

  async submitForm(jump: 'continue' | void) {
    return submit(this.form, {
      ignoreValidators: 'none',
      action: async () => {
        try {
          const data = this.form().value();
          const original: BaseForm3 | null = this.sharedF3Store.report.value();

          const reportStub = this.isF3X()
            ? serializeForm3X(data, (original?.form_type as F3xFormTypes) ?? F3xFormTypes.F3XN)
            : serializeForm3(data, (original?.form_type as F3FormTypes) ?? F3FormTypes.F3N);

          const isEdit = this.sharedF3Store.isActive();
          if (isEdit) {
            reportStub.id = this.sharedF3Store.reportId()!;
            const datePipe = new FecDatePipe();
            const from = datePipe.transform(reportStub.coverage_from_date);
            const through = datePipe.transform(reportStub.coverage_through_date);
            const count = await this.activeService.getTransactionsOutsideCoverage(reportStub.id, from, through);
            if (count > 0) {
              const transaction = count > 1 ? 'transactions' : 'transaction';
              const message = [
                `You have ${count} ${transaction}`,
                ` within this report that will fall outside the new coverage dates of `,
                `${from} - ${through}. `,
                `If you continue, ${count > 1 ? 'these' : 'this'} ${transaction} will be removed from this report `,
                `and moved to Unassigned within the Transactions page.\n\n`,
                `If you don't want to do this now, cancel and review your ${transaction} `,
                `before updating your coverage dates.`,
              ].join('');
              const confirmed = await new Promise<boolean>((resolve) => {
                this.confirmService.confirm({
                  message,
                  header: 'Heads Up!',
                  accept: () => resolve(true),
                  reject: () => resolve(false),
                });
              });

              if (!confirmed) return;
            }
            this.update(jump, reportStub);
          } else {
            const report = await this.activeService.create(reportStub, formProperties);
            this.finishSubmission(jump, report);
          }

          return;
        } catch {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to submit form',
            life: 3000,
          });
          return { kind: 'serverError', message: 'Failed to submit form:' };
        }
      },
      onInvalid: (field) => {
        const firstError = field().errorSummary()[0];
        console.log(firstError);
        firstError?.fieldTree().focusBoundControl();
      },
    });
  }

  private finishSubmission(jump: 'continue' | void, report: BaseForm3) {
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

  private async update(jump: 'continue' | void, summary: BaseForm3) {
    const report = await this.activeService.updateWithAllowedErrorCodes(
      summary,
      [HttpStatusCode.BadRequest],
      formProperties,
    );
    this.finishSubmission(jump, report);
  }
}
