import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainFormComponent } from './main-form/main-form.component';
import { ReportResolver } from 'app/shared/resolvers/report.resolver';
import { SidebarStateResolver } from 'app/shared/resolvers/sidebar-state.resolver';
import { ReportSidebarSection } from 'app/layout/sidebar/sidebar.component';
import { SubmitReportStep1Component } from '../submission-workflow/submit-report-step1.component';
import { ReportIsEditableGuard } from 'app/shared/guards/report-is-editable.guard';
import { Report } from 'app/shared/models/report.model';
import { PrintPreviewComponent } from '../shared/print-preview/print-preview.component';
import { SubmitReportStep2Component } from '../submission-workflow/submit-report-step2.component';
import { SubmitReportStatusComponent } from '../submission-workflow/submit-report-status.component';

const routes: Routes = [
  {
    path: 'create/step1',
    title: 'Create a report',
    component: MainFormComponent,
  },
  {
    path: 'edit/:reportId',
    title: 'Edit a report',
    component: MainFormComponent,
    resolve: { report: ReportResolver, sidebar: SidebarStateResolver },
    data: { sidebarSection: ReportSidebarSection.CREATE },
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'web-print/:reportId',
    title: 'Print preview',
    component: PrintPreviewComponent,
    resolve: { report: ReportResolver, sidebar: SidebarStateResolver },
    data: {
      sidebarSection: ReportSidebarSection.REVIEW,
      getBackUrl: (report?: Report) => '/reports/f1m/edit/' + report?.id,
      getContinueUrl: (report?: Report) => '/reports/f1m/submit/step1/' + report?.id,
    },
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'submit/step1/:reportId',
    title: 'Confirm information',
    component: SubmitReportStep1Component,
    canActivate: [ReportIsEditableGuard],
    resolve: { report: ReportResolver, sidebar: SidebarStateResolver },
    data: {
      sidebarSection: ReportSidebarSection.SUBMISSION,
      getBackUrl: (report?: Report) => '/reports/f1m/web-print/' + report?.id,
      getContinueUrl: (report?: Report) => '/reports/f1m/submit/step2/' + report?.id,
    },
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'submit/step2/:reportId',
    title: 'Submit report',
    component: SubmitReportStep2Component,
    canActivate: [ReportIsEditableGuard],
    resolve: { report: ReportResolver, sidebar: SidebarStateResolver },
    data: {
      sidebarSection: ReportSidebarSection.SUBMISSION,
      getBackUrl: (report?: Report) => '/reports/f1m/submit/step1/' + report?.id,
      getContinueUrl: (report?: Report) => '/reports/f1m/submit/status/' + report?.id,
    },
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'submit/status/:reportId',
    title: 'Report status',
    component: SubmitReportStatusComponent,
    resolve: { report: ReportResolver, sidebar: SidebarStateResolver },
    data: { sidebarSection: ReportSidebarSection.SUBMISSION },
    runGuardsAndResolvers: 'always',
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class F1MRoutingModule {}
