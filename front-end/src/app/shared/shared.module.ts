import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarModule } from 'primeng/calendar';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { ContactLookupComponent } from './components/contact-lookup/contact-lookup.component';
import { ErrorMessagesComponent } from './components/error-messages/error-messages.component';
import { FecInternationalPhoneInputComponent } from './components/fec-international-phone-input/fec-international-phone-input.component';
import { AddressInputComponent } from './components/inputs/address-input/address-input.component';
import { NameInputComponent } from './components/inputs/name-input/name-input.component';
import { EmployerInputComponent } from './components/inputs/employer-input/employer-input.component';
import { CommitteeInputComponent } from './components/inputs/committee-input/committee-input.component';
import { AmountInputComponent } from './components/inputs/amount-input/amount-input.component';
import { AdditionalInfoInputComponent } from './components/inputs/additional-info-input/additional-info-input.component';
import { DefaultZeroPipe } from './pipes/default-zero.pipe';
import { FecDatePipe } from './pipes/fec-date.pipe';
import { HighlightTermsPipe } from './pipes/highlight-terms.pipe';
import { ReportCodeLabelPipe } from './utils/report-code.utils';
import { LabelPipe } from './pipes/label.pipe';
import { LongDatePipe } from './pipes/long-date.pipe';
import { NavigationControlComponent } from './components/navigation-control/navigation-control/navigation-control.component';
import { NavigationControlBarComponent } from './components/navigation-control-bar/navigation-control-bar.component';
import { TransactionContactLookupComponent } from './components/transaction-contact-lookup/transaction-contact-lookup.component';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    TooltipModule,
    DropdownModule,
    AutoCompleteModule,
    InputTextModule,
    InputTextareaModule,
    CheckboxModule,
    InputNumberModule,
    CalendarModule,
    FormsModule,
    DialogModule,
    ConfirmDialogModule,
  ],
  declarations: [
    LabelPipe,
    ErrorMessagesComponent,
    FecDatePipe,
    LongDatePipe,
    DefaultZeroPipe,
    HighlightTermsPipe,
    ReportCodeLabelPipe,
    FecInternationalPhoneInputComponent,
    NavigationControlComponent,
    NavigationControlBarComponent,
    ContactLookupComponent,
    TransactionContactLookupComponent,
    ContactFormComponent,
    AddressInputComponent,
    NameInputComponent,
    EmployerInputComponent,
    CommitteeInputComponent,
    AmountInputComponent,
    AdditionalInfoInputComponent,
    NavigationControlComponent,
    NavigationControlBarComponent,
  ],
  exports: [
    FecDatePipe,
    LongDatePipe,
    LabelPipe,
    ErrorMessagesComponent,
    DefaultZeroPipe,
    HighlightTermsPipe,
    ReportCodeLabelPipe,
    FecInternationalPhoneInputComponent,
    NavigationControlComponent,
    NavigationControlBarComponent,
    ContactLookupComponent,
    TransactionContactLookupComponent,
    ContactFormComponent,
    AddressInputComponent,
    NameInputComponent,
    EmployerInputComponent,
    CommitteeInputComponent,
    AmountInputComponent,
    AdditionalInfoInputComponent,
  ],
  providers: [DatePipe],
})
export class SharedModule {}
