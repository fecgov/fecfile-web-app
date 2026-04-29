import { Component } from '@angular/core';
import { SidebarComponent } from './sidebar.component';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-security-notice-sidebar',
  standalone: true,
  imports: [SidebarComponent],
  template: ` <app-sidebar [items]="items" textColor="text-primary"> </app-sidebar> `,
  styles: `
    #sidebar-container {
      background-color: grey;
    }
  `,
})
export class SecurityNoticeSidebarComponent {
  readonly items: MenuItem[] = [
    { label: 'Overview' },
    { label: 'Terms of service' },
    { label: 'Acceptable use policy' },
    { label: 'Sale or use restriction ' },
    { label: 'Privacy and data use' },
    { label: 'Consent' },
  ];
}
