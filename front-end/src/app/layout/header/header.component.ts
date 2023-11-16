import { Component, Input } from '@angular/core';
import { LoginService } from 'app/shared/services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  loginService: LoginService;
  @Input() showLogo = false;

  constructor(loginService: LoginService) {
    this.loginService = loginService;
  }

}
