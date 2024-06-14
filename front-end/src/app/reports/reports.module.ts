import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// PrimeNG
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ListboxModule } from 'primeng/listbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';

import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { SharedModule } from 'app/shared/shared.module';
import { CashOnHandComponent } from './f3x/create-workflow/cash-on-hand.component';
import { CreateF3XStep1Component } from './f3x/create-workflow/create-f3x-step1.component';
import { ReportDetailedSummaryComponent } from './f3x/report-detailed-summary/report-detailed-summary.component';
import { ReportLevelMemoComponent } from './shared/report-level-memo/report-level-memo.component';
import { ReportSummaryComponent } from './f3x/report-summary/report-summary.component';
import { PrintPreviewComponent } from './shared/print-preview/print-preview.component';
import { FormTypeDialogComponent } from './form-type-dialog/form-type-dialog.component';
import { ReportListComponent } from './report-list/report-list.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { RippleModule } from 'primeng/ripple';
import { MainFormComponent } from './f1m/main-form/main-form.component';
import { SubmitReportStep1Component } from './submission-workflow/submit-report-step1.component';
import { SubmitReportStep2Component } from './submission-workflow/submit-report-step2.component';
import { SubmitReportStatusComponent } from './submission-workflow/submit-report-status.component';
import { PasswordModule } from 'primeng/password';

@NgModule({
  declarations: [
    ReportListComponent,
    CreateF3XStep1Component,
    SubmitReportStep2Component,
    SubmitReportStep1Component,
    SubmitReportStatusComponent,
    ReportSummaryComponent,
    ReportDetailedSummaryComponent,
    ReportLevelMemoComponent,
    PrintPreviewComponent,
    CashOnHandComponent,
    FormTypeDialogComponent,
    MainFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ReportsRoutingModule,
    TableModule,
    ToolbarModule,
    ButtonModule,
    DividerModule,
    DialogModule,
    DropdownModule,
    ListboxModule,
    RadioButtonModule,
    CheckboxModule,
    InputTextModule,
    InputTextareaModule,
    CalendarModule,
    SelectButtonModule,
    ToastModule,
    CardModule,
    SharedModule,
    TooltipModule,
    ConfirmDialogModule,
    InputNumberModule,
    RippleModule,
    NgOptimizedImage,
    PasswordModule,
  ],
  exports: [FormTypeDialogComponent],
})
export class ReportsModule {}
