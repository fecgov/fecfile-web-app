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
import { F3xCoverageDates, F3xFormTypes, Form3X } from 'app/shared/models/form-3x.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { Form3XService } from 'app/shared/services/form-3x.service';
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
import { schema as f1mSchema } from 'fecfile-validate/fecfile_validate_js/dist/F1M';
import { MessageService } from 'primeng/api';
import { combineLatest, map, of, startWith, switchMap, takeUntil, zip } from 'rxjs';
import { ReportService } from '../../../shared/services/report.service';
import * as _ from 'lodash';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { Form1M, COMMITTEE_TO_1M_FIELDS } from 'app/shared/models/form-1m.model';
import { Form1MService } from 'app/shared/services/form-1m.service';
import { FecApiService } from 'app/shared/services/fec-api.service';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';

@Component({
  selector: 'app-main-form',
  templateUrl: './main-form.component.html',
  styleUrls: ['./main-form.component.scss'],
})
export class MainFormComponent extends DestroyerComponent implements OnInit {
  formProperties: string[] = [
    'status_by',
    'form_type',
    'filer_committee_id_number',
    'committee_name',
    'street_1',
    'street_2',
    'city',
    'state',
    'zip',
    'email',
    'website',
    'committee_type',
    'treasurer_last_name',
    'treasurer_first_name',
  ];
  stateOptions: PrimeOptions = [];
  formSubmitted = false;
  form: FormGroup = this.fb.group(ValidateUtils.getFormGroupFields(this.formProperties));

  constructor(
    private store: Store,
    private fecDatePipe: FecDatePipe,
    private fb: FormBuilder,
    private form1MService: Form1MService,
    private fecApiService: FecApiService,
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

    this.store
      .select(selectCommitteeAccount)
      .pipe(takeUntil(this.destroy$))
      .subscribe((committeeAccount) => {
        Object.entries(COMMITTEE_TO_1M_FIELDS).forEach(([field, committeeField]) => {
          this.form.get(field)?.setValue(committeeAccount[committeeField as keyof CommitteeAccount]);
        });
      });
    this.stateOptions = LabelUtils.getPrimeOptions(StatesCodeLabels);

    ValidateUtils.addJsonSchemaValidators(this.form, f1mSchema, false);
  }

  public goBack() {
    this.router.navigateByUrl('/reports');
  }

  public save(jump: 'continue' | undefined = undefined) {
    this.formSubmitted = true;

    if (this.form.invalid) {
      return;
    }

    const form1M: Form1M = Form1M.fromJSON(ValidateUtils.getFormValues(this.form, f1mSchema, this.formProperties));

    const create$ = this.form1MService.create(form1M, this.formProperties);
  }
}
