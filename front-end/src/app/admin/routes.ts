import { Route } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { HeaderStyles } from 'app/layout/header/header.component';
import { CommitteesOverviewComponent } from './dashboards/committees-overview/committees-overview.component';
import { EnableUserComponent } from './tools/enable-user/enable-user.component';
import { DisableUserComponent } from './tools/disable-user/disable-user.component';

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
    path: 'dashboard/committees-overview',
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
  { path: '**', redirectTo: '' },
];
