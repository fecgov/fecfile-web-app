import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';

const routerLink = 'notifications/security';

@Component({
  selector: 'app-security-notice-sidebar',
  standalone: true,
  imports: [MenuModule],
  template: ` <p-menu [model]="items"> </p-menu> `,
})
export class SecurityNoticeSidebarComponent {
  readonly items: MenuItem[] = [
    { label: 'Overview', routerLink, fragment: 'overview' },
    { label: 'Terms of service', routerLink, fragment: 'tos' },
    { label: 'Acceptable use policy', routerLink, fragment: 'aup' },
    { label: 'Sale or use restriction', routerLink, fragment: 'sur' },
    { label: 'Privacy and data use', routerLink, fragment: 'pdu' },
    { label: 'Consent', routerLink, fragment: 'consent' },
  ];
}
