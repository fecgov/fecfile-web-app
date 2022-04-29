import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportListComponent } from './report-list/report-list.component';

const routes: Routes = [
  {
    path: '',
    component: ReportListComponent,
    pathMatch: 'full',
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
