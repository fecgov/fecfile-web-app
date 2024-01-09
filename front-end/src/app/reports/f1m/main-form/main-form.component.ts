import { Component, OnInit } from '@angular/core';
import { FormBuilder, AbstractControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ValidateUtils } from 'app/shared/utils/validate.utils';
import { schema as f1mSchema } from 'fecfile-validate/fecfile_validate_js/dist/F1M';
import { MessageService } from 'primeng/api';
import { Form1M } from 'app/shared/models/form-1m.model';
import { TransactionTemplateMapType } from 'app/shared/models/transaction-type.model';
import { Form1MService } from 'app/shared/services/form-1m.service';
import { Report } from 'app/shared/models/report.model';
import { MainFormBaseComponent } from 'app/reports/shared/main-form-base.component';
import { PrimeOptions, LabelUtils } from 'app/shared/utils/label.utils';
import { ContactTypeLabels, ContactTypes } from 'app/shared/models/contact.model';

@Component({
  selector: 'app-main-form',
  templateUrl: './main-form.component.html',
})
export class MainFormComponent extends MainFormBaseComponent implements OnInit {
  formProperties: string[] = [
    'status_by',
    'filer_committee_id_number',
    'committee_name',
    'street_1',
    'street_2',
    'city',
    'state',
    'zip',
    'committee_type',
    'affiliated_date_form_f1_filed',
    'affiliated_committee_fec_id',
    'affiliated_committee_name',
  ];
  schema = f1mSchema;
  webprintURL = '/reports/f1m/web-print/';
  templateMap = {
    street_1: 'street_1',
    street_2: 'street_2',
    city: 'city',
    state: 'state',
    zip: 'zip',
  } as TransactionTemplateMapType;

  statusByControl: AbstractControl | null = null;
  committeeTypeControl: AbstractControl | null = null;
  contactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.COMMITTEE]);

  constructor(
    protected override store: Store,
    protected override fb: FormBuilder,
    protected override reportService: Form1MService,
    protected override messageService: MessageService,
    protected override router: Router,
    protected override activatedRoute: ActivatedRoute
  ) {
    super(store, fb, reportService, messageService, router, activatedRoute);
  }

  getReportPayload(): Report {
    return Form1M.fromJSON(ValidateUtils.getFormValues(this.form, this.schema, this.formProperties));
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.statusByControl = this.form.get('status_by');
    this.statusByControl?.addValidators(Validators.required);
    this.committeeTypeControl = this.form.get('committee_type');
  }

  contactTypeSelected($event: any) {
    alert('here');
  }

  updateFormWithPrimaryContact($event: any) {
    alert('there');
  }
}
