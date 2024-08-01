import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
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
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TooltipModule } from 'primeng/tooltip';
import { CalculationOverlayComponent } from './components/calculation-overlay/calculation-overlay.component';
import { CommitteeMemberDialogComponent } from './components/committee-member-dialog/committee-member-dialog.component';
import { ContactDialogComponent } from './components/contact-dialog/contact-dialog.component';
import { ContactLookupComponent } from './components/contact-lookup/contact-lookup.component';
import { ErrorMessagesComponent } from './components/error-messages/error-messages.component';
import { FecInternationalPhoneInputComponent } from './components/fec-international-phone-input/fec-international-phone-input.component';
import { AdditionalInfoInputComponent } from './components/inputs/additional-info-input/additional-info-input.component';
import { AddressInputComponent } from './components/inputs/address-input/address-input.component';
import { AmountInputComponent } from './components/inputs/amount-input/amount-input.component';
import { CandidateInputComponent } from './components/inputs/candidate-input/candidate-input.component';
import { CandidateOfficeInputComponent } from './components/inputs/candidate-office-input/candidate-office-input.component';
import { CommitteeInputComponent } from './components/inputs/committee-input/committee-input.component';
import { DebtInputComponent } from './components/inputs/debt-input/debt-input.component';
import { ElectionInputComponent } from './components/inputs/election-input/election-input.component';
import { EmployerInputComponent } from './components/inputs/employer-input/employer-input.component';
import { LoanAgreementInputComponent } from './components/inputs/loan-agreement-input/loan-agreement-input.component';
import { LoanInfoInputComponent } from './components/inputs/loan-info-input/loan-info-input.component';
import { LoanTermsDatesInputComponent } from './components/inputs/loan-terms-dates-input/loan-terms-dates-input.component';
import { LoanTermsInputComponent } from './components/inputs/loan-terms-input/loan-terms-input.component';
import { MemoCodeInputComponent } from './components/inputs/memo-code/memo-code.component';
import { NameInputComponent } from './components/inputs/name-input/name-input.component';
import { SignatureInputComponent } from './components/inputs/signature-input/signature-input.component';
import { YesNoRadioInputComponent } from './components/inputs/yes-no-radio-input/yes-no-radio-input.component';
import { NavigationControlBarComponent } from './components/navigation-control-bar/navigation-control-bar.component';
import { NavigationControlComponent } from './components/navigation-control/navigation-control.component';
import { TableActionsButtonComponent } from './components/table-actions-button/table-actions-button.component';
import { TableSortIconComponent } from './components/table-sort-icon/table-sort-icon.component';
import { TransactionContactLookupComponent } from './components/transaction-contact-lookup/transaction-contact-lookup.component';
import { DefaultZeroPipe } from './pipes/default-zero.pipe';
import { FecDatePipe } from './pipes/fec-date.pipe';
import { HighlightTermsPipe } from './pipes/highlight-terms.pipe';
import { LabelPipe } from './pipes/label.pipe';
import { LongDatePipe } from './pipes/long-date.pipe';
import { SupportOpposeInputComponent } from './components/inputs/support-oppose-input/support-oppose-input.component';
import { SingleClickDirective } from './directives/single-click.directive';
import { RippleModule } from 'primeng/ripple';
import { CardModule } from 'primeng/card';
import { LinkedReportInputComponent } from './components/inputs/linked-report-input/linked-report-input.component';
import { IndependentExpenditureCreateF3xInputComponent } from './components/inputs/independent-expenditure-create-f3x-input/independent-expenditure-create-f3x-input.component';
import { RouterLink } from '@angular/router';
import { TableModule } from 'primeng/table';
import { TableComponent } from './components/table/table.component';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { DownloadTrayComponent } from './components/download-tray/download-tray.component';
import { SidebarModule } from 'primeng/sidebar';
import { InputNumberComponent } from './components/inputs/input-number/input-number.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    RadioButtonModule,
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
    CardModule,
    ConfirmDialogModule,
    OverlayPanelModule,
    ReactiveFormsModule,
    RippleModule,
    RouterLink,
    TableModule,
    ToastModule,
    PaginatorModule,
    SidebarModule,
  ],
  declarations: [
    LabelPipe,
    ErrorMessagesComponent,
    FecDatePipe,
    LongDatePipe,
    DefaultZeroPipe,
    HighlightTermsPipe,
    FecInternationalPhoneInputComponent,
    NavigationControlComponent,
    NavigationControlBarComponent,
    ContactLookupComponent,
    TransactionContactLookupComponent,
    CommitteeMemberDialogComponent,
    ContactDialogComponent,
    AddressInputComponent,
    NameInputComponent,
    CandidateInputComponent,
    CandidateOfficeInputComponent,
    EmployerInputComponent,
    CommitteeInputComponent,
    AmountInputComponent,
    LinkedReportInputComponent,
    IndependentExpenditureCreateF3xInputComponent,
    MemoCodeInputComponent,
    AdditionalInfoInputComponent,
    ElectionInputComponent,
    NavigationControlComponent,
    NavigationControlBarComponent,
    TableActionsButtonComponent,
    TableSortIconComponent,
    CalculationOverlayComponent,
    LoanInfoInputComponent,
    LoanTermsInputComponent,
    LoanTermsDatesInputComponent,
    LoanAgreementInputComponent,
    SignatureInputComponent,
    YesNoRadioInputComponent,
    DebtInputComponent,
    SupportOpposeInputComponent,
    SingleClickDirective,
    TableComponent,
    DownloadTrayComponent,
    InputNumberComponent,
  ],
  exports: [
    FecDatePipe,
    LongDatePipe,
    LabelPipe,
    ErrorMessagesComponent,
    DefaultZeroPipe,
    HighlightTermsPipe,
    FecInternationalPhoneInputComponent,
    NavigationControlComponent,
    NavigationControlBarComponent,
    ContactLookupComponent,
    TransactionContactLookupComponent,
    ContactDialogComponent,
    CommitteeMemberDialogComponent,
    AddressInputComponent,
    NameInputComponent,
    CandidateInputComponent,
    CandidateOfficeInputComponent,
    EmployerInputComponent,
    CommitteeInputComponent,
    AmountInputComponent,
    LinkedReportInputComponent,
    IndependentExpenditureCreateF3xInputComponent,
    MemoCodeInputComponent,
    AdditionalInfoInputComponent,
    ElectionInputComponent,
    TableActionsButtonComponent,
    TableSortIconComponent,
    CalculationOverlayComponent,
    LoanInfoInputComponent,
    LoanTermsInputComponent,
    LoanTermsDatesInputComponent,
    LoanAgreementInputComponent,
    SignatureInputComponent,
    YesNoRadioInputComponent,
    DebtInputComponent,
    SupportOpposeInputComponent,
    SingleClickDirective,
    TableComponent,
    DownloadTrayComponent,
    InputNumberComponent,
  ],
  providers: [DatePipe, CurrencyPipe],
})
export class SharedModule {}
