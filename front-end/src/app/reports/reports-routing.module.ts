import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateReportStep1 } from './create-workflow/create-report-step1.component';
import { ReportListComponent } from './report-list/report-list.component';

const routes: Routes = [
  {
    path: '',
    component: ReportListComponent,
    pathMatch: 'full',
  },
  {
    path: 'create-report-step1',
    component: CreateReportStep1,
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
