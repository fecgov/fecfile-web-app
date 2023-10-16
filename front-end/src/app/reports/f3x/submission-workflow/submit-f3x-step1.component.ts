import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { Form3X } from 'app/shared/models/form-3x.model';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { CountryCodeLabels, LabelUtils, PrimeOptions, StatesCodeLabels } from 'app/shared/utils/label.utils';
import { ValidateUtils } from 'app/shared/utils/validate.utils';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { schema as f3xSchema } from 'fecfile-validate/fecfile_validate_js/dist/F3X';
import { MessageService } from 'primeng/api';
import { Observable, takeUntil } from 'rxjs';

@Component({
  selector: 'app-submit-f3x-step1',
  templateUrl: './submit-f3x-step1.component.html',
})
export class SubmitF3xStep1Component extends DestroyerComponent implements OnInit {
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
  report?: Form3X;
  stateOptions: PrimeOptions = [];
  countryOptions: PrimeOptions = [];
  formSubmitted = false;
  committeeAccount$: Observable<CommitteeAccount> = this.store.select(selectCommitteeAccount);
  form: FormGroup = this.fb.group(ValidateUtils.getFormGroupFields(this.formProperties));

  constructor(
    public router: Router,
    private form3XService: Form3XService,
    private fb: FormBuilder,
    private store: Store,
    private messageService: MessageService
  ) {
    super();
  }

  ngOnInit(): void {
    this.stateOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);
    this.countryOptions = LabelUtils.getPrimeOptions(CountryCodeLabels);
    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => {
        this.report = report;
      });
    this.store
      .select(selectCommitteeAccount)
      .pipe(takeUntil(this.destroy$))
      .subscribe((committeeAccount) => this.setDefaultFormValues(committeeAccount));

    // Initialize validation tracking of current JSON schema and form data
    this.form.controls['confirmation_email_1'].addValidators([
      Validators.required,
      Validators.maxLength(44),
      this.buildEmailValidator('confirmation_email_1'),
    ]);
    this.form.controls['confirmation_email_2'].addValidators([
      Validators.maxLength(44),
      this.buildEmailValidator('confirmation_email_2'),
    ]);

    ValidateUtils.addJsonSchemaValidators(this.form, f3xSchema, false);
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
      change_of_address: this.report?.change_of_address ?? false,
      confirmation_email_1: this.report?.confirmation_email_1 ?? committeeAccount?.email,
      confirmation_email_2: this.report?.confirmation_email_2 ?? undefined,
    });
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

    return matches === null || matches.length == 0;
  }

  public checkIdenticalEmails(): boolean {
    const email_1 = this.form?.get('confirmation_email_1')?.value;
    const email_2 = this.form?.get('confirmation_email_2')?.value;

    return !!email_1 && email_1 === email_2;
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
        ...ValidateUtils.getFormValues(this.form, f3xSchema, this.formProperties),
      };
    }

    const payload: Form3X = Form3X.fromJSON({
      ...this.report,
      ...addressFields,
      confirmation_email_1: this.form.value.confirmation_email_1,
      confirmation_email_2: this.form.value.confirmation_email_2,
    });

    this.form3XService.update(payload, this.formProperties).subscribe(() => {
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
