import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MainFormBaseComponent } from 'app/reports/shared/main-form-base.component';
import { Form99, textCodes, filingFrequencies } from 'app/shared/models/form-99.model';
import { Report } from 'app/shared/models/report.model';
import { TransactionTemplateMapType } from 'app/shared/models/transaction-type.model';
import { Form99Service } from 'app/shared/services/form-99.service';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { schema as f99Schema } from 'fecfile-validate/fecfile_validate_js/dist/F99';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ErrorMessagesComponent } from '../../../shared/components/error-messages/error-messages.component';
import { AddressInputComponent } from '../../../shared/components/inputs/address-input/address-input.component';
import { SaveCancelComponent } from '../../../shared/components/save-cancel/save-cancel.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButton } from 'primeng/selectbutton';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';

@Component({
  selector: 'app-main-form',
  templateUrl: './main-form.component.html',
  styleUrl: './main-form.component.scss',
  imports: [
    ReactiveFormsModule,
    InputText,
    ErrorMessagesComponent,
    AddressInputComponent,
    Select,
    SaveCancelComponent,
    TextareaModule,
    RadioButtonModule,
    SelectButton,
  ],
  providers: [Form99Service],
})
export class MainFormComponent extends MainFormBaseComponent {
  protected override reportService = inject(Form99Service);
  protected canSetFilingFrequency = true;
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
    'filing_frequency',
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
  readonly filingFrequencies = filingFrequencies;

  getReportPayload(): Report {
    return Form99.fromJSON(SchemaUtils.getFormValues(this.form, this.schema, this.formProperties));
  }

  override saveHook() {
    const filingFrequency = this.form.get('filing_frequency');
    if (filingFrequency != null) {
      // (filingFrequency as SubscriptionFormControl).valid = true;
      this.form.get('filing_frequency')?.updateValueAndValidity();
      this.form.updateValueAndValidity();
    }
  }
}
