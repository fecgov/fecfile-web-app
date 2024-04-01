import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RegisterCommitteeComponent } from 'app/committee/register-committee/register-committee.component';
import { SelectCommitteeComponent } from 'app/committee/select-committee/select-committee.component';
import { HeaderStyles } from 'app/layout/header/header.component';
import { BackgroundStyles } from 'app/layout/layout.component';
import { nameGuard } from 'app/shared/guards/name.guard';
import { securityNoticeGuard } from 'app/shared/guards/security-notice.guard';
import { UpdateCurrentUserComponent } from 'app/users/update-current-user/update-current-user.component';
import { LoginComponent } from './login/login.component';
import { SecurityNoticeComponent } from './security-notice/security-notice.component';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: '',
      component: LoginComponent,
      title: 'FECFile Login',
      data: {
        showUpperFooter: false,
        showCommitteeBanner: false,
        headerStyle: HeaderStyles.LOGIN,
        backgroundStyle: BackgroundStyles.LOGIN
      }
    },
    {
      path: 'security-notice',
      component: SecurityNoticeComponent,
      title: 'Security Notice',
      canActivate: [nameGuard],
      data: {
        showCommitteeBanner: false,
        showUpperFooter: false,
        showHeader: false,
        backgroundStyle: BackgroundStyles.SECURITY_NOTICE
      }
    },
    {
      path: 'select-committee',
      title: 'Select Committee',
      component: SelectCommitteeComponent,
      canActivate: [nameGuard, securityNoticeGuard],
      data: {
        showCommitteeBanner: false,
        showUpperFooter: false,
        headerStyle: HeaderStyles.LOGOUT
      }
    },
    {
      path: 'register-committee',
      title: 'Register Committee',
      component: RegisterCommitteeComponent,
      canActivate: [nameGuard, securityNoticeGuard],
      data: {
        showCommitteeBanner: false,
        showUpperFooter: false,
        headerStyle: HeaderStyles.LOGOUT
      }
    },
    {
      path: 'create-profile',
      title: 'Create Profile',
      component: UpdateCurrentUserComponent,
      canActivate: [],
      data: {
        showCommitteeBanner: false,
        showHeader: false,
        showUpperFooter: false
      }
    },
    { path: '**', redirectTo: '' }
  ])],
  exports: [RouterModule]
})
export class LoginRoutingModule {}
