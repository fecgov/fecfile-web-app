import { Route } from '@angular/router';
import { ReportResolver } from 'app/shared/resolvers/report.resolver';
import { ReportIsEditableGuard } from '../../shared/guards/report-is-editable.guard';
import { ReportSidebarSection } from 'app/layout/sidebar/menu-info';
import { ReportService } from 'app/shared/services/report.service';
import type { Report } from 'app/shared/models/reports/report.model';

// ROUTING NOTE:
// Due to lifecycle conflict issues between the ReportIsEditableGuard and the
// ReportResolver, both the guard and the resovler read the :reportId in the URL
// and put the report for the ID in the ActiveReport value in the ngrx store. As a result:
// 1) The component will pull the active report from the ngrx store and not the ActivatedRoute.snapshot.
// 2) The ReportResolver should not be declared on routes with a ReportIsEditableGuard declared.

export const F3X_ROUTES: Route[] = [
  {
    path: '',
    providers: [ReportResolver, ReportService, ReportIsEditableGuard],
    children: [
      {
        path: 'create/step1',
        title: 'Create a report',
        loadComponent: () =>
          import('./create-workflow/create-f3x-step1.component').then((m) => m.CreateF3XStep1Component),
        runGuardsAndResolvers: 'always',
        data: { showSidebar: false },
      },
      {
        path: 'create/step1/:reportId',
        title: 'Create a report',
        loadComponent: () =>
          import('./create-workflow/create-f3x-step1.component').then((m) => m.CreateF3XStep1Component),
        canActivate: [ReportIsEditableGuard],
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'edit/:reportId',
        title: 'Edit a report',
        loadComponent: () =>
          import('./create-workflow/create-f3x-step1.component').then((m) => m.CreateF3XStep1Component),
        resolve: { report: ReportResolver },
        data: { sidebarSection: ReportSidebarSection.CREATE },
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'summary/:reportId',
        title: 'View summary page',
        loadComponent: () => import('./report-summary/report-summary.component').then((m) => m.ReportSummaryComponent),
        resolve: { report: ReportResolver },
        data: { sidebarSection: ReportSidebarSection.REVIEW },
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'detailed-summary/:reportId',
        title: 'View detailed summary page',
        loadComponent: () =>
          import('./report-detailed-summary/report-detailed-summary.component').then(
            (m) => m.ReportDetailedSummaryComponent,
          ),
        resolve: { report: ReportResolver },
        data: { sidebarSection: ReportSidebarSection.REVIEW },
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'web-print/:reportId',
        title: 'Print preview',
        loadComponent: () =>
          import('app/reports/shared/print-preview/print-preview.component').then((m) => m.PrintPreviewComponent),
        resolve: { report: ReportResolver },
        data: {
          sidebarSection: ReportSidebarSection.REVIEW,
          getBackUrl: (report?: Report) => '/reports/f3x/detailed-summary/' + report?.id,
          getContinueUrl: (report?: Report) => '/reports/f3x/submit/' + report?.id,
        },
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'memo/:reportId',
        title: 'Add a report level memo',
        loadComponent: () =>
          import('../shared/report-level-memo/report-level-memo.component').then((m) => m.ReportLevelMemoComponent),
        canActivate: [ReportIsEditableGuard],
        resolve: { report: ReportResolver },
        data: {
          sidebarSection: ReportSidebarSection.REVIEW,
          getNextUrl: (report?: Report) => '/reports/f3x/submit/' + report?.id,
        },
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'submit/:reportId',
        title: 'Submit report',
        loadComponent: () =>
          import('../submission-workflow/submit-report.component').then((m) => m.SubmitReportComponent),
        canActivate: [ReportIsEditableGuard],
        resolve: { report: ReportResolver },
        data: {
          sidebarSection: ReportSidebarSection.SUBMISSION,
          getBackUrl: (report?: Report) => '/reports/f3x/memo/' + report?.id,
          getContinueUrl: (report?: Report) => '/reports/f3x/submit/status/' + report?.id,
        },
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'submit/status/:reportId',
        title: 'Report status',
        loadComponent: () =>
          import('../submission-workflow/submit-report-status.component').then((m) => m.SubmitReportStatusComponent),
        resolve: { report: ReportResolver },
        data: { sidebarSection: ReportSidebarSection.SUBMISSION },
        runGuardsAndResolvers: 'always',
      },
      { path: '**', redirectTo: '' },
    ],
  },
];
