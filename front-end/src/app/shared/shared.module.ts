import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { ContactLookupComponent } from './components/contact-lookup/contact-lookup.component';
import { ErrorMessagesComponent } from './components/error-messages/error-messages.component';
import { FecInternationalPhoneInputComponent } from './components/fec-international-phone-input/fec-international-phone-input.component';
import { DefaultZeroPipe } from './pipes/default-zero.pipe';
import { FecDatePipe } from './pipes/fec-date.pipe';
import { HighlightTermsPipe } from './pipes/highlight-terms.pipe';
import { LabelPipe } from './pipes/label.pipe';
import { LongDatePipe } from './pipes/long-date.pipe';
import { FindOnReportCodePipe } from './pipes/report-code-label-list.pipe';
import { NavigationControlComponent } from './components/navigation-control/navigation-control/navigation-control.component';
import { NavigationControlBarComponent } from './components/navigation-control-bar/navigation-control-bar.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    DropdownModule,
    AutoCompleteModule,
    InputTextModule,
    FormsModule,
    DialogModule,
    ConfirmDialogModule,
  ],
  declarations: [
    LabelPipe,
    ErrorMessagesComponent,
    FecDatePipe,
    LongDatePipe,
    FindOnReportCodePipe,
    DefaultZeroPipe,
    HighlightTermsPipe,
    FecInternationalPhoneInputComponent,
    NavigationControlComponent,
    NavigationControlBarComponent,
    ContactLookupComponent,
    ContactFormComponent,
    NavigationControlComponent,
    NavigationControlBarComponent,
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
    NavigationControlComponent,
    NavigationControlBarComponent,
    ContactLookupComponent,
    ContactFormComponent,
  ],
  providers: [DatePipe],
})
export class SharedModule {}
