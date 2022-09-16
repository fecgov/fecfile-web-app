import { ContactLookupComponent } from './components/contact-lookup/contact-lookup.component';
import { ErrorMessagesComponent } from './components/error-messages/error-messages.component';
import { FecInternationalPhoneInputComponent } from './components/fec-international-phone-input/fec-international-phone-input.component';
import { DefaultZeroPipe } from './pipes/default-zero.pipe';
import { FecDatePipe } from './pipes/fec-date.pipe';
import { HighlightTermsPipe } from './pipes/highlight-terms.pipe';
import { LabelPipe } from './pipes/label.pipe';
import { LongDatePipe } from './pipes/long-date.pipe';
import { FindOnReportCodePipe } from './pipes/report-code-label-list.pipe';
import { ContactDetailComponent } from './components/contact-detail/contact-detail.component';

// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PrimeNG
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    ToastModule,
    ToolbarModule,
    ButtonModule,
    CheckboxModule,
    ConfirmDialogModule,
    DialogModule,
    InputTextModule,
    AutoCompleteModule,
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
    ContactLookupComponent,
    ContactDetailComponent,
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
    ContactDetailComponent,
  ],
})
export class SharedModule {}
