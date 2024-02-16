import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportIsEditableGuard } from '../../shared/guards/report-is-editable.guard';
import { ReportSidebarSection } from 'app/layout/sidebar/sidebar.component';
import { ReportResolver } from 'app/shared/resolvers/report.resolver';
import { PrintPreviewComponent } from 'app/reports/shared/print-preview/print-preview.component';
import { SubmitReportStep1Component } from '../submission-workflow/submit-report-step1.component';
import { Report } from 'app/shared/models/report.model';
import { SubmitReportStep2Component } from '../submission-workflow/submit-report-step2.component';
import { SubmitReportStatusComponent } from '../submission-workflow/submit-report-status.component';
import { ReportLevelMemoComponent } from '../shared/report-level-memo/report-level-memo.component';
import { TransactionIndependentExpenditurePickerComponent } from './transaction-independent-expenditure-picker/transaction-independent-expenditure-picker.component';

// ROUTING NOTE:
// Due to lifecycle conflict issues between the ReportIsEditableGuard and the
// ReportResolver, both the guard and the resovler read the :reportId in the URL
// and put the report for the ID in the ActiveReport value in the ngrx store. As a result:
// 1) The component will pull the active report from the ngrx store and not the ActivatedRoute.snapshot.
// 2) The ReportResolver should not be declared on routes with a ReportIsEditableGuard declared.

const routes: Routes = [
  {
    path: 'report/:reportId/transactions/select/independent-expenditures',
    component: TransactionIndependentExpenditurePickerComponent,
    canActivate: [ReportIsEditableGuard],
    resolve: { report: ReportResolver },
    data: {
      sidebarSection: ReportSidebarSection.TRANSACTIONS,
    },
  },
  {
    path: 'web-print/:reportId',
    title: 'Print preview',
    component: PrintPreviewComponent,
    resolve: { report: ReportResolver },
    data: {
      sidebarSection: ReportSidebarSection.REVIEW,
      getBackUrl: (report?: Report) => `/reports/f24/transactions/${report?.id}/list`,
      getContinueUrl: (report?: Report) => '/reports/f24/submit/step1/' + report?.id,
    },
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'submit/step1/:reportId',
    title: 'Confirm information',
    component: SubmitReportStep1Component,
    canActivate: [ReportIsEditableGuard],
    resolve: { report: ReportResolver },
    data: {
      sidebarSection: ReportSidebarSection.SUBMISSION,
      getBackUrl: (report?: Report) => '/reports/f24/web-print/' + report?.id,
      getContinueUrl: (report?: Report) => '/reports/f24/submit/step2/' + report?.id,
    },
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'submit/step2/:reportId',
    title: 'Submit report',
    component: SubmitReportStep2Component,
    canActivate: [ReportIsEditableGuard],
    resolve: { report: ReportResolver },
    data: {
      sidebarSection: ReportSidebarSection.SUBMISSION,
      getBackUrl: (report?: Report) => '/reports/f24/submit/step1/' + report?.id,
      getContinueUrl: (report?: Report) => '/reports/f24/submit/status/' + report?.id,
    },
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'submit/status/:reportId',
    title: 'Report status',
    component: SubmitReportStatusComponent,
    resolve: { report: ReportResolver },
    data: { sidebarSection: ReportSidebarSection.SUBMISSION },
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'memo/:reportId',
    title: 'Add a report level memo',
    component: ReportLevelMemoComponent,
    canActivate: [ReportIsEditableGuard],
    resolve: { report: ReportResolver },
    data: {
      sidebarSection: ReportSidebarSection.REVIEW,
      getNextUrl: (report?: Report) => `/reports/transactions/report/${report?.id}/list`,
    },
    runGuardsAndResolvers: 'always',
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class F24RoutingModule {}
