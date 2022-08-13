import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { LabelUtils, PrimeOptions, StatesCodeLabels, CountryCodeLabels } from 'app/shared/utils/label.utils';
import { ValidateService } from 'app/shared/services/validate.service';
import { schema as f3xSchema } from 'fecfile-validate/fecfile_validate_js/dist/F3X';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { F3xSummaryService } from 'app/shared/services/f3x-summary.service';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { ReportCodeLabelList } from '../../../shared/utils/reportCodeLabels.utils';
import { updateLabelLookupAction } from '../../../store/label-lookup.actions';
import { selectReportCodeLabelList } from 'app/store/label-lookup.selectors';
import { f3xReportCodeDetailedLabels } from '../../../shared/utils/label.utils';

@Component({
  selector: 'app-submit-f3x-step1',
  templateUrl: './submit-f3x-step1.component.html',
})
export class SubmitF3xStep1Component implements OnInit, OnDestroy {
  formProperties: string[] = [
    'confirmation_email_1',
    'confirmation_email_2',
    'change_of_address',
    'street_1',
    'street_2',
    'city',
    'state',
    'zip',
  ];
  report: F3xSummary | undefined;
  report_code = '';
  stateOptions: PrimeOptions = [];
  countryOptions: PrimeOptions = [];
  formSubmitted = false;
  destroy$: Subject<boolean> = new Subject<boolean>();
  committeeAccount$: Observable<CommitteeAccount> = this.store.select(selectCommitteeAccount);
  reportCodeLabelList$: Observable<ReportCodeLabelList> = new Observable<ReportCodeLabelList>();
  form: FormGroup = this.fb.group(this.validateService.getFormGroupFields(this.formProperties));
  f3xReportCodeDetailedLabels = f3xReportCodeDetailedLabels;

  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private f3xSummaryService: F3xSummaryService,
    private validateService: ValidateService,
    private fb: FormBuilder,
    private store: Store,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.stateOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);
    this.countryOptions = LabelUtils.getPrimeOptions(CountryCodeLabels);
    this.report = this.activatedRoute.snapshot.data['report'];
    this.report_code = this.report?.report_code || '';
    this.store
      .select(selectCommitteeAccount)
      .pipe(takeUntil(this.destroy$))
      .subscribe((committeeAccount) => this.setDefaultFormValues(committeeAccount));

    this.reportCodeLabelList$ = this.store.select<ReportCodeLabelList>(selectReportCodeLabelList);
    this.store.dispatch(updateLabelLookupAction());

    // Initialize validation tracking of current JSON schema and form data
    this.validateService.formValidatorSchema = f3xSchema;
    this.validateService.formValidatorForm = this.form;
    this.form.controls['confirmation_email_1'].addValidators([
      Validators.required,
      Validators.maxLength(44),
      this.buildEmailValidator('confirmation_email_1'),
    ]);
    this.form.controls['confirmation_email_2'].addValidators([
      Validators.maxLength(44),
      this.buildEmailValidator('confirmation_email_2'),
    ]);
  }

  setDefaultFormValues(committeeAccount: CommitteeAccount) {
    const reportHasAddress = this.report?.street_1;
    const addressSource = reportHasAddress ? this.report : committeeAccount;
    this.form.patchValue({
      street_1: addressSource?.street_1,
      street_2: addressSource?.street_2,
      city: addressSource?.city,
      state: addressSource?.state,
      zip: addressSource?.zip,
    });

    this.form.patchValue({
      change_of_address: this.report?.change_of_address !== null ? this.report?.change_of_address : false,
      confirmation_email_1:
        this.report?.confirmation_email_1 !== null ? this.report?.confirmation_email_1 : committeeAccount?.email,
      confirmation_email_2: this.report?.confirmation_email_2 !== null ? this.report?.confirmation_email_2 : null,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public buildEmailValidator(valueFormControlName: string): ValidatorFn {
    return (): ValidationErrors | null => {
      const email: string = this.form?.get(valueFormControlName)?.value;

      if (this.checkInvalidEmail(email)) {
        return { email: 'invalid' };
      }

      if (this.checkIdenticalEmails()) {
        return { email: 'identical' };
      }

      return null;
    };
  }

  public checkInvalidEmail(email: string): boolean {
    const matches = email?.match(/^\S+@\S+\.\S{2,}/g);
    if (!email || email.length == 0) return false; //An empty email should be caught by the required validator

    return matches == null || matches.length == 0;
  }

  public checkIdenticalEmails(): boolean {
    const email_1 = this.form?.get('confirmation_email_1')?.value;
    const email_2 = this.form?.get('confirmation_email_2')?.value;

    return email_1 != null && email_1.length > 0 && email_1 === email_2;
  }

  public save(): void {
    this.formSubmitted = true;

    if (this.form.invalid) {
      return;
    }

    let addressFields: object;
    if (this.form.value.change_of_address === false) {
      addressFields = {
        change_of_address: false,
        city: null,
        street_1: null,
        street_2: null,
        state: null,
        zip: null,
      };
    } else {
      addressFields = {
        change_of_address: true,
        ...this.validateService.getFormValues(this.form, this.formProperties),
      };
    }

    const payload: F3xSummary = F3xSummary.fromJSON({
      ...this.report,
      ...addressFields,
      confirmation_email_1: this.form.value.confirmation_email_1,
      confirmation_email_2: this.form.value.confirmation_email_2,
    });

    this.f3xSummaryService.update(payload, this.formProperties).subscribe(() => {
      if (this.report?.id) {
        this.router.navigateByUrl(`/reports/f3x/submit/step2/${this.report.id}`);
      }

      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Report Updated',
        life: 3000,
      });
    });
  }
}
