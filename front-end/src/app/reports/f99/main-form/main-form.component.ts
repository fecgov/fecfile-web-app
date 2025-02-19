import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { schema as f99Schema } from 'fecfile-validate/fecfile_validate_js/dist/F99';
import { Form99, textCodes } from 'app/shared/models/form-99.model';
import { TransactionTemplateMapType } from 'app/shared/models/transaction-type.model';
import { Report } from 'app/shared/models/report.model';
import { MainFormBaseComponent } from 'app/reports/shared/main-form-base.component';
import { InputText } from 'primeng/inputtext';
import { ErrorMessagesComponent } from '../../../shared/components/error-messages/error-messages.component';
import { AddressInputComponent } from '../../../shared/components/inputs/address-input/address-input.component';
import { Select } from 'primeng/select';
import { SaveCancelComponent } from '../../../shared/components/save-cancel/save-cancel.component';
import { TextareaModule } from 'primeng/textarea';
import { Form99Service } from 'app/shared/services/form-99.service';

@Component({
  selector: 'app-main-form',
  templateUrl: './main-form.component.html',
  imports: [
    ReactiveFormsModule,
    InputText,
    ErrorMessagesComponent,
    AddressInputComponent,
    Select,
    SaveCancelComponent,
    TextareaModule,
  ],
  providers: [Form99Service],
})
export class MainFormComponent extends MainFormBaseComponent {
  protected override reportService = inject(Form99Service);
  readonly formProperties: string[] = [
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
  readonly schema = f99Schema;
  readonly webprintURL = '/reports/f99/web-print/';
  readonly templateMap = {
    street_1: 'street_1',
    street_2: 'street_2',
    city: 'city',
    state: 'state',
    zip: 'zip',
  } as TransactionTemplateMapType;
  readonly textCodes = textCodes;

  getReportPayload(): Report {
    return Form99.fromJSON(SchemaUtils.getFormValues(this.form, this.schema, this.formProperties));
  }
}
