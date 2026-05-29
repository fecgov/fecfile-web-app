import { HttpStatusCode } from '@angular/common/http';
import { Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormComponent } from 'app/shared/components/form.component';
import { CalendarComponent } from 'app/shared/components/calendar/calendar.component';
import { ErrorMessagesComponent } from 'app/shared/components/error-messages/error-messages.component';
import { SaveCancelComponent } from 'app/shared/components/save-cancel/save-cancel.component';
import { SearchableSelectComponent } from 'app/shared/components/searchable-select/searchable-select.component';
import { DialogComponent } from 'app/shared/components/dialog/dialog.component';
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
import { blurActiveInput, printFormErrors } from 'app/shared/utils/form.utils';
import { environment } from 'environments/environment';
import { schema as f3Schema } from 'fecfile-validate/fecfile_validate_js/dist/F3';
import { schema as f3xSchema } from 'fecfile-validate/fecfile_validate_js/dist/F3X';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButton } from 'primeng/selectbutton';
import { toSignal } from '@angular/core/rxjs-interop';
import { injectParams } from 'ngxtension/inject-params';
import { derivedAsync } from 'ngxtension/derived-async';
import { effectOnceIf } from 'ngxtension/effect-once-if';
import { singleClickEnableAction } from 'app/store/single-click.actions';
import { F3xFormTypes, Form3X } from 'app/shared/models/reports/form-3x.model';
import { F3FormTypes, Form3 } from 'app/shared/models/reports/form-3.model';
import { FORM_3_SERVICE } from 'app/shared/services/base-form-3.service';
import { BaseForm3 } from 'app/shared/models/reports/base-form-3';

export enum ReportTypeCategories {
  ELECTION_YEAR = 'Election Year',
  NON_ELECTION_YEAR = 'Non-Election Year',
}

@Component({
  selector: 'app-create-f3-step1',
  templateUrl: './create-f3-step1.component.html',
  styleUrl: './create-f3-step1.component.scss',
  imports: [
    ReactiveFormsModule,
    RadioButtonModule,
    SelectButton,
    ErrorMessagesComponent,
    CalendarComponent,
    SearchableSelectComponent,
    SaveCancelComponent,
    RouterLink,
    ButtonModule,
    DialogComponent,
  ],
})
export class CreateF3Step1Component extends FormComponent implements OnInit {
  // INJECTIONS
  private readonly activeService = inject(FORM_3_SERVICE);
  protected readonly messageService = inject(MessageService);
  protected readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly reportId = injectParams('reportId');
  readonly isF3X = computed(() => this.router.url.includes('/f3x/'));
  private readonly activeSchema = computed(() => (this.isF3X() ? f3xSchema : f3Schema));
  readonly title = computed(() => (this.isF3X() ? 'Form 3X' : 'Form 3'));
  readonly subLabel = computed(() =>
    this.isF3X()
      ? 'REPORT OF RECEIPTS AND DISBURSEMENTS FOR OTHER THAN AN AUTHORIZED COMMITTEE'
      : 'REPORT OF RECEIPTS AND DISBURSEMENTS FOR AN AUTHORIZED COMMITTEE',
  );

  // CONSTANTS & FORM DEFINITION
  readonly year = new Date().getFullYear();
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

  // Initialize unified form base
  readonly form: FormGroup = this.fb.group(
    SchemaUtils.getFormGroupFieldsNoBlur(this.formProperties, this.isF3X() ? f3xSchema : f3Schema),
    { updateOn: 'blur' },
  );

  readonly filingFrequencyOptions: PrimeOptions = [
    { label: 'Quarterly', value: 'Q' },
    { label: 'Monthly', value: 'M' },
  ];

  readonly reportTypeCategories = [ReportTypeCategories.ELECTION_YEAR, ReportTypeCategories.NON_ELECTION_YEAR];
  readonly defaultReportTypeCategory = this.getDefaultTypeCategory();

  // OBSERVABLES TO SIGNALS
  readonly reportCode = toSignal(this.form.controls['report_code'].valueChanges);
  readonly filingFrequency = toSignal(this.form.controls['filing_frequency'].valueChanges);
  readonly filingFrequencyLabel = computed(() => (this.filingFrequency() === 'M' ? 'MONTHLY' : 'QUARTERLY'));
  readonly reportTypeCategory = toSignal(this.form.controls['report_type_category'].valueChanges);

