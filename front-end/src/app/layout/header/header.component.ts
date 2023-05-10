import { Component, Input, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LoginService } from 'app/shared/services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] = [];
  @Input() showLogo = false;

  constructor(private loginService: LoginService) {}

  ngOnInit(): void {
    this.items = [
      {
        label: 'Dashboard',
        routerLink: ['/dashboard'],
      },
      {
        label: 'Reports',
        routerLink: ['/reports'],
      },
      {
        label: 'Contacts',
        routerLink: ['/contacts'],
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
        items: [
          { label: 'Account', routerLink: ['/profile/account'] },
          { label: 'Users', routerLink: ['/committee/users'] },
          { label: 'Logout', command: () => this.loginService.logOut() },
        ],
      },
    ];
  }
}
