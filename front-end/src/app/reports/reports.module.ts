import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportListComponent } from './report-list/report-list.component';

@NgModule({
  declarations: [
    ReportListComponent
  ],
  imports: [CommonModule, ReportsRoutingModule],
})
export class ReportsModule {}
