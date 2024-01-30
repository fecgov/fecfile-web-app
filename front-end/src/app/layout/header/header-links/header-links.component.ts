import { Component, Input } from '@angular/core';
import { LoginService } from '../../../shared/services/login.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-header-links',
  templateUrl: './header-links.component.html',
  styleUrls: ['../header.component.scss', './header-links.component.scss'],
})
export class HeaderLinksComponent {
  loginService: LoginService;
  loginDotGovAuthUrl = environment.loginDotGovAuthUrl;
  @Input() ratio = 1;
  @Input() full = false;
  @Input() loginPage = false;

  constructor(loginService: LoginService) {
    this.loginService = loginService;
  }

  get fontSize(): string {
    return (12 * this.ratio).toFixed() + 'px';
  }

  navigateToLoginDotGov() {
    if (this.loginDotGovAuthUrl) {
      window.location.href = this.loginDotGovAuthUrl;
    }
  }
}
