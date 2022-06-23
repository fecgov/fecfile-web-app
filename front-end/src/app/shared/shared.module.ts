import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelPipe } from './pipes/label.pipe';
import { FindOnReportCodePipe } from './pipes/report-code-label-list.pipe';
import { ErrorMessagesComponent } from './components/error-messages/error-messages.component';
import { FecDatePipe } from './pipes/fec-date.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [LabelPipe, ErrorMessagesComponent, FecDatePipe, FindOnReportCodePipe],
  exports: [FecDatePipe, LabelPipe, ErrorMessagesComponent, FindOnReportCodePipe],
})
export class SharedModule {}
