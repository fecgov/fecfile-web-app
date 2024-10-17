import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { loggedInGuard } from 'app/shared/guards/logged-in.guard';
import { nameGuard } from 'app/shared/guards/name.guard';
import { SecurityNotificationComponent } from './security-notification/security-notification.component';

const routes: Routes = [
  {
    path: 'security',
    component: SecurityNotificationComponent,
    title: 'Security Notice',
    canActivate: [loggedInGuard, nameGuard],
    data: {
      showCommitteeBanner: false,
    },
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationsRoutingModule {}
