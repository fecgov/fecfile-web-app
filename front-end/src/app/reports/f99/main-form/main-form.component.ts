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
import { selectActiveReport } from 'app/store/active-report.selectors';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { environment } from 'environments/environment';
import { schema as f99Schema } from 'fecfile-validate/fecfile_validate_js/dist/F99';
import { MessageService } from 'primeng/api';
import { combineLatest, map, of, startWith, switchMap, takeUntil, zip } from 'rxjs';
import { ReportService } from '../../../shared/services/report.service';
import { selectCashOnHand } from '../../../store/cash-on-hand.selectors';
import * as _ from 'lodash';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { Form99 } from 'app/shared/models/form-99.model';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { TransactionTemplateMapType } from 'app/shared/models/transaction-type.model';

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

  constructor(
    private store: Store,
    private fecDatePipe: FecDatePipe,
    private fb: FormBuilder,
    private form3XService: Form3XService,
    private messageService: MessageService,
    protected router: Router,
    private activatedRoute: ActivatedRoute,
    private reportService: ReportService
  ) {
    super();
  }

  ngOnInit(): void {
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
    });
    console.log(committeeAccount);
  }

  save(doContinue?: string): void {
    return;
  }

  goBack(): void {
    return;
  }
}