  // DERIVED ASYNCS
  readonly existingCoverage = derivedAsync(async () => {
    const reportId = this.reportId();
    if (reportId && !this.report()) return undefined;

    let existingCoverage = await this.activeService.getCoverageDates();
    if (reportId) {
      existingCoverage = existingCoverage.filter(
        (coverage) => coverage.coverage_from_date?.getTime() !== this.report()?.coverage_from_date?.getTime(),
      );
    }
    const validator = buildNonOverlappingCoverageValidator(existingCoverage);
    this.form.controls['coverage_from_date'].addValidators(validator);
    this.form.controls['coverage_through_date'].addValidators(validator);
    this.form.controls['coverage_from_date'].updateValueAndValidity({ emitEvent: false });
    this.form.controls['coverage_through_date'].updateValueAndValidity({ emitEvent: false });
    return existingCoverage;
  });

  readonly report = derivedAsync(async () => {
    const reportId = this.reportId();
    if (!reportId) return undefined;
    return this.activeService.get(reportId);
  });

  readonly coverageDatesDialogVisible = signal(false);

  // COMPUTED REPORT DATA & CODES
  readonly usedReportCodes = computed(() => {
    const existingCoverage = this.existingCoverage();
    if (!existingCoverage) return [];
    return existingCoverage.reduce((codes: ReportCodes[], coverage) => {
      const years = [coverage.coverage_from_date?.getFullYear(), coverage.coverage_through_date?.getFullYear()];
      if (years.includes(this.year)) {
        return [...codes, coverage.report_code] as ReportCodes[];
      }
      return codes;
    }, []);
  });

  private readonly committeeFrequency = computed(() =>
    this.isF3X() && this.committeeAccount().filing_frequency === 'M' ? 'M' : 'Q',
  );

  private readonly isElectionYear = computed(() => ReportTypeCategories.ELECTION_YEAR === this.reportTypeCategory());

  private readonly coverages = computed(() => {
    const report = this.report();
    const coverageDatesFunction = getCoverageDatesFunction(this.reportCode());
    if (this.form.pristine && report) {
      return [report.coverageDates['coverage_from_date'], report.coverageDates['coverage_through_date']];
    }
    if (!coverageDatesFunction) return undefined;
    return coverageDatesFunction(this.year, this.isElectionYear(), this.filingFrequency() ?? 'Q');
  });

  readonly disabledReportCodes = computed(() => {
    return Object.values(ReportCodes).reduce(
      (accumulator, currentCode) => {
        accumulator[currentCode] = this.checkDisableReportCode(currentCode);
        return accumulator;
      },
      {} as { [key in ReportCodes]: boolean },
    );
  });

  readonly reportCodes = computed(() => {
    const isMonthly = this.filingFrequency() === 'M';
    if (this.isElectionYear()) {
      return isMonthly ? monthlyElectionYearReportCodes : quarterlyElectionYearReportCodes;
    } else {
      return isMonthly ? monthlyNonElectionYearReportCodes : quarterlyNonElectionYearReportCodes;
    }
  });

  readonly numReportCodeColumns = signal(3);
  readonly reportCodesColumns = computed(() => {
    const codes = this.reportCodes();
    const numColumns = this.numReportCodeColumns();
    const result: ReportCodes[][] = [];
    let startIndex = 0;

    for (let i = 0; i < numColumns; i++) {
      const baseSize = Math.floor(codes.length / numColumns);
      const extra = i < codes.length % numColumns ? 1 : 0;
      const colSize = baseSize + extra;
      const chunk = codes.slice(startIndex, startIndex + colSize);
      result.push(chunk);
      startIndex += colSize;
    }
    return result;
  });

  readonly isElectionReport = computed(() => electionReportCodes.includes(this.reportCode()));
  readonly reportCodeLabelMap = derivedAsync(() => this.activeService.getReportCodeLabelMap());

