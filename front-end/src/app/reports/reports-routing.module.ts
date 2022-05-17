import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportListComponent } from './report-list/report-list.component';
import { CreateF3XStep1Component } from './f3x/create-workflow/create-f3x-step1.component';
import { CreateF3xStep2Component } from './f3x/create-workflow/create-f3x-step2.component';
import { ReportResolver } from 'app/shared/resolvers/report.resolver';

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
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
