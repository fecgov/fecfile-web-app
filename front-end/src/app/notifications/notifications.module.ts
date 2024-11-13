import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { NotificationsRoutingModule } from './notifications-routing.module';

@NgModule({
  imports: [CommonModule, NotificationsRoutingModule, SharedModule, ButtonModule, CardModule],
})
export class NotificationsModule {}
