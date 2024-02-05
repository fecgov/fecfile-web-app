import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutComponent } from './layout/layout.component';
import { SidebarStateResolver } from './shared/resolvers/sidebar-state.resolver';
import { SingleClickResolver } from './shared/resolvers/single-click.resolver';
import { committeeGuard } from './shared/guards/committee.guard';
import { SelectCommitteeComponent } from './committee/select-committee/select-committee.component';
import { LoginComponent } from './login/login/login.component';

const routes: Routes = [
  {
    path: 'login',
    component: LayoutComponent,
    children:[{path: '', component: LoginComponent, resolve: { sidebar: SidebarStateResolver }}]
  },
  {
    path: 'select-committee',
    component: LayoutComponent,
    children: [{ path: '', component: SelectCommitteeComponent, resolve: { sidebar: SidebarStateResolver } }],
  },
  {
    path: '',
    component: LayoutComponent,
    resolve: { sidebar: SidebarStateResolver, singleClick: SingleClickResolver },
    canActivate: [committeeGuard],
    runGuardsAndResolvers: 'always',
    children: [
      { path: 'committee', loadChildren: () => import('./committee/committee.module').then((m) => m.CommitteeModule) },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        title: 'FECFile Dashboard',
      },
      {
        path: 'login',
        loadChildren: () => import('./login/login.module').then((m) => m.LoginModule),
      },
      {
        path: 'reports',
        loadChildren: () => import('./reports/reports.module').then((m) => m.ReportsModule),
      },
      {
        path: 'contacts',
        loadChildren: () => import('./contacts/contacts.module').then((m) => m.ContactsModule),
      },
      {
        path: 'tools',
        loadChildren: () => import('./tools/tools.module').then((m) => m.ToolsModule),
      },
      {
        path: 'help',
        loadChildren: () => import('./help/help.module').then((m) => m.HelpModule),
      },
      {
        path: 'notifications',
        loadChildren: () => import('./notifications/notifications.module').then((m) => m.NotificationsModule),
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
