import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  electionReportCodes,
  F3xCoverageDates,
  F3xFormTypes,
  F3xReportCode,
  F3xReportCodes,
  F3xSummary,
  monthlyElectionYearReportCodes,
  monthlyNonElectionYearReportCodes,
  quarterlyElectionYearReportCodes,
  quarterlyNonElectionYearReportCodes,
} from 'app/shared/models/f3x-summary.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { F3xSummaryService } from 'app/shared/services/f3x-summary.service';
import { ValidateService } from 'app/shared/services/validate.service';
import { f3xReportCodeDetailedLabels, LabelUtils, PrimeOptions, StatesCodeLabels } from 'app/shared/utils/label.utils';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { environment } from 'environments/environment';
import { schema as f3xSchema } from 'fecfile-validate/fecfile_validate_js/dist/F3X';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { LabelList } from '../../../shared/utils/label.utils';

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

  form: FormGroup = this.fb.group(this.validateService.getFormGroupFields(this.formProperties));

  readonly F3xReportTypeCategories = F3xReportTypeCategories;
  private f3xCoverageDatesList: F3xCoverageDates[] | undefined;

  public f3xReportCodeDetailedLabels: LabelList = f3xReportCodeDetailedLabels;

  constructor(
    private store: Store,
    private validateService: ValidateService,
    private fecDatePipe: FecDatePipe,
    private fb: FormBuilder,
    private f3xSummaryService: F3xSummaryService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute,
    protected router: Router
  ) {}

  ngOnInit(): void {
    const report: F3xSummary = this.activatedRoute.snapshot.data['report'];
    this.store
      .select(selectCommitteeAccount)
      .pipe(takeUntil(this.destroy$))
      .subscribe((committeeAccount) => {
        const filingFrequency = this.userCanSetFilingFrequency ? 'Q' : committeeAccount.filing_frequency;
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
        if (report) {
          this.form.patchValue(report);
        }
      });
    this.stateOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);

    this.f3xSummaryService.getF3xCoverageDates().subscribe((dates) => {
      this.f3xCoverageDatesList = dates;
    });
    this.form.controls['coverage_from_date'].addValidators(this.buildCoverageDatesValidator('coverage_from_date'));
    this.form.controls['coverage_through_date'].addValidators(
      this.buildCoverageDatesValidator('coverage_through_date')
    );

    // Initialize validation tracking of current JSON schema and form data
    this.validateService.formValidatorSchema = f3xSchema;
    this.validateService.formValidatorForm = this.form;
  }

  buildCoverageDatesValidator(valueFormControlName: string): ValidatorFn {
    return (): ValidationErrors | null => {
      let result: ValidationErrors | null = null;
      const formValue: Date = this.form?.get(valueFormControlName)?.value;
      if (this.f3xCoverageDatesList && formValue) {
        const retval = this.f3xCoverageDatesList.find((f3xCoverageDate) => {
          return (
            f3xCoverageDate &&
            f3xCoverageDate.coverage_from_date &&
            f3xCoverageDate.coverage_through_date &&
            formValue >= f3xCoverageDate.coverage_from_date &&
            formValue <= f3xCoverageDate.coverage_through_date
          );
        });
        result = this.getCoverageDatesValidator(retval);
      }
      return result;
    };
  }

  getCoverageDatesValidator(f3xCoverageDates?: F3xCoverageDates) {
    let retval: ValidationErrors | null = null;
    if (f3xCoverageDates) {
      const f3xReportCodeLabel = f3xReportCodeDetailedLabels.find((label) => label[0] === f3xCoverageDates.report_code);
      const reportCodeLabel = f3xReportCodeLabel
        ? f3xReportCodeLabel[1] || f3xCoverageDates.report_code?.valueOf
        : 'invalid name';
      const coverageFromDate = this.fecDatePipe.transform(f3xCoverageDates.coverage_from_date);
      const coverageThroughDate = this.fecDatePipe.transform(f3xCoverageDates.coverage_through_date);
      retval = {};
      retval['invaliddate'] = {
        msg:
          `You have entered coverage dates that overlap ` +
          `the coverage dates of the following report: ${reportCodeLabel} ` +
          ` ${coverageFromDate} - ${coverageThroughDate}`,
      };
    }
    return retval;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public getReportTypeCategories(): F3xReportTypeCategoryType[] {
    return [F3xReportTypeCategories.ELECTION_YEAR, F3xReportTypeCategories.NON_ELECTION_YEAR];
  }

  public getReportCodes(): F3xReportCode[] {
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

  public save(jump: 'continue' | null = null) {
    this.formSubmitted = true;

    if (this.form.invalid) {
      return;
    }

    const summary: F3xSummary = F3xSummary.fromJSON(this.validateService.getFormValues(this.form, this.formProperties));

    // If a termination report, set the form_type appropriately.
    if (summary.report_code === F3xReportCodes.TER) {
      summary.form_type = F3xFormTypes.F3XT;
    }

    this.f3xSummaryService.create(summary, this.formProperties).subscribe((report: F3xSummary) => {
      if (jump === 'continue') {
        this.router.navigateByUrl(`/reports/f3x/create/step2/${report.id}`);
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
