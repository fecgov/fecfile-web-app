import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { ContactLookupComponent } from './components/contact-lookup/contact-lookup.component';
import { ErrorMessagesComponent } from './components/error-messages/error-messages.component';
import { FecInternationalPhoneInputComponent } from './components/fec-international-phone-input/fec-international-phone-input.component';
import { DefaultZeroPipe } from './pipes/default-zero.pipe';
import { FecDatePipe } from './pipes/fec-date.pipe';
import { HighlightTermsPipe } from './pipes/highlight-terms.pipe';
import { LabelPipe } from './pipes/label.pipe';
import { LongDatePipe } from './pipes/long-date.pipe';
import { FindOnReportCodePipe } from './pipes/report-code-label-list.pipe';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, ReactiveFormsModule, ButtonModule, DropdownModule, AutoCompleteModule],
  declarations: [
    LabelPipe,
    ErrorMessagesComponent,
    FecDatePipe,
    LongDatePipe,
    FindOnReportCodePipe,
    DefaultZeroPipe,
    HighlightTermsPipe,
    FecInternationalPhoneInputComponent,
    ContactLookupComponent,
  ],
  exports: [
    FecDatePipe,
    LongDatePipe,
    LabelPipe,
    ErrorMessagesComponent,
    FindOnReportCodePipe,
    DefaultZeroPipe,
    HighlightTermsPipe,
    FecInternationalPhoneInputComponent,
    ContactLookupComponent,
  ],
})
export class SharedModule { }
