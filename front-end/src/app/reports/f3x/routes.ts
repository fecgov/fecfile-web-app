import { Route } from '@angular/router';
import { CreateF3XStep1Component } from './create-workflow/create-f3x-step1.component';
import { ReportSummaryComponent } from './report-summary/report-summary.component';
import { ReportDetailedSummaryComponent } from './report-detailed-summary/report-detailed-summary.component';
import { ReportResolver } from 'app/shared/resolvers/report.resolver';
import { ReportLevelMemoComponent } from '../shared/report-level-memo/report-level-memo.component';
import { PrintPreviewComponent } from 'app/reports/shared/print-preview/print-preview.component';
import { ReportIsEditableGuard } from '../../shared/guards/report-is-editable.guard';
import { ReportSidebarSection } from 'app/layout/sidebar/sidebar.component';
import { SubmitReportStep1Component } from '../submission-workflow/submit-report-step1.component';
import { Report } from 'app/shared/models/report.model';
import { SubmitReportStep2Component } from '../submission-workflow/submit-report-step2.component';
import { SubmitReportStatusComponent } from '../submission-workflow/submit-report-status.component';

// ROUTING NOTE:
// Due to lifecycle conflict issues between the ReportIsEditableGuard and the
// ReportResolver, both the guard and the resovler read the :reportId in the URL
// and put the report for the ID in the ActiveReport value in the ngrx store. As a result:
// 1) The component will pull the active report from the ngrx store and not the ActivatedRoute.snapshot.
// 2) The ReportResolver should not be declared on routes with a ReportIsEditableGuard declared.

export const F3X_ROUTES: Route[] = [
  {
    path: 'create/step1',
    title: 'Create a report',
    component: CreateF3XStep1Component,
    runGuardsAndResolvers: 'always',
    data: {
      showSidebar: false,
    },
  },
  {
    path: 'create/step1/:reportId',
    title: 'Create a report',
    component: CreateF3XStep1Component,
    canActivate: [ReportIsEditableGuard],
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'edit/:reportId',
    title: 'Edit a report',
    component: CreateF3XStep1Component,
    resolve: { report: ReportResolver },
    data: { sidebarSection: ReportSidebarSection.CREATE },
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'summary/:reportId',
    title: 'View summary page',
    component: ReportSummaryComponent,
    resolve: { report: ReportResolver },
    data: { sidebarSection: ReportSidebarSection.REVIEW },
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'detailed-summary/:reportId',
    title: 'View detailed summary page',
    component: ReportDetailedSummaryComponent,
    resolve: { report: ReportResolver },
    data: { sidebarSection: ReportSidebarSection.REVIEW },
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'web-print/:reportId',
    title: 'Print preview',
    component: PrintPreviewComponent,
    resolve: { report: ReportResolver },
    data: {
      sidebarSection: ReportSidebarSection.REVIEW,
      getBackUrl: (report?: Report) => '/reports/f3x/detailed-summary/' + report?.id,
      getContinueUrl: (report?: Report) => '/reports/f3x/submit/step1/' + report?.id,
    },
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
      getNextUrl: (report?: Report) => '/reports/f3x/submit/step1/' + report?.id,
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
      getBackUrl: (report?: Report) => '/reports/f3x/memo/' + report?.id,
      getContinueUrl: (report?: Report) => '/reports/f3x/submit/step2/' + report?.id,
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
      getBackUrl: (report?: Report) => '/reports/f3x/submit/step1/' + report?.id,
      getContinueUrl: (report?: Report) => '/reports/f3x/submit/status/' + report?.id,
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
  { path: '**', redirectTo: '' },
];
