import { Route } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { HeaderStyles } from 'app/layout/header/header.component';
import { CommitteesOverviewComponent } from './dashboards/committees-overview/committees-overview.component';
import { EnableUserComponent } from './tools/enable-user/enable-user.component';
import { DisableUserComponent } from './tools/disable-user/disable-user.component';
import { AddUserToCommitteeComponent } from './tools/add-user-to-committee/add-user-to-committee.component';
import { ResetSubmittingReportComponent } from './tools/reset-submitting-report/reset-submitting-report.component';
import { FailOpenSubmissionsComponent } from './tools/fail-open-submissions/fail-open-submissions.component';

const adminPathData = {
  showUpperFooter: false,
  showCommitteeBanner: false,
  showFeedbackButton: false,
  headerStyle: HeaderStyles.ADMIN,
};

export const ADMIN_ROUTES: Route[] = [
  {
    path: '',
    component: AdminComponent,
    title: 'System Administration',
    pathMatch: 'full',
    data: adminPathData,
  },
  {
    path: 'dashboards/committees-overview',
    component: CommitteesOverviewComponent,
    title: 'Registered Committees Overview',
    pathMatch: 'full',
    data: adminPathData,
  },
  {
    path: 'tools/enable-user',
    component: EnableUserComponent,
    title: 'Enable User',
    pathMatch: 'full',
    data: adminPathData,
  },
  {
    path: 'tools/disable-user',
    component: DisableUserComponent,
    title: 'Disable User',
    pathMatch: 'full',
    data: adminPathData,
  },
  {
    path: 'tools/reset-submitting-report',
    component: ResetSubmittingReportComponent,
    title: 'Reset Submitting Report',
    pathMatch: 'full',
    data: adminPathData,
  },
  {
    path: 'tools/fail-open-submissions',
    component: FailOpenSubmissionsComponent,
    title: 'Fail Open submissions',
    pathMatch: 'full',
    data: adminPathData,
  },
  {
    path: 'tools/add-user-to-committee',
    component: AddUserToCommitteeComponent,
    title: 'Add User To Committee',
    pathMatch: 'full',
    data: adminPathData,
  },
  {
    path: 'tools/add-user-to-committee/:committee_id',
    component: AddUserToCommitteeComponent,
    title: 'Add User To Committee',
    pathMatch: 'full',
    data: adminPathData,
    runGuardsAndResolvers: 'always',
  },
  { path: '**', redirectTo: '' },
];
