import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { SidebarStateResolver } from './shared/resolvers/sidebar-state.resolver';
import { SingleClickResolver } from './shared/resolvers/single-click.resolver';
import { UserLoginDataGuard } from './shared/guards/user-login-data.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    resolve: { sidebar: SidebarStateResolver, singleClick: SingleClickResolver },
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: 'dashboard',
        canActivateChild: [UserLoginDataGuard],
        component: DashboardComponent,
        title: 'FECFile Dashboard',
      },
      {
        path: 'login',
        loadChildren: () => import('./login/login.module').then((m) => m.LoginModule),
      },
      {
        path: 'reports',
        canActivateChild: [UserLoginDataGuard],
        loadChildren: () => import('./reports/reports.module').then((m) => m.ReportsModule),
      },
      {
        path: 'contacts',
        loadChildren: () => import('./contacts/contacts.module').then((m) => m.ContactsModule),
        canActivateChild: [UserLoginDataGuard],
      },
      {
        path: 'committee/users',
        loadChildren: () => import('./users/users.module').then((m) => m.UsersModule),
        canActivateChild: [UserLoginDataGuard],
      },
      {
        path: 'tools',
        loadChildren: () => import('./tools/tools.module').then((m) => m.ToolsModule),
        canActivateChild: [UserLoginDataGuard],
      },
      {
        path: 'help',
        loadChildren: () => import('./help/help.module').then((m) => m.HelpModule),
        canActivateChild: [UserLoginDataGuard],
      },
      {
        path: 'notifications',
        loadChildren: () => import('./notifications/notifications.module').then((m) => m.NotificationsModule),
        canActivateChild: [UserLoginDataGuard],
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then((m) => m.ProfileModule),
        canActivateChild: [UserLoginDataGuard],
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
export class AppRoutingModule {}
