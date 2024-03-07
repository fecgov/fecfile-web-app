import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { committeeGuard } from './shared/guards/committee.guard';
import { loginGuard } from './shared/guards/login.guard';
import { nameGuard } from './shared/guards/name.guard';
import { securityNoticeGuard } from './shared/guards/security-notice.guard';
import { SingleClickResolver } from './shared/resolvers/single-click.resolver';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    resolve: { singleClick: SingleClickResolver },
    runGuardsAndResolvers: 'always',
    children: [
      { path: 'committee', loadChildren: () => import('./committee/committee.module').then((m) => m.CommitteeModule) },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        title: 'FECFile Dashboard',
        canActivate: [loginGuard, nameGuard, securityNoticeGuard, committeeGuard],
      },
      {
        path: 'login',
        loadChildren: () => import('./login/login.module').then((m) => m.LoginModule),
      },
      {
        path: 'reports',
        loadChildren: () => import('./reports/reports.module').then((m) => m.ReportsModule),
        data: {
          showSidebar: true,
        },
        canActivate: [loginGuard, nameGuard, securityNoticeGuard, committeeGuard],
      },
      {
        path: 'contacts',
        loadChildren: () => import('./contacts/contacts.module').then((m) => m.ContactsModule),
        canActivate: [loginGuard, nameGuard, securityNoticeGuard, committeeGuard],
      },
      {
        path: 'tools',
        loadChildren: () => import('./tools/tools.module').then((m) => m.ToolsModule),
        canActivate: [loginGuard, nameGuard, securityNoticeGuard, committeeGuard],
      },
      {
        path: 'help',
        loadChildren: () => import('./help/help.module').then((m) => m.HelpModule),
        canActivate: [loginGuard, nameGuard, securityNoticeGuard, committeeGuard],
      },
      {
        path: 'notifications',
        loadChildren: () => import('./notifications/notifications.module').then((m) => m.NotificationsModule),
        canActivate: [loginGuard, nameGuard, securityNoticeGuard, committeeGuard],
      },
    ],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
      // Fixes bug that had window scroll position being preserved between routes.
      // https://stackoverflow.com/questions/39601026/angular-2-scroll-to-top-on-route-change
      scrollPositionRestoration: 'top',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule { }
