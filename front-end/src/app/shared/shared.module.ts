import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorMessagesComponent } from './components/error-messages/error-messages.component';
import { DefaultZeroPipe } from './pipes/default-zero.pipe';
import { FecDatePipe } from './pipes/fec-date.pipe';
import { LabelPipe } from './pipes/label.pipe';
import { LongDatePipe } from './pipes/long-date.pipe';
import { FindOnReportCodePipe } from './pipes/report-code-label-list.pipe';

import { IntlTelInputComponent } from './components/intl-tel-input/intl-tel-input.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [LabelPipe, ErrorMessagesComponent, FecDatePipe, LongDatePipe, FindOnReportCodePipe, DefaultZeroPipe, IntlTelInputComponent],
  exports: [FecDatePipe, LongDatePipe, LabelPipe, ErrorMessagesComponent, FindOnReportCodePipe, DefaultZeroPipe, IntlTelInputComponent],
})
export class SharedModule {}
