import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { F3xCoverageDates, F3xFormTypes, F3xSummary } from 'app/shared/models/f3x-summary.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { F3xSummaryService } from 'app/shared/services/f3x-summary.service';
import { LabelUtils, PrimeOptions, StatesCodeLabels } from 'app/shared/utils/label.utils';
import {
  electionReportCodes,
  F3xReportCodes,
  F3X_REPORT_CODE_MAP,
  getReportCodeLabel,
  monthlyElectionYearReportCodes,
  monthlyNonElectionYearReportCodes,
  quarterlyElectionYearReportCodes,
  quarterlyNonElectionYearReportCodes
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
  public f3xCoverageDatesList: F3xCoverageDates[] | undefined;

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

    this.f3xSummaryService.getF3xCoverageDates().subscribe((dates) => {
      this.f3xCoverageDatesList = dates;
    });
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

    // Initialize validation tracking of current JSON schema and form data
    this.form.addValidators(this.buildCoverageDatesValidator());
  }

  /**
   * Checks if a field's date is within another report's dates or if
   * another report's dates fall within the form's "from" and "through" dates
   *
   * @param fieldDate {Date} the date of the field being checked
   * @param fromDate {Date} the form's "from" date
   * @param throughDate {Date} the form's "through" date
   * @param targetDate {F3xCoverageDates} the object whose date is being checked for an overlap
   * @returns true if there is an overlap in dates
   */
  checkForDateOverlap(fieldDate: Date, fromDate: Date, throughDate: Date, targetDate: F3xCoverageDates): boolean {
    return (targetDate &&
      targetDate.coverage_from_date &&
      targetDate.coverage_through_date &&
      //The form's date is between another report's from/through date
      ((fieldDate >= targetDate.coverage_from_date && fieldDate <= targetDate.coverage_through_date) ||
        //Another report's dates are inside the form's dates
        (fromDate <= targetDate.coverage_from_date &&
          throughDate >= targetDate.coverage_from_date &&
          fromDate <= targetDate.coverage_through_date &&
          throughDate >= targetDate.coverage_through_date))) as boolean;
  }

  buildCoverageDatesValidator(): ValidatorFn {
    /**
     * This is being used as a group validator, so it will always be called with a FormGroup
     * for the parameter, but addValidators() only takes a method that returns a ValidatorFn,
     * and a ValidatorFn must have parameters of AbstractControl or AbstractControl | FormGroup
     *
     * Additionally, a unit test is present to make sure that the constructed validator function
     * does not explode if passed an AbstractControl parameter.
     */
    return (toValidate: AbstractControl | FormGroup): null => {
      const group = toValidate as FormGroup;
      if (group.controls) {
        const fromDate = group.controls['coverage_from_date'];
        const throughDate = group.controls['coverage_through_date'];
        if (this.f3xCoverageDatesList) {
          for (const formValue of [fromDate, throughDate]) {
            const overlap = this.f3xCoverageDatesList.find((f3xCoverageDate) => {
              return this.checkForDateOverlap(formValue.value, fromDate.value, throughDate.value, f3xCoverageDate);
            });
            if (overlap) {
              this.setCoverageOverlapError(formValue, overlap);
            } else {
              const errors = formValue.errors;
              if (errors) {
                delete errors['invaliddate'];
                formValue.setErrors(errors);
              }
            }
          }
        }
      }
      return null;
    };
  }

  setCoverageOverlapError(formValue: AbstractControl, overlap: F3xCoverageDates) {
    const overlapLabel = getReportCodeLabel(overlap.report_code);
    const overlapFromDate = this.fecDatePipe.transform(overlap.coverage_from_date);
    const overlapThroughDate = this.fecDatePipe.transform(overlap.coverage_through_date);
    const errors = formValue.errors || {};
    errors['invaliddate'] = {
      msg:
        `You have entered coverage dates that overlap ` +
        `the coverage dates of the following report: ${overlapLabel} ` +
        ` ${overlapFromDate} - ${overlapThroughDate}`,
    };
    formValue.setErrors(errors);
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

    const summary: F3xSummary = F3xSummary.fromJSON(ValidateUtils.getFormValues(
      this.form, this.formProperties, f3xSchema));

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
