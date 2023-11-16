import { Component, Input } from '@angular/core';
import { LoginService } from "../../../shared/services/login.service";

@Component({
  selector: 'app-header-links',
  templateUrl: './header-links.component.html',
  styleUrls: ['../header.component.scss', './header-links.component.scss']
})
export class HeaderLinksComponent {
  loginService: LoginService;
  @Input() showLogo = false;
  @Input() ratio = 1;
  @Input() full = false;

  constructor(loginService: LoginService) {
    this.loginService = loginService;
  }

  get fontSize(): string {
    return (12 * this.ratio).toFixed() + 'px';
  }
}
