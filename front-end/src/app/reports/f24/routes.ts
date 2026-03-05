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

export const F24_ROUTES: Route[] = [
  {
    path: '',
    providers: [ReportResolver, ReportService, ReportIsEditableGuard],
    children: [
      {
        path: 'report/:reportId/transactions/select/independent-expenditures',
        loadComponent: () =>
          import('./transaction-independent-expenditure-picker/transaction-independent-expenditure-picker.component').then(
            (m) => m.TransactionIndependentExpenditurePickerComponent,
          ),
        canActivate: [ReportIsEditableGuard],
        resolve: { report: ReportResolver },
        data: {
          sidebarSection: ReportSidebarSection.TRANSACTIONS,
        },
      },
      {
        path: 'web-print/:reportId',
        title: 'Print preview',
        loadComponent: () =>
          import('app/reports/shared/print-preview/print-preview.component').then((m) => m.PrintPreviewComponent),
        resolve: { report: ReportResolver },
        data: {
          sidebarSection: ReportSidebarSection.REVIEW,
          getBackUrl: (report?: Report) => `/reports/f24/transactions/${report?.id}/list`,
          getContinueUrl: (report?: Report) => '/reports/f24/submit/' + report?.id,
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
          getBackUrl: (report?: Report) => '/reports/f24/web-print/' + report?.id,
          getContinueUrl: (report?: Report) => '/reports/f24/submit/status/' + report?.id,
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
      {
        path: 'memo/:reportId',
        title: 'Add a report level memo',
        loadComponent: () =>
          import('../shared/report-level-memo/report-level-memo.component').then((m) => m.ReportLevelMemoComponent),
        canActivate: [ReportIsEditableGuard],
        resolve: { report: ReportResolver },
        data: {
          sidebarSection: ReportSidebarSection.REVIEW,
          getNextUrl: (report?: Report) => `/reports/transactions/report/${report?.id}/list`,
        },
        runGuardsAndResolvers: 'always',
      },
      { path: '**', redirectTo: '' },
    ],
  },
];
