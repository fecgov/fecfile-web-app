import { Component, inject } from '@angular/core';
import { LoginService } from 'app/shared/services/login.service';

@Component({
  selector: 'app-logout-header-links',
  template: `<button class="nav-button" (click)="logOut()">Log Out</button>`,
  styleUrl: '../header-links.component.scss',
})
export class LogoutHeaderLinksComponent {
  private readonly loginService = inject(LoginService);
  logOut() {
    this.loginService.logOut();
  }
}
