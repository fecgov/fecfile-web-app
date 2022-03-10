import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] = [];
  constructor() {}

  ngOnInit(): void {
    this.items = [
      {
        label: 'Dashboard',
      },
      {
        label: 'Reports',
      },
      {
        label: 'Contacts',
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
        icon: 'pi pi-fw pi-calendar',
        items: [{ label: 'Account' }, { label: 'Add User' }, { label: 'Logout' }],
      },
    ];
  }
}
