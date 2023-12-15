import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  ValidationErrors,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { DateUtils } from 'app/shared/utils/date.utils';
import { LabelUtils, PrimeOptions, StatesCodeLabels } from 'app/shared/utils/label.utils';
import { ValidateUtils } from 'app/shared/utils/validate.utils';
import { selectActiveForm3X } from 'app/store/active-report.selectors';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { environment } from 'environments/environment';
import { schema as f99Schema } from 'fecfile-validate/fecfile_validate_js/dist/F99';
import { MessageService } from 'primeng/api';
import { Observable, combineLatest, map, of, startWith, switchMap, takeUntil, zip } from 'rxjs';
import { ReportService } from '../../../shared/services/report.service';
import { selectCashOnHand } from '../../../store/cash-on-hand.selectors';
import * as _ from 'lodash';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { F99FormTypes, Form99 } from 'app/shared/models/form-99.model';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { TransactionTemplateMapType } from 'app/shared/models/transaction-type.model';
import { Form99Service } from 'app/shared/services/form-99.service';
import { Report } from 'app/shared/models/report.model';

@Component({
  selector: 'app-main-form',
  templateUrl: './main-form.component.html',
  styleUrls: ['../../styles.scss'],
})
export class MainFormComponent extends DestroyerComponent implements OnInit {
  formProperties: string[] = [
    'form_type',
    'filer_committee_id_number',
    'committee_name',
    'street_1',
    'street_2',
    'city',
    'state',
    'zip',
    'date_signed',
    'text_code',
    'text_message',
  ];
  formSubmitted = false;
  textCodes = [
    {
      label: 'Disavowal Response',
      value: 'MSI',
    },
    {
      label: 'Filing Frequency Change Notice',
      value: 'MSM',
    },
    {
      label: 'Miscellaneous Report to the FEC',
      value: 'MST',
    },
  ];
  templateMap = {
    street_1: 'street_1',
    street_2: 'street_2',
    city: 'city',
    state: 'state',
    zip: 'zip',
  } as TransactionTemplateMapType;

  form: FormGroup = this.fb.group(ValidateUtils.getFormGroupFields(this.formProperties));
  reportId: string | undefined;

  constructor(
    private store: Store,
    private fecDatePipe: FecDatePipe,
    private fb: FormBuilder,
    private form99Service: Form99Service,
    private messageService: MessageService,
    protected router: Router,
    private activatedRoute: ActivatedRoute,
    private reportService: ReportService
  ) {
    super();
  }

  ngOnInit(): void {
    this.reportId = this.activatedRoute.snapshot.params['reportId'];
    this.store
      .select(selectActiveForm3X)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => {
        if (this.reportId && report) {
          this.form.patchValue(report);
        }
      });

    this.store
      .select(selectCommitteeAccount)
      .pipe(takeUntil(this.destroy$))
      .subscribe((committeeAccount) => this.setDefaultFormValues(committeeAccount));

    ValidateUtils.addJsonSchemaValidators(this.form, f99Schema, false);
  }

  setDefaultFormValues(committeeAccount: CommitteeAccount) {
    this.form.patchValue({
      street_1: committeeAccount.street_1,
      street_2: committeeAccount.street_2,
      city: committeeAccount.city,
      state: committeeAccount.state,
      zip: committeeAccount.zip,
      filer_committee_id_number: committeeAccount.committee_id,
      committee_name: committeeAccount.name,
      form_type: F99FormTypes.F99,
    });
  }

  public goBack() {
    this.router.navigateByUrl('/reports');
  }

  public save(jump: 'continue' | undefined = undefined) {
    this.formSubmitted = true;

    if (this.form.invalid) {
      return;
    }

    const summary: Form99 = Form99.fromJSON(ValidateUtils.getFormValues(this.form, f99Schema, this.formProperties));
    let save$: Observable<Report>;
    if (this.reportId) {
      summary.id = this.reportId;
      save$ = this.form99Service.update(summary, this.formProperties);
    } else {
      save$ = this.form99Service.create(summary, this.formProperties);
    }

    //Observables are *defined* here ahead of their execution

    //Create the report, update cashOnHand based on all reports, and then retrieve cashOnHand in that order
    save$.pipe(takeUntil(this.destroy$)).subscribe((report) => {
      if (jump === 'continue') {
        //this.router.navigateByUrl(`/reports/f99/web-print/${report.id}`);
        this.router.navigateByUrl('/reports');
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
