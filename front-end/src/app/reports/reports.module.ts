import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportListComponent } from './report-list/report-list.component';
import { ReportTypeComponent } from './report-detail/report-type.component';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [ReportListComponent, ReportTypeComponent],
  imports: [
    FormsModule,
    ButtonModule,
    CalendarModule,
    CommonModule,
    ReportsRoutingModule,
    RadioButtonModule,
    SharedModule,
  ],
})
export class ReportsModule {}
