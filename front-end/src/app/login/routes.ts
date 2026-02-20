import { Route } from '@angular/router';
import { BackgroundStyles } from 'app/layout/layout.component';
import { nameGuard } from 'app/shared/guards/name.guard';
import { securityNoticeGuard } from 'app/shared/guards/security-notice.guard';
import { HeaderStyles } from 'app/layout/header/header-styles';
import { loggedInGuard } from 'app/shared/guards/logged-in.guard';

export const LOGIN_ROUTES: Route[] = [
  {
    path: '',
    title: 'FECfile+ Login',
    loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent),
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
    title: 'Security Notice',
    loadComponent: () => import('./security-notice/security-notice.component').then((m) => m.SecurityNoticeComponent),
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
    loadComponent: () =>
      import('app/committee/select-committee/select-committee.component').then((m) => m.SelectCommitteeComponent),
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
    loadComponent: () =>
      import('app/committee/create-committee/create-committee.component').then((m) => m.CreateCommitteeComponent),
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
    loadComponent: () =>
      import('app/users/update-current-user/update-current-user.component').then((m) => m.UpdateCurrentUserComponent),
    canActivate: [loggedInGuard],
    data: {
      showCommitteeBanner: false,
      showUpperFooter: false,
      headerStyle: HeaderStyles.LOGOUT,
    },
  },
  { path: '**', redirectTo: '' },
];