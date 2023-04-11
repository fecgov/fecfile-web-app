import { CommonModule } from '@angular/common';
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
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ListboxModule } from 'primeng/listbox';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';

import { SharedModule } from '../../app/shared/shared.module';
import { CreateF3XStep1Component } from './f3x/create-workflow/create-f3x-step1.component';
import { ReportDetailedSummaryComponent } from './f3x/report-detailed-summary/report-detailed-summary.component';
import { ReportLevelMemoComponent } from './f3x/report-level-memo/report-level-memo.component';
import { ReportSummaryComponent } from './f3x/report-summary/report-summary.component';
import { ReportSubmissionStatusComponent } from './f3x/submission-workflow/submit-f3x-status.component';
import { SubmitF3xStep1Component } from './f3x/submission-workflow/submit-f3x-step1.component';
import { SubmitF3xStep2Component } from './f3x/submission-workflow/submit-f3x-step2.component';
import { ReportWebPrintComponent } from './f3x/report-web-print/report-web-print.component';
import { TestDotFecComponent } from './f3x/test-dot-fec-workflow/test-dot-fec.component';
import { ReportListComponent } from './report-list/report-list.component';
import { ReportsRoutingModule } from './reports-routing.module';
import { CashOnHandComponent } from './f3x/create-workflow/cash-on-hand.component';
import { AppSelectButtonComponent } from '../shared/components/app-selectbutton.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormTypeDialogComponent } from './form-type-dialog/form-type-dialog.component';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [
    ReportListComponent,
    CreateF3XStep1Component,
    SubmitF3xStep1Component,
    SubmitF3xStep2Component,
    ReportSummaryComponent,
    ReportDetailedSummaryComponent,
    ReportLevelMemoComponent,
    ReportSubmissionStatusComponent,
    ReportWebPrintComponent,
    TestDotFecComponent,
    CashOnHandComponent,
    AppSelectButtonComponent,
    FormTypeDialogComponent,
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
    OverlayPanelModule,
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
    ProgressSpinnerModule,
    InputNumberModule,
  ],
})
export class ReportsModule {}
