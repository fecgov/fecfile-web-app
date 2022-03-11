import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] = [];

  ngOnInit(): void {
    this.items = [
      {
        label: 'Dashboard',
        routerLink: ['dashboard'],
      },
      {
        label: 'Reports',
      },
      {
        label: 'Contacts',
        routerLink: ['contacts'],
      },
      {
        label: 'Tools',
        items: [
          { label: 'All Transactions' },
          { label: 'Import FECFile' },
          { label: 'Import Transactions' },
          { label: 'Export Transactions' },
          { label: 'Import Contacts' },
          { label: 'Export Contacts' },
          { label: 'First Time COH' },
        ],
      },
      {
        label: 'Help',
        items: [
          { label: 'Help - Link to EFO' },
          { label: 'Feedback' },
          { label: 'User Guide' },
          { label: 'Glossary' },
          { label: 'NextGen System Help' },
        ],
      },
      {
        label: 'Notifications',
      },
      {
        label: 'Profile',
        icon: 'pi pi-fw pi-user',
        items: [{ label: 'Account' }, { label: 'Add User' }, { label: 'Logout' }],
      },
    ];
  }
}
