import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
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
import { selectActiveReport } from 'app/store/active-report.selectors';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { environment } from 'environments/environment';
import { schema as f3Schema } from 'fecfile-validate/fecfile_validate_js/dist/F3';
import { MessageService } from 'primeng/api';
import { combineLatest, startWith, takeUntil } from 'rxjs';
import { FormComponent } from 'app/shared/components/app-destroyer.component';
import { singleClickEnableAction } from '../../../store/single-click.actions';
import { buildAfterDateValidator, buildNonOverlappingCoverageValidator } from 'app/shared/utils/validators.utils';
import { blurActiveInput } from 'app/shared/utils/form.utils';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { SelectButton } from 'primeng/selectbutton';
import { Select } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarComponent } from 'app/shared/components/calendar/calendar.component';
import { ErrorMessagesComponent } from 'app/shared/components/error-messages/error-messages.component';
import { SaveCancelComponent } from 'app/shared/components/save-cancel/save-cancel.component';
import { CoverageDates, CommitteeAccount, Form3, F3FormTypes } from 'app/shared/models';

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
    Select,
    SaveCancelComponent,
    TextareaModule,
  ],
})
export class CreateF3Step1Component extends FormComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly form3Service = inject(Form3Service);
  private readonly messageService = inject(MessageService);
  protected readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
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
  stateOptions: PrimeOptions = [];
  form: FormGroup = this.fb.group(SchemaUtils.getFormGroupFieldsNoBlur(this.formProperties, f3Schema), {
    updateOn: 'blur',
  });

  readonly F3ReportTypeCategories = F3ReportTypeCategories;
  public existingCoverage: CoverageDates[] | undefined;
  public usedReportCodes?: ReportCodes[];
  public thisYear = new Date().getFullYear();
  committeeAccount?: CommitteeAccount;
  reportCodeLabelMap?: { [key in ReportCodes]: string };

  ngOnInit(): void {
    const reportId = this.activatedRoute.snapshot.data['reportId'];
    this.form3Service.getReportCodeLabelMap().then((map) => (this.reportCodeLabelMap = map));
    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => {
        if (reportId && report) {
          this.form.patchValue(report);
        }
      });

    combineLatest([this.store.select(selectCommitteeAccount), this.form3Service.getF3CoverageDates()])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([committeeAccount, existingCoverage]) => {
        this.committeeAccount = committeeAccount;
        this.form.addControl('report_type_category', new SubscriptionFormControl(this.getReportTypeCategories()[0]));
        this.form?.patchValue({ form_type: 'F3N' });
        this.form?.patchValue({ report_type_category: this.getReportTypeCategories()[0] });
        this.usedReportCodes = this.getUsedReportCodes(existingCoverage);
        this.form?.patchValue({ report_code: this.getFirstEnabledReportCode() });
        (this.form?.get('report_type_category') as SubscriptionFormControl)?.addSubscription(() => {
          this.form.patchValue({ report_code: this.getFirstEnabledReportCode() });
        }, this.destroy$);

        this.existingCoverage = existingCoverage;
        this.form.addValidators(buildNonOverlappingCoverageValidator(existingCoverage));
      });
    this.stateOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);
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
      this.form.controls['report_type_category'].valueChanges.pipe(
        startWith(this.form.controls['report_type_category'].value),
      ),
    ]).subscribe(([reportCode, reportTypeCategory]) => {
      const coverageDatesFunction = getCoverageDatesFunction(reportCode);
      if (coverageDatesFunction) {
        const isElectionYear = F3ReportTypeCategories.ELECTION_YEAR === reportTypeCategory;
        const [coverage_from_date, coverage_through_date] = coverageDatesFunction(this.thisYear, isElectionYear, 'Q');
        this.form.patchValue({ coverage_from_date, coverage_through_date });
      } else {
        this.form.patchValue({ coverage_from_date: null, coverage_through_date: null });
      }
    });

    SchemaUtils.addJsonSchemaValidators(this.form, f3Schema, false);
  }

  public getReportTypeCategories(): F3ReportTypeCategoryType[] {
    return [F3ReportTypeCategories.ELECTION_YEAR, F3ReportTypeCategories.NON_ELECTION_YEAR];
  }

  public getReportCodes(): ReportCodes[] {
    switch (this.form.get('report_type_category')?.value) {
      case F3ReportTypeCategories.ELECTION_YEAR:
        return quarterlyElectionYearReportCodes;
      case F3ReportTypeCategories.NON_ELECTION_YEAR:
        return quarterlyNonElectionYearReportCodes;
      default:
        return [];
    }
  }

  public getUsedReportCodes(existingCoverage: CoverageDates[]): ReportCodes[] {
    return existingCoverage.reduce((codes: ReportCodes[], coverage) => {
      const years = [coverage.coverage_from_date?.getFullYear(), coverage.coverage_through_date?.getFullYear()];
      if (years.includes(this.thisYear)) {
        return [...codes, coverage.report_code] as ReportCodes[];
      }
      return codes;
    }, []);
  }

  public getFirstEnabledReportCode() {
    return this.getReportCodes().find((reportCode) => {
      return !(this.usedReportCodes && this.usedReportCodes.includes(reportCode));
    });
  }

  public isElectionReport() {
    return electionReportCodes.includes(this.form.get('report_code')?.value);
  }

  public goBack() {
    this.router.navigateByUrl('/reports');
  }

  public async save(jump: 'continue' | undefined = undefined) {
    this.formSubmitted = true;
    blurActiveInput(this.form);
    if (this.form.invalid) {
      this.store.dispatch(singleClickEnableAction());
      return;
    }

    const report: Form3 = Form3.fromJSON(SchemaUtils.getFormValues(this.form, f3Schema, this.formProperties));

    // If a termination report, set the form_type appropriately.
    if (report.report_code === ReportCodes.TER) {
      report.form_type = F3FormTypes.F3T;
    }

    const create$ = this.form3Service.create(report, this.formProperties);

    //Create the report
    create$.then((report) => {
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
    });
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
