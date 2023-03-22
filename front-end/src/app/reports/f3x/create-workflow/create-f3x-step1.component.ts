import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { F3xCoverageDates, F3xFormTypes, F3xSummary } from 'app/shared/models/f3x-summary.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { F3xSummaryService } from 'app/shared/services/f3x-summary.service';
import { DateUtils } from 'app/shared/utils/date.utils';
import { LabelUtils, PrimeOptions, StatesCodeLabels } from 'app/shared/utils/label.utils';
import {
  electionReportCodes,
  F3xReportCodes,
  F3X_REPORT_CODE_MAP,
  getReportCodeLabel,
  monthlyElectionYearReportCodes,
  monthlyNonElectionYearReportCodes,
  quarterlyElectionYearReportCodes,
  quarterlyNonElectionYearReportCodes,
} from 'app/shared/utils/report-code.utils';
import { ValidateUtils } from 'app/shared/utils/validate.utils';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { environment } from 'environments/environment';
import { schema as f3xSchema } from 'fecfile-validate/fecfile_validate_js/dist/F3X';
import { MessageService } from 'primeng/api';
import { combineLatest, map, of, startWith, Subject, switchMap, takeUntil, zip } from 'rxjs';
import { ReportService } from '../../../shared/services/report.service';
import { selectCashOnHand } from '../../../store/cash-on-hand.selectors';

