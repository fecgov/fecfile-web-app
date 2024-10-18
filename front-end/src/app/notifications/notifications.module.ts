import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'primeng/api';
import { SecurityNotificationComponent } from '../notifications/security-notification/security-notification.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { NotificationsRoutingModule } from './notifications-routing.module';

@NgModule({
  declarations: [SecurityNotificationComponent],
  imports: [CommonModule, NotificationsRoutingModule, SharedModule, ButtonModule, CardModule],
})
export class NotificationsModule {}
