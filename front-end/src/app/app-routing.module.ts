import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './app-main-login/login/login.component';
import { TwoFactorLoginComponent } from './app-main-login/two-factor-login/two-factor-login.component';
import { ConfirmTwoFactorComponent } from './app-main-login/confirm-two-factor/confirm-two-factor.component';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full',
  },
  { path: 'twoFactLogin', component: TwoFactorLoginComponent },
  { path: 'confirm-2f', component: ConfirmTwoFactorComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'contacts', loadChildren: () => import('./contacts/contacts.module').then((m) => m.ContactsModule) },
    ],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
