import { Component, inject, Input } from '@angular/core';
import { LoginService } from '../../../shared/services/login.service';
import { environment } from 'environments/environment';
import { HeaderStyles } from '../header.component';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-links',
  templateUrl: './header-links.component.html',
  styleUrls: ['../header.component.scss', './header-links.component.scss'],
  imports: [RouterLink, NgOptimizedImage],
})
export class HeaderLinksComponent {
  readonly loginService = inject(LoginService);
  readonly loginDotGovAuthUrl = environment.loginDotGovAuthUrl;
  @Input() ratio = 1;
  @Input() full = false;
  @Input() headerStyle = HeaderStyles.DEFAULT;

  headerStyles = HeaderStyles;

  get fontSize(): string {
    return (12 * this.ratio).toFixed() + 'px';
  }

  navigateToLoginDotGov() {
    if (this.loginDotGovAuthUrl) {
      window.location.href = this.loginDotGovAuthUrl;
    }
  }
}
