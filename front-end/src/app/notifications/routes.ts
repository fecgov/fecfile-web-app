import { Route } from '@angular/router';
import { loggedInGuard } from 'app/shared/guards/logged-in.guard';
import { nameGuard } from 'app/shared/guards/name.guard';
import { SecurityNoticeComponent } from 'app/login/security-notice/security-notice.component';

export const NOTIFICATION_ROUTES: Route[] = [
  {
    path: 'security',
    component: SecurityNoticeComponent,
    title: 'Security Notice',
    canActivate: [loggedInGuard, nameGuard],
    data: {
      showCommitteeBanner: false,
    },
  },
  { path: '**', redirectTo: '' },
];
