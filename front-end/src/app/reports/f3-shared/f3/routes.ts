import { Route } from '@angular/router';
import { reportResolver } from 'app/shared/resolvers/report.resolver';
import { ReportLevelMemoComponent } from '../../shared/report-level-memo/report-level-memo.component';
import { PrintPreviewComponent } from 'app/reports/shared/print-preview/print-preview.component';
import { ReportIsEditableGuard } from '../../../shared/guards/report-is-editable.guard';
import { SubmitReportComponent } from '../../submission-workflow/submit-report.component';
import { Report } from 'app/shared/models/reports/report.model';
import { SubmitReportStatusComponent } from '../../submission-workflow/submit-report-status.component';
import { CreateSharedF3Component } from '../create-shared-f3/create-shared-f3.component';
import { ReportSidebarSection } from 'app/layout/sidebar/menu-info';
import { Form3Service } from 'app/shared/services/form-3.service';
import { FORM_3_SERVICE } from 'app/shared/services/base-form-3.service';
import { UpdateVersionNumberComponent } from 'app/reports/shared/update-version-number/update-version-number.component';
import { featureFlagGuard } from 'app/shared/guards/feature-flag.guard';
import { ReportDetailedSummaryComponent } from '../summaries/report-detailed-summary/report-detailed-summary.component';
import { ReportSummaryComponent } from '../summaries/report-summary/report-summary.component';
import {
  f3DetailedSummaryResolver,
  sharedForm3Resolver,
  f3SummaryResolver,
} from 'app/shared/resolvers/shared-form3.resolver';
import { ElectionCycleService } from 'app/tools/election-cycle/election-cycle.service';

// ROUTING NOTE:
// Due to lifecycle conflict issues between the ReportIsEditableGuard and the
// reportResolver, both the guard and the resovler read the :reportId in the URL
// and put the report for the ID in the ActiveReport value in the ngrx store. As a result:
// 1) The component will pull the active report from the ngrx store and not the ActivatedRoute.snapshot.
// 2) The reportResolver should not be declared on routes with a ReportIsEditableGuard declared.

export const F3_ROUTES: Route[] = [
  {
    path: 'create',
    title: 'Create a report',
    component: CreateSharedF3Component,
    providers: [{ provide: FORM_3_SERVICE, useClass: Form3Service }],
    resolve: { reportCoverage: sharedForm3Resolver },
    data: {
      sidebar: null,
    },
  },
  {
    path: 'edit/:reportId',
    title: 'Edit a report',
    component: CreateSharedF3Component,
    providers: [{ provide: FORM_3_SERVICE, useClass: Form3Service }],
    resolve: { reportCoverage: sharedForm3Resolver },
    data: { sidebarSection: ReportSidebarSection.EDIT },
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'update-version-number/:reportId',
    title: 'Update Version Number',
    component: UpdateVersionNumberComponent,
    resolve: { report: reportResolver },
    data: { sidebarSection: ReportSidebarSection.EDIT },
    runGuardsAndResolvers: 'always',
    canActivate: [featureFlagGuard('manualReportVersion')],
  },
  {
    path: 'summary/:reportId',
    title: 'View summary page',
    component: ReportSummaryComponent,
    providers: [ElectionCycleService, { provide: FORM_3_SERVICE, useClass: Form3Service }],
    resolve: { reportLines: f3SummaryResolver },
    data: { sidebarSection: ReportSidebarSection.REVIEW },
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'detailed-summary/:reportId',
    title: 'View detailed summary page',
    component: ReportDetailedSummaryComponent,
    providers: [ElectionCycleService, { provide: FORM_3_SERVICE, useClass: Form3Service }],
    resolve: { reportLines: f3DetailedSummaryResolver },
    data: { sidebarSection: ReportSidebarSection.REVIEW },
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'web-print/:reportId',
    title: 'Print preview',
    component: PrintPreviewComponent,
    resolve: { report: reportResolver },
    data: {
      sidebarSection: ReportSidebarSection.REVIEW,
      getBackUrl: (report?: Report) => '/reports/f3/detailed-summary/' + report?.id,
      getContinueUrl: (report?: Report) => '/reports/f3/submit/' + report?.id,
    },
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'memo/:reportId',
    title: 'Add a report level memo',
    component: ReportLevelMemoComponent,
    canActivate: [ReportIsEditableGuard],
    resolve: { report: reportResolver },
    data: {
      sidebarSection: ReportSidebarSection.REVIEW,
      getNextUrl: (report?: Report) => '/reports/f3/submit/' + report?.id,
    },
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'submit/:reportId',
    title: 'Submit report',
    component: SubmitReportComponent,
    canActivate: [ReportIsEditableGuard],
    resolve: { report: reportResolver },
    data: {
      sidebarSection: ReportSidebarSection.SUBMISSION,
      getBackUrl: (report?: Report) => '/reports/f3/memo/' + report?.id,
      getContinueUrl: (report?: Report) => '/reports/f3/submit/status/' + report?.id,
    },
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'submit/status/:reportId',
    title: 'Report status',
    component: SubmitReportStatusComponent,
    resolve: { report: reportResolver },
    data: { sidebarSection: ReportSidebarSection.SUBMISSION },
    runGuardsAndResolvers: 'always',
  },
  { path: '**', redirectTo: '' },
];
