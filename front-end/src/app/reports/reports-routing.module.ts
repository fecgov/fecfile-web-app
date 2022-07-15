import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportListComponent } from './report-list/report-list.component';
import { CreateF3XStep1Component } from './f3x/create-workflow/create-f3x-step1.component';
import { CreateF3xStep2Component } from './f3x/create-workflow/create-f3x-step2.component';
import { CreateF3xStep3Component } from './f3x/create-workflow/create-f3x-step3.component';
import { ReportSummaryComponent } from './f3x/report-summary/report-summary.component';
import { ReportDetailedSummaryComponent } from './f3x/report-detailed-summary/report-detailed-summary.component';
import { ReportResolver } from 'app/shared/resolvers/report.resolver';
import { SubmitF3xStep1Component } from './f3x/submission-workflow/submit-f3x-step1.component';

const routes: Routes = [
  {
    path: '',
    component: ReportListComponent,
    pathMatch: 'full',
  },
  {
    path: 'f3x/create/step1',
    component: CreateF3XStep1Component,
  },
  {
    path: 'f3x/create/step1/:reportId',
    component: CreateF3XStep1Component,
    resolve: { report: ReportResolver },
  },
  {
    path: 'f3x/create/step2/:reportId',
    component: CreateF3xStep2Component,
    resolve: { report: ReportResolver },
  },
  {
    path: 'f3x/create/step3/:reportId',
    component: CreateF3xStep3Component,
    resolve: { report: ReportResolver },
  },
  {
    path: 'f3x/summary/:reportId',
    component: ReportSummaryComponent,
    resolve: { report: ReportResolver },
  },
  {
    path: 'f3x/detailed-summary/:reportId',
    component: ReportDetailedSummaryComponent,
    resolve: { report: ReportResolver },
  },
  {
    path: 'f3x/submit/step1/:reportId',
    component: SubmitF3xStep1Component,
    resolve: { report: ReportResolver },
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