@Component({
  selector: 'app-create-f3x-step1',
  templateUrl: './create-f3x-step1.component.html',
})
export class CreateF3XStep1Component implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  formProperties: string[] = [
    'filing_frequency',
    'report_type_category',
    'report_code',
    'coverage_from_date',
    'coverage_through_date',
    'date_of_election',
    'state_of_election',
    'form_type',
  ];
  userCanSetFilingFrequency: boolean = environment.userCanSetFilingFrequency;
  stateOptions: PrimeOptions = [];
  formSubmitted = false;

  form: FormGroup = this.fb.group(ValidateUtils.getFormGroupFields(this.formProperties));

  readonly F3xReportTypeCategories = F3xReportTypeCategories;
  public existingCoverage: F3xCoverageDates[] | undefined;

  constructor(
    private store: Store,
    private fecDatePipe: FecDatePipe,
    private fb: FormBuilder,
    private f3xSummaryService: F3xSummaryService,
    private messageService: MessageService,
    protected router: Router,
    private activatedRoute: ActivatedRoute,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    const reportId = this.activatedRoute.snapshot.data['reportId'];
    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => {
        if (reportId && report) {
          this.form.patchValue(report);
        }
      });

    this.store
      .select(selectCommitteeAccount)
      .pipe(takeUntil(this.destroy$))
      .subscribe((committeeAccount) => {
        const filingFrequency = this.userCanSetFilingFrequency ? 'Q' : committeeAccount?.filing_frequency;
        this.form.addControl('filing_frequency', new FormControl());
        this.form.addControl('report_type_category', new FormControl());
        this.form?.patchValue({ filing_frequency: filingFrequency, form_type: 'F3XN' });
        this.form?.patchValue({ report_type_category: this.getReportTypeCategories()[0] });
        this.form?.patchValue({ report_code: this.getReportCodes()[0] });
        this.form
          ?.get('filing_frequency')
          ?.valueChanges.pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.form.patchValue({
              report_type_category: this.getReportTypeCategories()[0],
            });
            this.form?.patchValue({ report_code: this.getReportCodes()[0] });
          });
        this.form
          ?.get('report_type_category')
          ?.valueChanges.pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.form.patchValue({
              report_code: this.getReportCodes()[0],
            });
          });
      });
    this.stateOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);

    // Prepopulate coverage dates if the report code has rules to do so
    combineLatest([
      this.f3xSummaryService.getF3xCoverageDates(),
      this.form.controls['report_code'].valueChanges.pipe(startWith(this.form.controls['report_code'].value)),
      this.form.controls['filing_frequency'].valueChanges.pipe(startWith(this.form.controls['filing_frequency'].value)),
      this.form.controls['report_type_category'].valueChanges.pipe(
        startWith(this.form.controls['report_type_category'].value)
      ),
    ]).subscribe(([existingCoverage, reportCode, filingFrequency, reportTypeCategory]) => {
      this.existingCoverage = existingCoverage;
      const overlapValidator = this.existingCoverageValidator(existingCoverage);
      this.form.controls['coverage_from_date'].addValidators([Validators.required, overlapValidator]);
      this.form.controls['coverage_through_date'].addValidators([Validators.required, overlapValidator]);
      const coverageDatesFunction = F3X_REPORT_CODE_MAP.get(reportCode)?.coverageDatesFunction;
      if (coverageDatesFunction) {
        const year = new Date().getFullYear();
        const isElectionYear = F3xReportTypeCategories.ELECTION_YEAR === reportTypeCategory;
        const [coverage_from_date, coverage_through_date] = coverageDatesFunction(
          year,
          isElectionYear,
          filingFrequency
        );
        this.form.patchValue({ coverage_from_date, coverage_through_date });
      }
    });

    ValidateUtils.addJsonSchemaValidators(this.form, f3xSchema, false);
  }

  existingCoverageValidator(existingCoverage: F3xCoverageDates[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const date = control.value;
      const collision = existingCoverage.reduce<F3xCoverageDates | undefined>((collision, coverage) => {
        if (collision) return collision;
        const collides = DateUtils.isWithin(date, coverage.coverage_from_date, coverage.coverage_through_date);
        return collides ? coverage : undefined;
      }, undefined);
      console.log(`AHOY ${date} ${existingCoverage[0].coverage_from_date}`);
      if (collision) {
        return { invaliddate: { msg: this.getCoverageOverlapMessage(date, collision) } };
      }
      return null;
    };
  }

  getCoverageOverlapMessage(date: Date, collision: F3xCoverageDates): string {
    return (
      `You have entered coverage dates that overlap ` +
      `the coverage dates of the following report: ${getReportCodeLabel(collision.report_code)} ` +
      ` ${this.fecDatePipe.transform(collision.coverage_from_date)} -` +
      ` ${this.fecDatePipe.transform(collision.coverage_through_date)}`
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public getReportTypeCategories(): F3xReportTypeCategoryType[] {
    return [F3xReportTypeCategories.ELECTION_YEAR, F3xReportTypeCategories.NON_ELECTION_YEAR];
  }

  public getReportCodes(): F3xReportCodes[] {
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

  public isElectionReport() {
    return electionReportCodes.includes(this.form.get('report_code')?.value);
  }

  public goBack() {
    this.router.navigateByUrl('/reports');
  }

  public save(jump: 'continue' | undefined = undefined) {
    this.formSubmitted = true;

    if (this.form.invalid) {
      return;
    }

    const summary: F3xSummary = F3xSummary.fromJSON(
      ValidateUtils.getFormValues(this.form, f3xSchema, this.formProperties)
    );

    // If a termination report, set the form_type appropriately.
    if (summary.report_code === F3xReportCodes.TER) {
      summary.form_type = F3xFormTypes.F3XT;
    }

    //Observables are *defined* here ahead of their execution
    const create$ = this.f3xSummaryService.create(summary, this.formProperties);
    // Save report to Cash On Hand in the store if necessary by pulling the reports table data.
    const tableData$ = this.reportService.getTableData();
    const cashOnHand$ = this.store.select(selectCashOnHand);

    //Create the report, update cashOnHand based on all reports, and then retrieve cashOnHand in that order
    create$
      .pipe(
        switchMap((report) => tableData$.pipe(map(() => report))),
        switchMap((report) => {
          return zip(of(report), cashOnHand$);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(([report, coh]) => {
        if (jump === 'continue') {
          if (coh.report_id === report.id) {
            this.router.navigateByUrl(`/reports/f3x/create/cash-on-hand/${report.id}`);
          } else {
            this.router.navigateByUrl(`/transactions/report/${report.id}/list`);
          }
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

export enum F3xReportTypeCategories {
  ELECTION_YEAR = 'Election Year',
  NON_ELECTION_YEAR = 'Non-Election Year',
  SPECIAL = 'Special',
}

export type F3xReportTypeCategoryType =
  | F3xReportTypeCategories.ELECTION_YEAR
  | F3xReportTypeCategories.NON_ELECTION_YEAR
  | F3xReportTypeCategories.SPECIAL;
