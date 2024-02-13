import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SecurityNoticeComponent } from './security-notice/security-notice.component';
import { BackgroundStyles } from 'app/layout/layout.component';
import { LoginGuard } from 'app/shared/guards/login-page.guard';
import { nameGuard } from 'app/shared/guards/name.guard';
import { securityNoticeGuard } from 'app/shared/guards/security-notice.guard';
import { SelectCommitteeComponent } from 'app/committee/select-committee/select-committee.component';
import { HeaderStyles } from 'app/layout/header/header.component';
import { UpdateCurrentUserComponent } from 'app/users/update-current-user/update-current-user.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    title: 'FECFile Login',
    data: {
      showUpperFooter: false,
      showCommitteeBanner: false,
      headerStyle: HeaderStyles.LOGIN,
      backgroundStyle: BackgroundStyles.LOGIN,
    },
  },
  {
    path: 'security-notice',
    component: SecurityNoticeComponent,
    title: 'Security Notice',
    canActivate: [LoginGuard, nameGuard],
    data: {
      showCommitteeBanner: false,
      showUpperFooter: false,
      showHeader: false,
      backgroundStyle: BackgroundStyles.SECURITY_NOTICE,
    },
  },
  {
    path: 'select-committee',
    title: 'Select Committee',
    component: SelectCommitteeComponent,
    canActivate: [LoginGuard, nameGuard, securityNoticeGuard],
    data: {
      showUpperFooter: false,
      headerStyle: HeaderStyles.LOGOUT,
    },
  },
  {
    path: 'create-profile',
    title: 'Create Profile',
    component: UpdateCurrentUserComponent,
    canActivate: [LoginGuard],
    data: {
      showCommitteeBanner: false,
      showHeader: false,
      showUpperFooter: false,
    },
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginRoutingModule {}
