import { Route } from '@angular/router';
import { MainFormComponent } from './main-form/main-form.component';
import { ReportResolver } from 'app/shared/resolvers/report.resolver';
import { ReportSidebarSection } from 'app/layout/sidebar/sidebar.component';
import { ReportIsEditableGuard } from 'app/shared/guards/report-is-editable.guard';
import { Report } from 'app/shared/models/report.model';
import { PrintPreviewComponent } from '../shared/print-preview/print-preview.component';
import { SubmitReportStatusComponent } from '../submission-workflow/submit-report-status.component';
import { ReportLevelMemoComponent } from '../shared/report-level-memo/report-level-memo.component';
import { SubmitReportComponent } from '../submission-workflow/submit-report.component';

export const F1M_ROUTES: Route[] = [
  {
    path: 'create/step1',
    title: 'Create a report',
    component: MainFormComponent,
    data: {
      showSidebar: false,
    },
  },
  {
    path: 'edit/:reportId',
    title: 'Edit a report',
    component: MainFormComponent,
    resolve: { report: ReportResolver },
    data: { sidebarSection: ReportSidebarSection.CREATE },
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'web-print/:reportId',
    title: 'Print preview',
    component: PrintPreviewComponent,
    resolve: { report: ReportResolver },
    data: {
      sidebarSection: ReportSidebarSection.REVIEW,
      getBackUrl: (report?: Report) => '/reports/f1m/edit/' + report?.id,
      getContinueUrl: (report?: Report) => '/reports/f1m/submit/step1/' + report?.id,
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
      getNextUrl: (report?: Report) => '/reports/f1m/submit/step1/' + report?.id,
    },
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'submit/:reportId',
    title: 'Submit report',
    component: SubmitReportComponent,
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
    component: SubmitReportStatusComponent,
    resolve: { report: ReportResolver },
    data: { sidebarSection: ReportSidebarSection.SUBMISSION },
    runGuardsAndResolvers: 'always',
  },
  { path: '**', redirectTo: '' },
];
