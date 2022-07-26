import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelPipe } from './pipes/label.pipe';
import { FindOnReportCodePipe } from './pipes/report-code-label-list.pipe';
import { ErrorMessagesComponent } from './components/error-messages/error-messages.component';
import { FecDatePipe } from './pipes/fec-date.pipe';
import { LongDatePipe } from './pipes/long-date.pipe';
import { DefaultZeroPipe } from './pipes/default-zero.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [LabelPipe, ErrorMessagesComponent, FecDatePipe, LongDatePipe, FindOnReportCodePipe, DefaultZeroPipe],
  exports: [FecDatePipe, LongDatePipe, LabelPipe, ErrorMessagesComponent, FindOnReportCodePipe, DefaultZeroPipe],
})
export class SharedModule {}
