import { Route } from '@angular/router';
import { BackgroundStyles, LayoutComponent } from './layout/layout.component';
import { committeeGuard } from './shared/guards/committee.guard';
import { nameGuard } from './shared/guards/name.guard';
import { loggedInGuard } from './shared/guards/logged-in.guard';
import { securityNoticeGuard } from './shared/guards/security-notice.guard';
import { SingleClickResolver } from './shared/resolvers/single-click.resolver';
import { committeeOwnerGuard } from './shared/guards/committee-owner.guard';
import { CookiesDisabledComponent } from './shared/components/cookies-disabled/cookies-disabled.component';

export const ROUTES: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    resolve: { singleClick: SingleClickResolver },
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: 'cookies-disabled',
        component: CookiesDisabledComponent,
        data: {
          backgroundStyle: BackgroundStyles.SECURITY_NOTICE,
          showHeader: false,
          showUpperFooter: false,
         },
      },
      {
        path: 'committee',
        loadChildren: () => import('./committee/routes').then((mod) => mod.COMMITTEE_ROUTES),
        canActivate: [committeeOwnerGuard],
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'reports',
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
        canActivate: [loggedInGuard, nameGuard, securityNoticeGuard, committeeGuard, committeeOwnerGuard],
      },
      {
        path: 'tools',
        loadChildren: () => import('./tools/routes').then((mod) => mod.TOOLS_ROUTES),
        canActivate: [loggedInGuard, nameGuard, securityNoticeGuard, committeeGuard, committeeOwnerGuard],
      },
      {
        path: 'help',
        loadChildren: () => import('./help/routes').then((mod) => mod.HELP_ROUTES),
        canActivate: [loggedInGuard, nameGuard, securityNoticeGuard, committeeGuard, committeeOwnerGuard],
      },
      {
        path: 'notifications',
        loadChildren: () => import('./notifications/routes').then((mod) => mod.NOTIFICATION_ROUTES),
        canActivate: [loggedInGuard, nameGuard, securityNoticeGuard, committeeGuard, committeeOwnerGuard],
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
