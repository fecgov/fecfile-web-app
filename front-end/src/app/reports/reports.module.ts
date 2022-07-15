import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';

import { SharedModule } from '../../app/shared/shared.module';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportListComponent } from './report-list/report-list.component';
import { CreateF3XStep1Component } from './f3x/create-workflow/create-f3x-step1.component';
import { CreateF3xStep2Component } from './f3x/create-workflow/create-f3x-step2.component';
import { CreateF3xStep3Component, MemoCodePipe } from './f3x/create-workflow/create-f3x-step3.component';
import { ReportSummaryComponent } from './f3x/report-summary/report-summary.component';
import { ReportDetailedSummaryComponent } from './f3x/report-detailed-summary/report-detailed-summary.component';

@NgModule({
  declarations: [
    ReportListComponent,
    CreateF3XStep1Component,
    CreateF3xStep2Component,
    CreateF3xStep3Component,
    MemoCodePipe,
    ReportSummaryComponent,
    ReportDetailedSummaryComponent,
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
    DropdownModule,
    RadioButtonModule,
    CheckboxModule,
    InputTextModule,
    InputTextareaModule,
    CalendarModule,
    SelectButtonModule,
    ToastModule,
    CardModule,
    SharedModule,
  ],
})
export class ReportsModule {}
