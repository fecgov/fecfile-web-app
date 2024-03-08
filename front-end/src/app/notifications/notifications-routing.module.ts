import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

const NOTIFICATION_ROUTES = [{ path: '**', redirectTo: '' }];

@NgModule({
  imports: [RouterModule.forChild(NOTIFICATION_ROUTES)],
  exports: [RouterModule],
})
export class NotificationsRoutingModule {}
