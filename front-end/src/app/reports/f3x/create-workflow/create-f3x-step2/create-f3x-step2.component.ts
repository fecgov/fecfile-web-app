import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { mergeMap, Observable, skipUntil, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { refreshCommitteeAccountDetailsAction } from '../../../../store/committee-account.actions';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { LabelUtils, PrimeOptions, StatesCodeLabels, CountryCodeLabels } from 'app/shared/utils/label.utils';
import { ValidateService } from 'app/shared/services/validate.service';
import { schema as f3xSchema } from 'fecfile-validate/fecfile_validate_js/dist/F3X';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { F3xSummaryService } from 'app/shared/services/f3x-summary.service';

@Component({
  selector: 'app-create-f3x-step2',
  templateUrl: './create-f3x-step2.component.html',
  styleUrls: ['./create-f3x-step2.component.scss'],
})
export class CreateF3xStep2Component implements OnInit, OnDestroy {
  report: F3xSummary | null = null;
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
  stateOptions: PrimeOptions = [];
  countryOptions: PrimeOptions = [];
  formSubmitted = false;
  destroy$: Subject<void> = new Subject();
  committeeAccount$: Observable<CommitteeAccount> | null = null;

  form: FormGroup = this.fb.group(this.validateService.getFormGroupFields(this.formProperties));

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private reportService: F3xSummaryService,
    private validateService: ValidateService,
    private fb: FormBuilder,
    private store: Store
  ) {}

  ngOnInit(): void {
    // Refresh committee account details whenever page loads
    this.store.dispatch(refreshCommitteeAccountDetailsAction());

    this.committeeAccount$ = this.store.select(selectCommitteeAccount).pipe(takeUntil(this.destroy$));
    this.stateOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);
    this.countryOptions = LabelUtils.getPrimeOptions(CountryCodeLabels);

    this.route.paramMap
      .pipe(
        takeUntil(this.destroy$),
        mergeMap((params): Observable<F3xSummary> => {
          const id: string = params.get('id') as string;
          return this.reportService.get(id);
        })
      )
      .subscribe((report: F3xSummary) => {
        this.report = report;
        this.form.patchValue({
          change_of_address: '',
          street_1: this.report.street_1,
          street_2: this.report.street_2,
          city: this.report.city,
          state: this.report.state,
          zip: this.report.zip,
          memo_checkbox: false,
          memo: '',
        });
      });

    // Initialize validation tracking of current JSON schema and form data
    this.validateService.formValidatorSchema = f3xSchema;
    this.validateService.formValidatorForm = this.form;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public save(jump: 'continue' | 'back' | null = null): void {
    this.formSubmitted = true;

    if (this.form.invalid) {
      return;
    }

    const payload: F3xSummary = F3xSummary.fromJSON({
      ...this.report,
      ...this.validateService.getFormValues(this.form),
    });

    this.reportService.update(payload, this.formProperties).subscribe(() => {
      if (jump === 'continue' && this.report?.id) {
        this.router.navigate([`/reports/f3x/create/step3/${this.report.id}`]);
      }
      if (jump === 'back' && this.report?.id) {
        this.router.navigate([`/reports/f3x/create/step1/${this.report.id}`]);
      }
    });
  }
}
