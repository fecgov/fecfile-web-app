import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { F3xCoverageDates, F3xFormTypes, F3xReport } from 'app/shared/models/report-types/f3x-report.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { F3xReportService } from 'app/shared/services/f3x-report.service';
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
import { combineLatest, map, of, startWith, switchMap, takeUntil, zip } from 'rxjs';
import { ReportService } from '../../../shared/services/report.service';
import { selectCashOnHand } from '../../../store/cash-on-hand.selectors';
import * as _ from 'lodash';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';

@Component({
  selector: 'app-create-f3x-step1',
  templateUrl: './create-f3x-step1.component.html',
})
export class CreateF3XStep1Component extends DestroyerComponent implements OnInit {
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
  public usedReportCodes?: F3xReportCodes[];
  public thisYear = new Date().getFullYear();

  constructor(
    private store: Store,
    private fecDatePipe: FecDatePipe,
    private fb: FormBuilder,
    private F3xReportService: F3xReportService,
    private messageService: MessageService,
    protected router: Router,
    private activatedRoute: ActivatedRoute,
    private reportService: ReportService
  ) {
    super();
  }

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

    combineLatest([this.store.select(selectCommitteeAccount), this.F3xReportService.getF3xCoverageDates()])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([committeeAccount, existingCoverage]) => {
        const filingFrequency = this.userCanSetFilingFrequency ? 'Q' : committeeAccount?.filing_frequency;
        this.form.addControl('filing_frequency', new FormControl());
        this.form.addControl('report_type_category', new FormControl());
        this.form?.patchValue({ filing_frequency: filingFrequency, form_type: 'F3XN' });
        this.form?.patchValue({ report_type_category: this.getReportTypeCategories()[0] });
        this.usedReportCodes = this.getUsedReportCodes(existingCoverage);
        this.form?.patchValue({ report_code: this.getFirstEnabledReportCode() });
        this.form
          ?.get('filing_frequency')
          ?.valueChanges.pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.form.patchValue({
              report_type_category: this.getReportTypeCategories()[0],
            });
            this.form?.patchValue({ report_code: this.getFirstEnabledReportCode() });
          });
        this.form
          ?.get('report_type_category')
          ?.valueChanges.pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.form.patchValue({ report_code: this.getFirstEnabledReportCode() });
          });

        this.existingCoverage = existingCoverage;
        this.form.addValidators(this.existingCoverageValidator(existingCoverage));
      });
    this.stateOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);
    this.form.controls['coverage_from_date'].addValidators([Validators.required]);
    this.form.controls['coverage_through_date'].addValidators([Validators.required]);

    // Prepopulate coverage dates if the report code has rules to do so
    combineLatest([
      this.form.controls['report_code'].valueChanges.pipe(startWith(this.form.controls['report_code'].value)),
      this.form.controls['filing_frequency'].valueChanges.pipe(startWith(this.form.controls['filing_frequency'].value)),
      this.form.controls['report_type_category'].valueChanges.pipe(
        startWith(this.form.controls['report_type_category'].value)
      ),
    ]).subscribe(([reportCode, filingFrequency, reportTypeCategory]) => {
      const coverageDatesFunction = F3X_REPORT_CODE_MAP.get(reportCode)?.coverageDatesFunction;
      if (coverageDatesFunction) {
        const isElectionYear = F3xReportTypeCategories.ELECTION_YEAR === reportTypeCategory;
        const [coverage_from_date, coverage_through_date] = coverageDatesFunction(
          this.thisYear,
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
      const fromControl = control.get('coverage_from_date');
      const throughControl = control.get('coverage_through_date');
      const surrounding = this.findSurrounding(fromControl?.value, throughControl?.value, existingCoverage);
      let fromError = this.validateDateWithinCoverage(existingCoverage, fromControl);
      let throughError = this.validateDateWithinCoverage(existingCoverage, throughControl);
      if (surrounding) {
        fromError = throughError = this.getCoverageOverlapError(surrounding);
      }
      fromControl?.setErrors(this.getErrors(fromControl.errors, fromError));
      throughControl?.setErrors(this.getErrors(throughControl.errors, throughError));
      fromControl?.markAsTouched();
      throughControl?.markAsTouched();
      return null;
    };
  }

  validateDateWithinCoverage(
    existingCoverage: F3xCoverageDates[],
    control: AbstractControl | null
  ): ValidationErrors | null {
    return existingCoverage.reduce((error: ValidationErrors | null, coverage) => {
      if (error) return error;
      return DateUtils.isWithin(control?.value, coverage.coverage_from_date, coverage.coverage_through_date)
        ? this.getCoverageOverlapError(coverage)
        : null;
    }, null);
  }

  getErrors(errors: ValidationErrors | null, newError: ValidationErrors | null): ValidationErrors | null {
    const otherErrors = !_.isEmpty(_.omit(errors, 'invaliddate')) ? _.omit(errors, 'invaliddate') : null;
    return otherErrors || newError ? { ...otherErrors, ...newError } : null;
  }

  findSurrounding(from: Date, through: Date, existingCoverage: F3xCoverageDates[]): F3xCoverageDates | undefined {
    return existingCoverage.find((coverage) => {
      const coverageFrom = coverage.coverage_from_date;
      const coverageThrough = coverage.coverage_through_date;
      return coverageFrom && coverageThrough && from <= coverageFrom && through >= coverageThrough;
    });
  }

  getCoverageOverlapError(collision: F3xCoverageDates): ValidationErrors {
    const message =
      `You have entered coverage dates that overlap ` +
      `the coverage dates of the following report: ${getReportCodeLabel(collision.report_code)} ` +
      ` ${this.fecDatePipe.transform(collision.coverage_from_date)} -` +
      ` ${this.fecDatePipe.transform(collision.coverage_through_date)}`;
    return { invaliddate: { msg: message } };
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

  public getUsedReportCodes(existingCoverage: F3xCoverageDates[]): F3xReportCodes[] {
    return existingCoverage.reduce((codes: F3xReportCodes[], coverage) => {
      const years = [coverage.coverage_from_date?.getFullYear(), coverage.coverage_through_date?.getFullYear()];
      if (years.includes(this.thisYear)) {
        return [...codes, coverage.report_code] as F3xReportCodes[];
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

  public save(jump: 'continue' | undefined = undefined) {
    this.formSubmitted = true;

    if (this.form.invalid) {
      return;
    }

    const summary: F3xReport = F3xReport.fromJSON(
      ValidateUtils.getFormValues(this.form, f3xSchema, this.formProperties)
    );

    // If a termination report, set the form_type appropriately.
    if (summary.report_code === F3xReportCodes.TER) {
      summary.form_type = F3xFormTypes.F3XT;
    }

    //Observables are *defined* here ahead of their execution
    const create$ = this.F3xReportService.create(summary, this.formProperties);
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
            this.router.navigateByUrl(`/reports/transactions/report/${report.id}/list`);
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
