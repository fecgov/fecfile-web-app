import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { refreshCommitteeAccountDetailsAction } from '../../../store/committee-account.actions';
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
  styleUrls: ['./submit-f3x-step1.component.scss'],
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
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private f3xSummaryService: F3xSummaryService,
    private validateService: ValidateService,
    private fb: FormBuilder,
    private store: Store,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    // Refresh committee account details whenever page loads
    this.store.dispatch(refreshCommitteeAccountDetailsAction());
    this.stateOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);
    this.countryOptions = LabelUtils.getPrimeOptions(CountryCodeLabels);

    this.report = this.activatedRoute.snapshot.data['report'];
    if (this.report?.report_code) {
      if (this.report?.report_code?.length > 0) {
        this.report_code = this.report.report_code;
      }
    } else {
      this.report_code = '';
    }
    this.store
      .select(selectCommitteeAccount)
      .pipe(takeUntil(this.destroy$))
      .subscribe((committeeAccount) => this.setDefaultFormValues(committeeAccount));

    this.reportCodeLabelList$ = this.store.select<ReportCodeLabelList>(selectReportCodeLabelList);
    this.store.dispatch(updateLabelLookupAction());

    // Initialize validation tracking of current JSON schema and form data
    this.validateService.formValidatorSchema = f3xSchema;
    this.validateService.formValidatorForm = this.form;
    this.form.controls['confirmation_email_1'].addValidators(this.buildEmailValidator('confirmation_email_1'));
    this.form.controls['confirmation_email_2'].addValidators(this.buildEmailValidator('confirmation_email_2'));
  }

  setDefaultFormValues(committeeAccount: CommitteeAccount) {
    this.form.patchValue({
      change_of_address: this.report?.change_of_address !== null ? this.report?.change_of_address : false,
      street_1: this.report?.street_1 ? this.report.street_1 : committeeAccount?.street_1,
      street_2: this.report?.street_2 ? this.report.street_2 : committeeAccount?.street_2,
      city: this.report?.city ? this.report.city : committeeAccount?.city,
      state: this.report?.state ? this.report.state : committeeAccount?.state,
      zip: this.report?.zip ? this.report.zip : committeeAccount?.zip,
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

      if (email?.length === 0 && valueFormControlName === 'confirmation_email_1') {
        return { required: true };
      }
      if (email?.length > 44) {
        return { maxlength: { requiredLength: 44 } };
      }

      const matches = email?.match(/^\S+@\S+\.\S{2,}/g);
      if (email?.length > 0) {
        if (!matches || matches.length == 0) {
          return { invalidemail: true };
        }
      }

      if (this.identicalEmails()) {
        return { identicalemail: true };
      }

      return null;
    };
  }

  public identicalEmails(): boolean {
    const email_1 = this.form?.get('confirmation_email_1')?.value;
    const email_2 = this.form?.get('confirmation_email_2')?.value;

    return email_1 != null && email_1.length > 0 && email_1 === email_2;
  }

  public save(jump: 'continue' | 'back' | null = null): void {
    this.formSubmitted = true;

    console.log(this.report);

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
      if (jump === 'continue' && this.report?.id) {
        this.router.navigateByUrl(`/reports/f3x/create/step3/${this.report.id}`);
      }
      if (jump === 'back' && this.report?.id) {
        this.router.navigateByUrl('/reports');
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
