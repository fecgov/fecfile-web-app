import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AutoFocusModule } from 'primeng/autofocus';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TooltipModule } from 'primeng/tooltip';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { ContactLookupComponent } from './components/contact-lookup/contact-lookup.component';
import { ErrorMessagesComponent } from './components/error-messages/error-messages.component';
import { FecInternationalPhoneInputComponent } from './components/fec-international-phone-input/fec-international-phone-input.component';
import { AdditionalInfoInputComponent } from './components/inputs/additional-info-input/additional-info-input.component';
import { AddressInputComponent } from './components/inputs/address-input/address-input.component';
import { AmountInputComponent } from './components/inputs/amount-input/amount-input.component';
import { CommitteeInputComponent } from './components/inputs/committee-input/committee-input.component';
import { ElectionInputComponent } from './components/inputs/election-input/election-input.component';
import { EmployerInputComponent } from './components/inputs/employer-input/employer-input.component';
import { NameInputComponent } from './components/inputs/name-input/name-input.component';
import { NavigationControlBarComponent } from './components/navigation-control-bar/navigation-control-bar.component';
import { NavigationControlComponent } from './components/navigation-control/navigation-control.component';
import { TableActionsButtonComponent } from './components/table-actions-button/table-actions-button.component';
import { TransactionContactLookupComponent } from './components/transaction-contact-lookup/transaction-contact-lookup.component';
import { DefaultZeroPipe } from './pipes/default-zero.pipe';
import { FecDatePipe } from './pipes/fec-date.pipe';
import { HighlightTermsPipe } from './pipes/highlight-terms.pipe';
import { LabelPipe } from './pipes/label.pipe';
import { LongDatePipe } from './pipes/long-date.pipe';
import { ReportCodeLabelPipe } from './utils/report-code.utils';
import { CalculationOverlayComponent } from './components/calculation-overlay/calculation-overlay.component';
import { CandidateInputComponent } from './components/inputs/candidate-input/candidate-input.component';
import { CandidateOfficeInputComponent } from './components/inputs/candidate-office-input/candidate-office-input.component';
import { MemoCodeInputComponent } from './components/inputs/memo-code/memo-code.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { LoanInfoInputComponent } from './components/inputs/loan-info-input/loan-info-input.component';
import { LoanTermsInputComponent } from './components/inputs/loan-terms-input/loan-terms-input.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    SelectButtonModule,
    TooltipModule,
    DropdownModule,
    AutoFocusModule,
    AutoCompleteModule,
    InputTextModule,
    InputTextareaModule,
    CheckboxModule,
    InputNumberModule,
    CalendarModule,
    FormsModule,
    DialogModule,
    DividerModule,
    ConfirmDialogModule,
    OverlayPanelModule,
    ReactiveFormsModule,
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
    CandidateInputComponent,
    CandidateOfficeInputComponent,
    EmployerInputComponent,
    CommitteeInputComponent,
    AmountInputComponent,
    MemoCodeInputComponent,
    AdditionalInfoInputComponent,
    ElectionInputComponent,
    NavigationControlComponent,
    NavigationControlBarComponent,
    TableActionsButtonComponent,
    CalculationOverlayComponent,
    LoanInfoInputComponent,
    LoanTermsInputComponent,
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
    CandidateInputComponent,
    CandidateOfficeInputComponent,
    EmployerInputComponent,
    CommitteeInputComponent,
    AmountInputComponent,
    AdditionalInfoInputComponent,
    ElectionInputComponent,
    TableActionsButtonComponent,
    CalculationOverlayComponent,
    LoanInfoInputComponent,
    LoanTermsInputComponent,
  ],
  providers: [DatePipe],
})
export class SharedModule {}
