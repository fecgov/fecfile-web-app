import { Route } from '@angular/router';
import { CreateCommitteeComponent } from 'app/committee/create-committee/create-committee.component';
import { SelectCommitteeComponent } from 'app/committee/select-committee/select-committee.component';
import { HeaderStyles } from 'app/layout/header/header.component';
import { BackgroundStyles } from 'app/layout/layout.component';
import { nameGuard } from 'app/shared/guards/name.guard';
import { loggedInGuard } from 'app/shared/guards/logged-in.guard';
import { securityNoticeGuard } from 'app/shared/guards/security-notice.guard';
import { UpdateCurrentUserComponent } from 'app/users/update-current-user/update-current-user.component';
import { LoginComponent } from './login/login.component';
import { SecurityNoticeComponent } from './security-notice/security-notice.component';

export const LOGIN_ROUTES: Route[] = [
  {
    path: '',
    component: LoginComponent,
    title: 'FECfile+ Login',
    data: {
      showUpperFooter: false,
      showCommitteeBanner: false,
      showFeedbackButton: false,
      headerStyle: HeaderStyles.LOGIN,
      backgroundStyle: BackgroundStyles.LOGIN,
    },
  },
  {
    path: 'security-notice',
    component: SecurityNoticeComponent,
    title: 'Security Notice',
    canActivate: [loggedInGuard, nameGuard],
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
    canActivate: [loggedInGuard, nameGuard, securityNoticeGuard],
    data: {
      showCommitteeBanner: false,
      showUpperFooter: false,
      headerStyle: HeaderStyles.LOGOUT,
    },
  },
  {
    path: 'create-committee',
    title: 'Create Committee',
    component: CreateCommitteeComponent,
    canActivate: [loggedInGuard, nameGuard, securityNoticeGuard],
    data: {
      showCommitteeBanner: false,
      showUpperFooter: false,
      headerStyle: HeaderStyles.LOGOUT,
    },
  },
  {
    path: 'create-profile',
    title: 'Create Profile',
    component: UpdateCurrentUserComponent,
    canActivate: [loggedInGuard],
    data: {
      showCommitteeBanner: false,
      showUpperFooter: false,
      headerStyle: HeaderStyles.LOGOUT,
    },
  },
  { path: '**', redirectTo: '' },
];
