import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainFormComponent } from './main-form/main-form.component';
import { ReportResolver } from 'app/shared/resolvers/report.resolver';
import { SidebarStateResolver } from 'app/shared/resolvers/sidebar-state.resolver';
import { ReportSidebarSection } from 'app/layout/sidebar/sidebar.component';
import { PrintPreviewComponent } from '../shared/print-preview/print-preview.component';
import { Report } from 'app/shared/models/report.model';
import { ReportLevelMemoComponent } from '../shared/report-level-memo/report-level-memo.component';
import { ReportIsEditableGuard } from 'app/shared/guards/report-is-editable.guard';

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
      getContinueUrl: (report?: Report) => '/reports/f1m/edit/' + report?.id,
    },
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'memo/:reportId',
    title: 'Add a report level memo',
    component: ReportLevelMemoComponent,
    canActivate: [ReportIsEditableGuard],
    resolve: { report: ReportResolver, sidebar: SidebarStateResolver },
    data: {
      sidebarSection: ReportSidebarSection.REVIEW,
      getNextUrl: (report?: Report) => '/reports/f1m/edit/' + report?.id,
    },
    runGuardsAndResolvers: 'always',
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class F1MRoutingModule {}
