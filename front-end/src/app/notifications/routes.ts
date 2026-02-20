import { Route } from '@angular/router';
import { loggedInGuard } from 'app/shared/guards/logged-in.guard';
import { nameGuard } from 'app/shared/guards/name.guard';

export const NOTIFICATION_ROUTES: Route[] = [
  {
    path: 'security',
    loadComponent: () =>
      import('app/login/security-notice/security-notice.component').then((m) => m.SecurityNoticeComponent),
    title: 'Security Notice',
    canActivate: [loggedInGuard, nameGuard],
    data: {
      showCommitteeBanner: false,
    },
  },
  { path: '**', redirectTo: '' },
];
