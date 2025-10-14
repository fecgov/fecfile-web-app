import { Route } from '@angular/router';
import { ReportIsEditableGuard } from '../../shared/guards/report-is-editable.guard';
import { MainFormComponent } from './main-form/main-form.component';
import { ReportSidebarSection } from 'app/layout/sidebar/sidebar.component';
import { ReportResolver } from 'app/shared/resolvers/report.resolver';
import { PrintPreviewComponent } from 'app/reports/shared/print-preview/print-preview.component';
import { SubmitReportComponent } from '../submission-workflow/submit-report.component';
import { Report } from 'app/shared/models/report.model';
import { SubmitReportStatusComponent } from '../submission-workflow/submit-report-status.component';

// ROUTING NOTE:
// Due to lifecycle conflict issues between the ReportIsEditableGuard and the
// ReportResolver, both the guard and the resovler read the :reportId in the URL
// and put the report for the ID in the ActiveReport value in the ngrx store. As a result:
// 1) The component will pull the active report from the ngrx store and not the ActivatedRoute.snapshot.
// 2) The ReportResolver should not be declared on routes with a ReportIsEditableGuard declared.

export const F99_ROUTES: Route[] = [
  {
    path: 'create',
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
      getBackUrl: (report?: Report) => '/reports/f99/edit/' + report?.id,
      getContinueUrl: (report?: Report) => '/reports/f99/submit/' + report?.id,
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
      getBackUrl: (report?: Report) => '/reports/f99/web-print/' + report?.id,
      getContinueUrl: (report?: Report) => '/reports/f99/submit/status/' + report?.id,
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
