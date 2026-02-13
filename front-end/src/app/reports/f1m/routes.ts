import { Route } from '@angular/router';
import { ReportResolver } from 'app/shared/resolvers/report.resolver';
import { ReportIsEditableGuard } from 'app/shared/guards/report-is-editable.guard';
import { ReportSidebarSection } from 'app/layout/sidebar/menu-info';
import { ReportService } from 'app/shared/services/report.service';
import type { Report } from 'app/shared/models/reports/report.model';

export const F1M_ROUTES: Route[] = [
  {
    path: '',
    providers: [ReportResolver, ReportService, ReportIsEditableGuard],
    children: [
      {
        path: 'create/step1',
        title: 'Create a report',
        loadComponent: () => import('./main-form/main-form.component').then((m) => m.MainFormComponent),
        data: {
          showSidebar: false,
        },
      },
      {
        path: 'edit/:reportId',
        title: 'Edit a report',
        loadComponent: () => import('./main-form/main-form.component').then((m) => m.MainFormComponent),
        resolve: { report: ReportResolver },
        data: { sidebarSection: ReportSidebarSection.CREATE },
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'web-print/:reportId',
        title: 'Print preview',
        loadComponent: () =>
          import('../shared/print-preview/print-preview.component').then((m) => m.PrintPreviewComponent),
        resolve: { report: ReportResolver },
        data: {
          sidebarSection: ReportSidebarSection.REVIEW,
          getBackUrl: (report?: Report) => '/reports/f1m/edit/' + report?.id,
          getContinueUrl: (report?: Report) => '/reports/f1m/submit/' + report?.id,
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
          getNextUrl: (report?: Report) => '/reports/f1m/submit/' + report?.id,
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
          getBackUrl: (report?: Report) => '/reports/f1m/web-print/' + report?.id,
          getContinueUrl: (report?: Report) => '/reports/f1m/submit/status/' + report?.id,
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
