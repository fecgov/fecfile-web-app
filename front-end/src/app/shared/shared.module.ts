import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ContactLookupComponent } from './components/contact-lookup/contact-lookup.component';
import { ErrorMessagesComponent } from './components/error-messages/error-messages.component';
import { DefaultZeroPipe } from './pipes/default-zero.pipe';
import { FecDatePipe } from './pipes/fec-date.pipe';
import { LabelPipe } from './pipes/label.pipe';
import { LongDatePipe } from './pipes/long-date.pipe';
import { FindOnReportCodePipe } from './pipes/report-code-label-list.pipe';

@NgModule({
  imports: [CommonModule, DropdownModule, ReactiveFormsModule, ButtonModule],
  declarations: [LabelPipe, ErrorMessagesComponent, FecDatePipe, LongDatePipe, FindOnReportCodePipe, DefaultZeroPipe, ContactLookupComponent],
  exports: [FecDatePipe, LongDatePipe, LabelPipe, ErrorMessagesComponent, FindOnReportCodePipe, DefaultZeroPipe, ContactLookupComponent],
})
export class SharedModule {}
