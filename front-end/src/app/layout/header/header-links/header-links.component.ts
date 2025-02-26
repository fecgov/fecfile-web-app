import { NgOptimizedImage } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Roles } from 'app/shared/models';
import { LoginService } from 'app/shared/services/login.service';
import { environment } from 'environments/environment';
import { ButtonModule } from 'primeng/button';
import { Popover } from 'primeng/popover';
import { HeaderStyles } from '../header.component';

@Component({
  selector: 'app-header-links',
  templateUrl: './header-links.component.html',
  styleUrls: ['../header.component.scss', './header-links.component.scss'],
  imports: [RouterLink, NgOptimizedImage, Popover, ButtonModule],
})
export class HeaderLinksComponent {
  private readonly router = inject(Router);
  readonly loginService = inject(LoginService);
  readonly store = inject(Store);
  readonly loginDotGovAuthUrl = environment.loginDotGovAuthUrl;
  @Input() ratio = 1;
  @Input() full = false;
  @Input() headerStyle = HeaderStyles.DEFAULT;

  headerStyles = HeaderStyles;

  role?: Roles;

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
