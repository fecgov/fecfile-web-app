import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateF3XStep1Component } from './f3x/create-workflow/create-f3x-step1.component';
import { ReportListComponent } from './report-list/report-list.component';

const routes: Routes = [
  {
    path: '',
    component: ReportListComponent,
    pathMatch: 'full',
  },
  {
    path: 'create-f3x-step1',
    component: CreateF3XStep1Component,
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
