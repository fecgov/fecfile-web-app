import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { selectCashOnHand } from 'app/store/cash-on-hand.selectors';
import { LabelUtils, PrimeOptions, StatesCodeLabels, CountryCodeLabels } from 'app/shared/utils/label.utils';
import { ValidateService } from 'app/shared/services/validate.service';
import { schema as f3xSchema } from 'fecfile-validate/fecfile_validate_js/dist/F3X';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { F3xSummaryService } from 'app/shared/services/f3x-summary.service';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { CashOnHand } from 'app/shared/interfaces/report.interface';

@Component({
  selector: 'app-create-f3x-step2',
  templateUrl: './create-f3x-step2.component.html',
})
export class CreateF3xStep2Component implements OnInit, OnDestroy {
  formProperties: string[] = [
    'change_of_address',
    'street_1',
    'street_2',
    'city',
    'state',
    'zip',
    'memo_checkbox',
    'memo',
  ];
  report: F3xSummary | undefined;
  stateOptions: PrimeOptions = [];
  countryOptions: PrimeOptions = [];
  formSubmitted = false;
  destroy$: Subject<boolean> = new Subject<boolean>();
  committeeAccount$: Observable<CommitteeAccount> = this.store.select(selectCommitteeAccount);
  cashOnHand: CashOnHand = {
    report_id: null,
    value: null,
  };

  form: FormGroup = this.fb.group(this.validateService.getFormGroupFields(this.formProperties));

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
    this.stateOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);
    this.countryOptions = LabelUtils.getPrimeOptions(CountryCodeLabels);

    this.report = this.activatedRoute.snapshot.data['report'];
    this.store
      .select(selectCommitteeAccount)
      .pipe(takeUntil(this.destroy$))
      .subscribe((committeeAccount) => this.setDefaultFormValues(committeeAccount));
    this.store
      .select(selectCashOnHand)
      .pipe(takeUntil(this.destroy$))
      .subscribe((cashOnHand) => (this.cashOnHand = cashOnHand));

    // Initialize validation tracking of current JSON schema and form data
    this.validateService.formValidatorSchema = f3xSchema;
    this.validateService.formValidatorForm = this.form;
  }

  setDefaultFormValues(committeeAccount: CommitteeAccount) {
    this.form.patchValue({
      change_of_address: this.report?.change_of_address !== null ? this.report?.change_of_address : null,
      street_1: this.report?.street_1 ? this.report.street_1 : committeeAccount?.street_1,
      street_2: this.report?.street_2 ? this.report.street_2 : committeeAccount?.street_2,
      city: this.report?.city ? this.report.city : committeeAccount?.city,
      state: this.report?.state ? this.report.state : committeeAccount?.state,
      zip: this.report?.zip ? this.report.zip : committeeAccount?.zip,
      memo_checkbox: false,
      memo: '',
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public save(jump: 'continue' | 'back' | null = null): void {
    this.formSubmitted = true;

    if (this.form.invalid) {
      return;
    }

    const payload: F3xSummary = F3xSummary.fromJSON({
      ...this.report,
      ...this.validateService.getFormValues(this.form, this.formProperties),
    });

    this.f3xSummaryService.update(payload, this.formProperties).subscribe(() => {
      if (jump === 'continue' && this.report?.id) {
        if (this.cashOnHand.report_id === this.report.id) {
          this.router.navigateByUrl(`/reports/f3x/create/cash-on-hand/${this.report.id}`);
        } else {
          this.router.navigateByUrl(`/transactions/report/${this.report.id}/list`);
        }
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
