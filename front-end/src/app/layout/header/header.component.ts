import { Component, Input } from '@angular/core';
import { LoginService } from 'app/shared/services/login.service';

export enum HeaderStyles {
  'DEFAULT',
  'LOGIN',
  'LOGOUT',
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  loginService: LoginService;
  @Input() headerStyle = HeaderStyles.DEFAULT;

  constructor(loginService: LoginService) {
    this.loginService = loginService;
  }
}
