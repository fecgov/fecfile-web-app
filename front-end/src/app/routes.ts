import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { committeeGuard } from './shared/guards/committee.guard';
import { nameGuard } from './shared/guards/name.guard';
import { loggedInGuard } from './shared/guards/logged-in.guard';
import { securityNoticeGuard } from './shared/guards/security-notice.guard';
import { SingleClickResolver } from './shared/resolvers/single-click.resolver';

export const ROUTES: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    resolve: { singleClick: SingleClickResolver },
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: 'committee',
        loadChildren: () => import('./committee/routes').then((mod) => mod.COMMITTEE_ROUTES),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'reports',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        title: 'FECFile Dashboard',
        canActivate: [loggedInGuard, nameGuard, securityNoticeGuard, committeeGuard],
      },
      {
        path: 'login',
        loadChildren: () => import('./login/routes').then((mod) => mod.LOGIN_ROUTES),
      },
      {
        path: 'reports',
        loadChildren: () => import('./reports/routes').then((mod) => mod.REPORTS_ROUTES),
        data: {
          showSidebar: true,
        },
        canActivate: [loggedInGuard, nameGuard, securityNoticeGuard, committeeGuard],
      },
      {
        path: 'contacts',
        loadChildren: () => import('./contacts/routes').then((mod) => mod.CONTACTS_ROUTES),
        canActivate: [loggedInGuard, nameGuard, securityNoticeGuard, committeeGuard],
      },
      {
        path: 'tools',
        loadChildren: () => import('./tools/routes').then((mod) => mod.TOOLS_ROUTES),
        canActivate: [loggedInGuard, nameGuard, securityNoticeGuard, committeeGuard],
      },
      {
        path: 'help',
        loadChildren: () => import('./help/routes').then((mod) => mod.HELP_ROUTES),
        canActivate: [loggedInGuard, nameGuard, securityNoticeGuard, committeeGuard],
      },
      {
        path: 'notifications',
        loadChildren: () => import('./notifications/routes').then((mod) => mod.NOTIFICATION_ROUTES),
        canActivate: [loggedInGuard, nameGuard, securityNoticeGuard, committeeGuard],
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
