import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportListComponent } from './report-list/report-list.component';
import { CreateF3XStep1Component } from './f3x/create-workflow/create-f3x-step1.component';
import { ReportSummaryComponent } from './f3x/report-summary/report-summary.component';
import { ReportDetailedSummaryComponent } from './f3x/report-detailed-summary/report-detailed-summary.component';
import { ReportResolver } from 'app/shared/resolvers/report.resolver';
import { ReportLevelMemoComponent } from './f3x/report-level-memo/report-level-memo.component';
import { SubmitF3xStep1Component } from './f3x/submission-workflow/submit-f3x-step1.component';
import { SubmitF3xStep2Component } from './f3x/submission-workflow/submit-f3x-step2.component';
import { ReportSubmissionStatusComponent } from './f3x/submission-workflow/submit-f3x-status.component';
import { TestDotFecComponent } from './f3x/test-dot-fec-workflow/test-dot-fec.component';
import { ReportWebPrintComponent } from './f3x/report-web-print/report-web-print.component';
import { CashOnHandComponent } from './f3x/create-workflow/cash-on-hand.component';
import { CashOnHandGuard } from 'app/shared/guards/cash-on-hand.guard';
import { ReportIsEditableGuard } from '../shared/guards/report-is-editable.guard';
import { ReportSidebarState, SidebarState } from 'app/layout/sidebar/sidebar.component';
import { SidebarStateResolver } from 'app/shared/resolvers/sidebar-state.resolver';

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
    resolve: { report: ReportResolver, sidebar: SidebarStateResolver },
    data: { sidebarState: new SidebarState(ReportSidebarState.TRANSACTIONS) },
    loadChildren: () => import('./transactions/transactions.module').then((m) => m.TransactionsModule),
  },
  {
    path: 'f3x/create/cash-on-hand/:reportId',
    title: 'Cash on hand',
    component: CashOnHandComponent,
    canActivate: [ReportIsEditableGuard, CashOnHandGuard],
    resolve: { report: ReportResolver, sidebar: SidebarStateResolver },
    data: { sidebarState: new SidebarState(ReportSidebarState.TRANSACTIONS) },
  },
  {
    path: 'f3x/create/step1',
    title: 'Create a report',
    component: CreateF3XStep1Component,
  },
  {
    path: 'f3x/create/step1/:reportId',
    title: 'Create a report',
    resolve: { report: ReportResolver, sidebar: SidebarStateResolver },
    component: CreateF3XStep1Component,
    canActivate: [ReportIsEditableGuard],
  },
  {
    path: 'f3x/summary/:reportId',
    title: 'View summary page',
    component: ReportSummaryComponent,
    resolve: { report: ReportResolver, sidebar: SidebarStateResolver },
    data: { sidebarState: new SidebarState(ReportSidebarState.REVIEW) },
  },
  {
    path: 'f3x/detailed-summary/:reportId',
    title: 'View detailed summary page',
    component: ReportDetailedSummaryComponent,
    resolve: { report: ReportResolver, sidebar: SidebarStateResolver },
    data: { sidebarState: new SidebarState(ReportSidebarState.REVIEW) },
  },
  {
    path: 'f3x/web-print/:reportId',
    title: 'Print preview',
    component: ReportWebPrintComponent,
    resolve: { report: ReportResolver, sidebar: SidebarStateResolver },
    data: { sidebarState: new SidebarState(ReportSidebarState.REVIEW) },
  },
  {
    path: 'f3x/memo/:reportId',
    title: 'Add a report level memo',
    component: ReportLevelMemoComponent,
    canActivate: [ReportIsEditableGuard],
    resolve: { report: ReportResolver, sidebar: SidebarStateResolver },
    data: { sidebarState: new SidebarState(ReportSidebarState.REVIEW) },
  },
  {
    path: 'f3x/submit/step1/:reportId',
    title: 'Confirm information',
    component: SubmitF3xStep1Component,
    canActivate: [ReportIsEditableGuard],
    resolve: { report: ReportResolver, sidebar: SidebarStateResolver },
    data: { sidebarState: new SidebarState(ReportSidebarState.SUBMISSION) },
  },
  {
    path: 'f3x/submit/step2/:reportId',
    title: 'Submit report',
    component: SubmitF3xStep2Component,
    canActivate: [ReportIsEditableGuard],
    resolve: { report: ReportResolver, sidebar: SidebarStateResolver },
    data: { sidebarState: new SidebarState(ReportSidebarState.SUBMISSION) },
  },
  {
    path: 'f3x/submit/status/:reportId',
    title: 'Report status',
    component: ReportSubmissionStatusComponent,
    resolve: { report: ReportResolver, sidebar: SidebarStateResolver },
    data: { sidebarState: new SidebarState(ReportSidebarState.SUBMISSION) },
  },
  {
    path: 'f3x/test-dot-fec/:reportId',
    component: TestDotFecComponent,
    resolve: { report: ReportResolver, sidebar: SidebarStateResolver },
    data: { sidebarState: new SidebarState(ReportSidebarState.REVIEW) },
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
