import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ErrorMessagesComponent } from './components/error-messages/error-messages.component';
import { FecIntlTelInputComponent } from './components/fec-intl-tel-input/fec-intl-tel-input.component';
import { DefaultZeroPipe } from './pipes/default-zero.pipe';
import { FecDatePipe } from './pipes/fec-date.pipe';
import { LabelPipe } from './pipes/label.pipe';
import { LongDatePipe } from './pipes/long-date.pipe';
import { FindOnReportCodePipe } from './pipes/report-code-label-list.pipe';

@NgModule({
  imports: [CommonModule, NgxIntlTelInputModule, ReactiveFormsModule],
  declarations: [LabelPipe, ErrorMessagesComponent, FecDatePipe, LongDatePipe, FindOnReportCodePipe, DefaultZeroPipe, FecIntlTelInputComponent],
  exports: [FecDatePipe, LongDatePipe, LabelPipe, ErrorMessagesComponent, FindOnReportCodePipe, DefaultZeroPipe, FecIntlTelInputComponent],
})
export class SharedModule {}
