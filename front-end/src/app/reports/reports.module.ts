import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../app/shared/shared.module';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportListComponent } from './report-list/report-list.component';

@NgModule({
  declarations: [ReportListComponent],
  imports: [CommonModule, ReportsRoutingModule, TableModule, ToolbarModule, ButtonModule, SharedModule],
})
export class ReportsModule {}
