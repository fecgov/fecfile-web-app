import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportListComponent } from './report-list/report-list.component';
import { ReportSidebarSection } from 'app/layout/sidebar/sidebar.component';
import { SidebarStateResolver } from 'app/shared/resolvers/sidebar-state.resolver';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { Form99Service } from 'app/shared/services/form-99.service';
import { ReportService } from 'app/shared/services/report.service';
import { Form24Service } from 'app/shared/services/form-24.service';

// ROUTING NOTE:
// Due to lifecycle conflict issues between the ReportIsEditableGuard and the
// ReportResolver, both the guard and the resovler read the :reportId in the URL
// and put the report for the ID in the ActiveReport value in the ngrx store. As a result:
// 1) The component will pull the active report from the ngrx store and not the ActivatedRoute.snapshot.
// 2) The ReportResolver should not be declared on routes with a ReportIsEditableGuard declared.

const routes: Routes = [
  {
    path: '',
    title: 'Manage Reports',
    component: ReportListComponent,
    pathMatch: 'full',
  },
  {
    path: 'transactions',
    resolve: { sidebar: SidebarStateResolver },
    data: { sidebarSection: ReportSidebarSection.TRANSACTIONS },
    loadChildren: () => import('./transactions/transactions.module').then((m) => m.TransactionsModule),
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'f3x',
    providers: [{ provide: ReportService, useClass: Form3XService }],
    loadChildren: () => import('./f3x/f3x.module').then((m) => m.F3XModule),
  },
  {
    path: 'f99',
    providers: [{ provide: ReportService, useClass: Form99Service }],
    loadChildren: () => import('./f99/f99.module').then((m) => m.F99Module),
  },
  {
    path: 'f24',
    providers: [{ provide: ReportService, useClass: Form24Service }],
    loadChildren: () => import('./f24/f24.module').then((m) => m.F24Module),
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
