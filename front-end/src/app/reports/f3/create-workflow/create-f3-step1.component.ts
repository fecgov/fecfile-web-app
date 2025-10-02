import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Form3Service } from 'app/shared/services/form-3.service';
import { LabelUtils, PrimeOptions, StatesCodeLabels } from 'app/shared/utils/label.utils';
import {
  electionReportCodes,
  ReportCodes,
  quarterlyElectionYearReportCodes,
  quarterlyNonElectionYearReportCodes,
  getCoverageDatesFunction,
} from 'app/shared/utils/report-code.utils';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { environment } from 'environments/environment';
import { schema as f3Schema } from 'fecfile-validate/fecfile_validate_js/dist/F3';
import { MessageService } from 'primeng/api';
import { FormComponent } from 'app/shared/components/app-destroyer.component';
import { singleClickEnableAction } from '../../../store/single-click.actions';
import { buildAfterDateValidator, buildNonOverlappingCoverageValidator } from 'app/shared/utils/validators.utils';
import { blurActiveInput, printFormErrors } from 'app/shared/utils/form.utils';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { SelectButton } from 'primeng/selectbutton';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarComponent } from 'app/shared/components/calendar/calendar.component';
import { ErrorMessagesComponent } from 'app/shared/components/error-messages/error-messages.component';
import { SaveCancelComponent } from 'app/shared/components/save-cancel/save-cancel.component';
import { Form3, F3FormTypes } from 'app/shared/models';
import { derivedAsync } from 'ngxtension/derived-async';
import { injectParams } from 'ngxtension/inject-params';
import { effectOnceIf } from 'ngxtension/effect-once-if';
import { toSignal } from '@angular/core/rxjs-interop';
import { SearchableSelectComponent } from 'app/shared/components/searchable-select/searchable-select.component';

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
  ],
})
export class CreateF3Step1Component extends FormComponent implements OnInit {
  private readonly form3Service = inject(Form3Service);
  private readonly messageService = inject(MessageService);
  protected readonly router = inject(Router);
  readonly formProperties: string[] = [
    'report_type_category',
    'report_code',
    'coverage_from_date',
    'coverage_through_date',
    'date_of_election',
    'state_of_election',
    'form_type',
  ];
  readonly userCanSetFilingFrequency: boolean = environment.userCanSetFilingFrequency;
  readonly stateOptions: PrimeOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);
  readonly form: FormGroup = this.fb.group(SchemaUtils.getFormGroupFieldsNoBlur(this.formProperties, f3Schema), {
    updateOn: 'blur',
  });

  readonly reportCode = toSignal(this.form.controls['report_code'].valueChanges);
  readonly reportTypeCategory = toSignal(this.form.controls['report_type_category'].valueChanges);
  readonly existingCoverage = derivedAsync(async () => {
    const reportId = this.reportId();
    if (reportId && !this.report()) return undefined;
    let existingCoverage = await this.form3Service.getF3CoverageDates();
    if (reportId) {
      existingCoverage = existingCoverage.filter(
        (coverage) => coverage.coverage_from_date?.getTime() !== (this.report() as Form3).coverage_from_date?.getTime(),
      );
    }
    this.form.addValidators(buildNonOverlappingCoverageValidator(existingCoverage));
    return existingCoverage;
  });

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

  readonly reportTypeCategories = [F3ReportTypeCategories.ELECTION_YEAR, F3ReportTypeCategories.NON_ELECTION_YEAR];
  readonly reportCodes = computed(() =>
    this.isElectionYear() ? quarterlyElectionYearReportCodes : quarterlyNonElectionYearReportCodes,
  );
  private readonly isElectionYear = computed(() => F3ReportTypeCategories.ELECTION_YEAR === this.reportTypeCategory());
  readonly isElectionReport = computed(() => electionReportCodes.includes(this.reportCode()));
  private readonly coverages = computed(() => {
    const report = this.report();
    const coverageDatesFunction = getCoverageDatesFunction(this.reportCode());
    if (this.form.pristine && report) {
      return [report.coverageDates!['coverage_from_date'], report.coverageDates!['coverage_through_date']];
    }

    if (!coverageDatesFunction) return undefined;
    return coverageDatesFunction(this.thisYear, this.isElectionYear(), 'Q');
  });

  public thisYear = new Date().getFullYear();
  reportCodeLabelMap?: { [key in ReportCodes]: string };

  readonly reportId = injectParams('reportId');
  readonly report = derivedAsync(() => {
    const reportId = this.reportId();
    if (!reportId) return undefined;
    return this.form3Service.get(reportId);
  });

  constructor() {
    super();
    this.form.patchValue({ form_type: F3FormTypes.F3N, report_type_category: this.reportTypeCategories[0] });
    this.form.controls['coverage_from_date'].addValidators([Validators.required]);
    this.form.controls['coverage_through_date'].addValidators([
      Validators.required,
      buildAfterDateValidator(this.form, 'coverage_from_date'),
    ]);
    (this.form.controls['coverage_from_date'] as SubscriptionFormControl).addSubscription(() => {
      this.form.controls['coverage_through_date'].updateValueAndValidity();
    });

    SchemaUtils.addJsonSchemaValidators(this.form, f3Schema, false);

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
      this.reportTypeCategory();
      this.form.patchValue({ report_code: this.getFirstEnabledReportCode() });
    });
  }

  ngOnInit() {
    this.form3Service.getReportCodeLabelMap().then((map) => (this.reportCodeLabelMap = map));
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

  async save(jump: 'continue' | void) {
    this.formSubmitted = true;
    blurActiveInput(this.form);
    if (this.form.invalid) {
      printFormErrors(this.form);
      this.store.dispatch(singleClickEnableAction());
      return;
    }

    const summary: Form3 = Form3.fromJSON(SchemaUtils.getFormValues(this.form, f3Schema, this.formProperties));

    // If a termination report, set the form_type appropriately.
    if (summary.report_code === ReportCodes.TER) {
      summary.form_type = F3FormTypes.F3T;
    }

    //Create the report
    const report = await this.form3Service.create(summary, this.formProperties);
    if (jump === 'continue') {
      this.router.navigateByUrl(`/reports/transactions/report/${report.id}/list`);
    } else {
      this.router.navigateByUrl('/reports');
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Contact Updated',
        life: 3000,
      });
    }
  }
}

export enum F3ReportTypeCategories {
  ELECTION_YEAR = 'Election Year',
  NON_ELECTION_YEAR = 'Non-Election Year',
  SPECIAL = 'Special',
}

export type F3ReportTypeCategoryType =
  | F3ReportTypeCategories.ELECTION_YEAR
  | F3ReportTypeCategories.NON_ELECTION_YEAR
  | F3ReportTypeCategories.SPECIAL;
