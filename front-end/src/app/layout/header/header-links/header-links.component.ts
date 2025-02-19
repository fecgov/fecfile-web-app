import { Component, inject, Input } from '@angular/core';
import { LoginService } from '../../../shared/services/login.service';
import { environment } from 'environments/environment';
import { HeaderStyles } from '../header.component';
import { NgOptimizedImage } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Popover } from 'primeng/popover';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header-links',
  templateUrl: './header-links.component.html',
  styleUrls: ['../header.component.scss', './header-links.component.scss'],
  imports: [RouterLink, NgOptimizedImage, Popover, ButtonModule],
})
export class HeaderLinksComponent {
  private readonly router = inject(Router);
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

  openLink(link: string, popover: Popover) {
    this.router.navigate([link]);
    popover.hide();
  }

  logOut() {
    this.loginService.logOut();
  }
}
