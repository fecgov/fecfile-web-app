import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginGuard } from './shared/guards/login-page.guard';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full',
    canActivate: [LoginGuard],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        title: 'FECFile Dashboard',
      },
      {
        path: 'reports',
        loadChildren: () => import('./reports/reports.module').then((m) => m.ReportsModule),
      },
      { path: 'contacts', loadChildren: () => import('./contacts/contacts.module').then((m) => m.ContactsModule) },
      { path: 'committee/users', loadChildren: () => import('./users/users.module').then((m) => m.UsersModule) },
      { path: 'tools', loadChildren: () => import('./tools/tools.module').then((m) => m.ToolsModule) },
      { path: 'help', loadChildren: () => import('./help/help.module').then((m) => m.HelpModule) },
      {
        path: 'notifications',
        loadChildren: () => import('./notifications/notifications.module').then((m) => m.NotificationsModule),
      },
      { path: 'profile', loadChildren: () => import('./profile/profile.module').then((m) => m.ProfileModule) },
      {
        path: 'transactions',
        loadChildren: () => import('./transactions/transactions.module').then((m) => m.TransactionsModule),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