  constructor() {
    super();
    effectOnceIf(
      () => this.existingCoverage() && !this.reportId(),
      () => {
        this.form.patchValue({ report_code: this.getFirstEnabledReportCode() });
      },
    );

    effectOnceIf(
      () => this.report(),
      () => {
        this.form.patchValue(this.report()!);
      },
    );

    effect(() => {
      const coverages = this.coverages();
      this.form.patchValue({
        coverage_from_date: coverages ? coverages[0] : null,
        coverage_through_date: coverages ? coverages[1] : null,
      });
    });

    effect(() => {
      this.filingFrequency();
      const report = this.report();
      if (this.form.pristine && report) {
        this.form.patchValue({ report_type_category: report.report_type_category });
      } else {
        this.form.patchValue({ report_type_category: this.defaultReportTypeCategory });
      }
    });

    effect(() => {
      this.reportTypeCategory();
      this.form.patchValue({ report_code: this.getFirstEnabledReportCode() });
    });

    this.detectScreenWidth();
  }

  ngOnInit(): void {
    const defaultFormType = this.isF3X() ? 'F3XN' : F3FormTypes.F3N;
    this.form.patchValue({ filing_frequency: this.committeeFrequency(), form_type: defaultFormType });

    this.form.controls['coverage_from_date'].addValidators([Validators.required]);
    this.form.controls['coverage_through_date'].addValidators([
      Validators.required,
      buildAfterDateValidator(this.form, 'coverage_from_date'),
    ]);

    (this.form.controls['coverage_from_date'] as SubscriptionFormControl).addSubscription(() => {
      this.form.controls['coverage_through_date'].updateValueAndValidity({ emitEvent: false });
    });
    (this.form.controls['coverage_through_date'] as SubscriptionFormControl).addSubscription(() => {
      this.form.controls['coverage_from_date'].updateValueAndValidity({ emitEvent: false });
    });

    SchemaUtils.addJsonSchemaValidators(this.form, this.activeSchema(), false);
  }

  private detectScreenWidth() {
    const mobileQuery = globalThis.matchMedia('(min-width: 992px)');
    const mediaQueryListener = () => this.numReportCodeColumns.set(mobileQuery.matches ? 3 : 2);
    mediaQueryListener();
    mobileQuery.addEventListener('change', mediaQueryListener);
    this.destroyRef.onDestroy(() => mobileQuery.removeEventListener('change', mediaQueryListener));
  }

  readonly onHide = () => this.store.dispatch(singleClickEnableAction());

  async submit(jump: 'continue' | void) {
    this.formSubmitted = true;
    blurActiveInput(this.form);

    if (this.form.invalid) {
      printFormErrors(this.form);
      this.store.dispatch(singleClickEnableAction());
      return;
    }

    const reportData = SchemaUtils.getFormValues(this.form, this.activeSchema(), this.formProperties);
    const reportStub: BaseForm3 | undefined = this.isF3X() ? Form3X.fromJSON(reportData) : Form3.fromJSON(reportData);
    reportStub.report_type_category = this.form.get('report_type_category')?.value;
    if (this.isF3X()) {
      (reportStub as Form3X).filing_frequency = this.form.get('filing_frequency')?.value;
      if (reportStub.report_code === ReportCodes.TER) reportStub.form_type = F3xFormTypes.F3XT;
    } else if (reportStub.report_code === ReportCodes.TER) reportStub.form_type = F3FormTypes.F3T;

    const reportId = this.reportId();
    const report = reportId
      ? await this.update(reportStub, reportId)
      : await this.activeService.create(reportStub, this.formProperties);
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

  private async update(summary: BaseForm3, reportId: string) {
    summary.id = reportId;
    try {
      return await this.activeService.updateWithAllowedErrorCodes(
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
    return this.reportCodes().find((code) => !this.usedReportCodes().includes(code));
  }

  private checkDisableReportCode(reportCode: ReportCodes) {
    if (this.report()?.report_code === reportCode) return false;
    return this.usedReportCodes().includes(reportCode);
  }

  /**
   * FECFILE-2500
   * ELECTION YEAR
   *   current date is between Feb 1 – Dec 31 of an even-numbered year
   *   current date is between Jan 1 – Jan 31 of an odd-numbered year
   *
   * NON-ELECTION YEAR
   *   current date is between Feb 1 – Dec 31 of an odd-numbered year
   *   current date is between Jan 1 – Jan 31 of an even-numbered year
   * @returns F3xReportTypeCategories
   */
  private getDefaultTypeCategory() {
    const isEvenYear = this.year % 2 === 0;
    const isJanuary = new Date().getMonth() === 0;
    return (isEvenYear && isJanuary) || (!isEvenYear && !isJanuary)
      ? ReportTypeCategories.NON_ELECTION_YEAR
      : ReportTypeCategories.ELECTION_YEAR;
  }
}
