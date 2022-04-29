import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportListComponent } from './report-list/report-list.component';
import { CreateReportStep1 } from './create-workflow/create-report-step-1.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { SharedModule } from 'app/shared/shared.module';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [ReportListComponent, CreateReportStep1],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CalendarModule,
    CommonModule,
    DropdownModule,
    ReportsRoutingModule,
    RadioButtonModule,
    SharedModule,
  ],
})
export class ReportsModule {}
