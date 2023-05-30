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
        label: 'Transactions',
      },
      {
        label: 'Contacts',
        routerLink: ['/contacts'],
      },
      {
        label: 'Tools',
        escape: false,
        items: [{ label: 'Import' }, { label: 'Export' }, { label: 'Update cash on hand' }, { label: 'FECFile Help' }],
      },
      {
        label: '<img class="header-navbar-icon" src="assets/img/notification_bell_icon.svg" alt="Notifications" />',
        escape: false,
      },
      {
        label: '<img class="header-navbar-icon" src="assets/img/profile_icon.svg" alt="Profile" />',
        escape: false,
        items: [
          { label: 'Account', routerLink: ['/profile/account'] },
          { label: 'Users', routerLink: ['/committee/users'] },
          { label: '<span class="dead-link">Switch Committees</span>', escape: false },
          { label: '<span class="dead-link">User Profile</span>', escape: false },
          { label: 'Logout', command: () => this.loginService.logOut() },
        ],
      },
    ];
  }
}
