import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  electionReportCodes,
  F3xReportCodes,
  monthlyElectionYearReportCodes,
  monthlyNonElectionYearReportCodes,
  quarterlyElectionYearReportCodes,
  quarterlyNonElectionYearReportCodes,
  quarterlySpecialReportCodes,
} from 'app/shared/models/f3x-summary.model';
import { F3xReportCode } from 'app/shared/models/f3x-summary.model';
import { LabelList, LabelUtils, PrimeOptions, StatesCodeLabels } from 'app/shared/utils/label.utils';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { ValidateService } from 'app/shared/services/validate.service';
import { schema as f3xSchema } from 'fecfile-validate/fecfile_validate_js/dist/F3X';
import { Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-create-report-step1',
  styleUrls: ['./create-report-step1.component.scss'],
  templateUrl: './create-report-step1.component.html',
})
export class CreateReportStep1Component implements OnInit, OnDestroy {
  private destroy$ = new Subject();
  formProperties: string[] = [
    'filing_frequency',
    'report_type_category',
    'report_code',
    'coverage_from_date',
    'coverage_through_date',
    'date_of_election',
    'state_of_election',
  ];
  userCanSetFilingFrequency: boolean = environment.userCanSetFilingFrequency;
  stateOptions: PrimeOptions = [];
  formSubmitted = false;

  form: FormGroup = this.fb.group(this.validateService.getFormGroupFields(this.formProperties));

  f3xReportCodeLabels: LabelList = [
    [F3xReportCodes.Q1, 'APRIL 15 QUARTERLY REPORT (Q1)'],
    [F3xReportCodes.Q2, 'JULY 15 QUARTERLY REPORT (Q2)'],
    [F3xReportCodes.Q3, 'OCTOBER 15 QUARTERLY REPORT(Q3)'],
    [F3xReportCodes.YE, 'JANUARY 31 YEAR-END (YE)'],
    [F3xReportCodes.TER, 'TERMINATION REPORT (TER)'],
    [F3xReportCodes.MY, 'JULY 31 MID-YEAR REPORT (NON-ELECTION YEAR ONLY) (MY)'],
    [F3xReportCodes.TwelveG, '12-DAY PRE-ELECTION GENERAL (12G)'],
    [F3xReportCodes.TwelveP, '12-DAY PRE-ELECTION PRIMARY (12P)'],
    [F3xReportCodes.TwelveR, '12-DAY PRE-ELECTION RUNOFF (12R)'],
    [F3xReportCodes.TwelveS, '12-DAY PRE-ELECTION SPECIAL (12S)'],
    [F3xReportCodes.TwelveC, '12-DAY PRE-ELECTION CONVENTION (12C)'],
    [F3xReportCodes.ThirtyG, '30-DAY POST-ELECTION GENERAL (30G)'],
    [F3xReportCodes.ThirtyR, '30-DAY POST-ELECTION RUNOFF (30R)'],
    [F3xReportCodes.ThirtyS, '30-DAY POST-ELECTION SPECIAL (30S)'],
    [F3xReportCodes.M2, 'FEBRUARY 20 MONTHLY REPORT (M2)'],
    [F3xReportCodes.M3, 'MARCH 20 MONTHLY REPORT (M3)'],
    [F3xReportCodes.M4, 'APRIL 20 MONTHLY REPORT (M4)'],
    [F3xReportCodes.M5, 'MAY 20 MONTHLY REPORT (M5))'],
    [F3xReportCodes.M6, 'JUNE 20 MONTHLY REPORT (M6)'],
    [F3xReportCodes.M7, 'JULY 20 MONTHLY REPORT (M7)'],
    [F3xReportCodes.M8, 'AUGUST 20 MONTHLY REPORT (M8)'],
    [F3xReportCodes.M9, 'SEPTEMBER 20 MONTHLY REPORT (M9)'],
    [F3xReportCodes.M10, 'OCTOBER 20 MONTHLY REPORT (M10)'],
    [F3xReportCodes.M11, 'NOVEMBER 20 MONTHLY REPORT (M11)'],
    [F3xReportCodes.M12, 'DECEMBER 20 MONTHLY REPORT (M12)'],
  ];

  readonly F3xReportTypeCategories = F3xReportTypeCategories;

  constructor(private store: Store, private validateService: ValidateService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.store
      .select(selectCommitteeAccount)
      .pipe(takeUntil(this.destroy$))
      .subscribe((committeeAccount) => {
        const filingFrequency = this.userCanSetFilingFrequency ? 'Q' : committeeAccount.filing_frequency;
        this.form.addControl('filing_frequency', new FormControl());
        this.form.addControl('report_type_category', new FormControl());
        this.form?.patchValue({ filing_frequency: filingFrequency });
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

    // Initialize validation tracking of current JSON schema and form data
    this.validateService.formValidatorSchema = f3xSchema;
    this.validateService.formValidatorForm = this.form;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public getReportTypeCategories(): F3xReportTypeCategoryType[] {
    if (this.form?.get('filing_frequency')?.value === 'M') {
      return [F3xReportTypeCategories.ELECTION_YEAR, F3xReportTypeCategories.NON_ELECTION_YEAR];
    }
    return [
      F3xReportTypeCategories.ELECTION_YEAR,
      F3xReportTypeCategories.NON_ELECTION_YEAR,
      F3xReportTypeCategories.SPECIAL,
    ];
  }

  public getReportCodes(): F3xReportCode[] {
    const isMonthly = this.form?.get('filing_frequency')?.value === 'M';
    switch (this.form.get('report_type_category')?.value) {
      case F3xReportTypeCategories.ELECTION_YEAR:
        return isMonthly ? monthlyElectionYearReportCodes : quarterlyElectionYearReportCodes;
      case F3xReportTypeCategories.NON_ELECTION_YEAR:
        return isMonthly ? monthlyNonElectionYearReportCodes : quarterlyNonElectionYearReportCodes;
      case F3xReportTypeCategories.SPECIAL:
        return isMonthly ? [] : quarterlySpecialReportCodes;
      default:
        return [];
    }
  }

  public isElectionReport() {
    return electionReportCodes.includes(this.form.get('report_code')?.value);
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
