import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MainFormBaseComponent } from 'app/reports/shared/main-form-base.component';
import { filingFrequencies, Form99, textCodes, textCodesWithFilingFrequencies } from 'app/shared/models/form-99.model';
import { Report } from 'app/shared/models/report.model';
import { Form99Service } from 'app/shared/services/form-99.service';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { schema as f99Schema } from 'fecfile-validate/fecfile_validate_js/dist/F99';
import { InputText } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { Select } from 'primeng/select';
import { SelectButton } from 'primeng/selectbutton';
import { ErrorMessagesComponent } from '../../../shared/components/error-messages/error-messages.component';
import { AddressInputComponent } from '../../../shared/components/inputs/address-input/address-input.component';
import { SaveCancelComponent } from '../../../shared/components/save-cancel/save-cancel.component';
import { AutoResizeDirective } from 'app/shared/directives/auto-resize.directive';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

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
    RadioButtonModule,
    SelectButton,
    AutoResizeDirective,
  ],
  providers: [Form99Service],
})
export class MainFormComponent extends MainFormBaseComponent implements OnInit {
  override reportService = inject(Form99Service);
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

  readonly textCodes = textCodes;
  readonly filingFrequencies = filingFrequencies;

  override readonly form = this.fb.group(SchemaUtils.getFormGroupFieldsNoBlur(this.formProperties), {
    updateOn: 'blur',
  });
  readonly documentType: Signal<string> = toSignal(this.form.controls['text_code'].valueChanges as Observable<string>, {
    initialValue: '',
  });
  readonly isLoanAgreement = computed(() => this.documentType() === 'MSW');
  readonly showFilingFrequency = computed(() => {
    return this.documentType() in textCodesWithFilingFrequencies;
  });

  getReportPayload(): Report {
    return Form99.fromJSON(SchemaUtils.getFormValues(this.form, this.schema, this.formProperties));
  }

  override async save(jump: 'continue' | void) {
    const filingFrequency = this.form.get('filing_frequency');
    if (filingFrequency) {
      this.form.get('filing_frequency')?.updateValueAndValidity();
      this.form.updateValueAndValidity();
    }
    await super.save(jump);
  }
}
