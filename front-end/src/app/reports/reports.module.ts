import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../app/shared/shared.module';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportListComponent } from './report-list/report-list.component';
import { CreateF3XStep1Component } from './f3x/create-workflow/create-f3x-step1.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';

@NgModule({
  declarations: [ReportListComponent, CreateF3XStep1Component],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CalendarModule,
    CommonModule,
    DropdownModule,
    ReportsRoutingModule,
    RadioButtonModule,
    SelectButtonModule,
    SharedModule,
    TableModule,
    ToolbarModule,
  ],
})
export class ReportsModule {}
