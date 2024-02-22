import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { schema as f99Schema } from 'fecfile-validate/fecfile_validate_js/dist/F99';
import { MessageService } from 'primeng/api';
import { Form99, textCodes } from 'app/shared/models/form-99.model';
import { TransactionTemplateMapType } from 'app/shared/models/transaction-type.model';
import { Form99Service } from 'app/shared/services/form-99.service';
import { Report } from 'app/shared/models/report.model';
import { MainFormBaseComponent } from 'app/reports/shared/main-form-base.component';

@Component({
  selector: 'app-main-form',
  templateUrl: './main-form.component.html',
})
export class MainFormComponent extends MainFormBaseComponent {
  formProperties: string[] = [
    'filer_committee_id_number',
    'committee_name',
    'street_1',
    'street_2',
    'city',
    'state',
    'zip',
    'text_code',
    'message_text',
  ];
  schema = f99Schema;
  webprintURL = '/reports/f99/web-print/';
  templateMap = {
    street_1: 'street_1',
    street_2: 'street_2',
    city: 'city',
    state: 'state',
    zip: 'zip',
  } as TransactionTemplateMapType;
  textCodes = textCodes;

  constructor(
    protected override store: Store,
    protected override fb: FormBuilder,
    protected override reportService: Form99Service,
    protected override messageService: MessageService,
    protected override router: Router,
    protected override activatedRoute: ActivatedRoute,
  ) {
    super(store, fb, reportService, messageService, router, activatedRoute);
  }

  getReportPayload(): Report {
    return Form99.fromJSON(SchemaUtils.getFormValues(this.form, this.schema, this.formProperties));
  }
}
