import { Component, inject, OnInit } from '@angular/core';
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
import { environment } from 'environments/environment';

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
export class MainFormComponent extends MainFormBaseComponent implements OnInit {
  protected override reportService = inject(Form99Service);
  protected showFilingFrequency = environment.fecSpec == '8.5';
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

  override ngOnInit(): void {
    super.ngOnInit();

    // If we're not showing filing frequency by default, show it if it would be required
    if (!this.showFilingFrequency) {
      const textCodeField = this.form.get('text_code') as SubscriptionFormControl;
      textCodeField.addSubscription((textCode) => {
        this.showFilingFrequency = ['MSM', 'MSR'].includes(textCode);
      }, this.destroy$);
    }
  }

  getReportPayload(): Report {
    return Form99.fromJSON(SchemaUtils.getFormValues(this.form, this.schema, this.formProperties));
  }

  override saveHook() {
    const filingFrequency = this.form.get('filing_frequency');
    if (filingFrequency != null) {
      this.form.get('filing_frequency')?.updateValueAndValidity();
      this.form.updateValueAndValidity();
    }
  }
}
