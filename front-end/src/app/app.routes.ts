import { PersonalKeyComponent } from './app-main-login/personal-key/personal-key.component';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { ManageUserComponent } from './admin/manage-user/manage-user.component';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { ConfirmTwoFactorComponent } from './app-main-login/confirm-two-factor/confirm-two-factor.component';
import { LoginComponent } from './app-main-login/login/login.component';
import { RegisterComponent } from './app-main-login/register/register.component';
import { TwoFactorLoginComponent } from './app-main-login/two-factor-login/two-factor-login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportheaderComponent } from './reports/reportheader/reportheader.component';
import { Roles } from './shared/enums/Roles';
import { CanActivateGuard } from './shared/utils/can-activate/can-activate.guard';

export const AppRoutes: Routes = [
  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full',
  },
  { path: 'register', component: RegisterComponent, pathMatch: 'full' },
  { path: 'enterSecCode', component: ConfirmTwoFactorComponent, pathMatch: 'full' },
  { path: 'showPersonalKey', component: PersonalKeyComponent, pathMatch: 'full' },
  { path: 'twoFactLogin', component: TwoFactorLoginComponent, pathMatch: 'full', canActivate: [CanActivateGuard] },
  { path: 'confirm-2f', component: ConfirmTwoFactorComponent, pathMatch: 'full', canActivate: [CanActivateGuard] },
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, pathMatch: 'full', canActivate: [CanActivateGuard] },
      {
        path: 'reports',
        component: ReportheaderComponent,
        pathMatch: 'full',
        canActivate: [CanActivateGuard],
      },
      { path: 'account', component: AccountComponent, pathMatch: 'full', canActivate: [CanActivateGuard] },
      {
        path: 'manage_users',
        component: ManageUserComponent,
        pathMatch: 'full',
        canActivate: [CanActivateGuard],
        data: {
          role: [Roles.CommitteeAdmin, Roles.BackupCommitteeAdmin],
        },
      },
    ],
  },
  { path: '**', redirectTo: '' },
];

export const routing = RouterModule.forRoot(AppRoutes, {
  useHash: true,
  enableTracing: false,
  onSameUrlNavigation: 'reload',
  relativeLinkResolution: 'legacy',
});
