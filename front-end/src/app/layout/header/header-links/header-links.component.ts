import { Component, inject, Input, OnInit } from '@angular/core';
import { environment } from 'environments/environment';
import { HeaderStyles } from '../header.component';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { selectUserLoginData } from 'app/store/user-login-data.selectors';
import { Store } from '@ngrx/store';
import { isManagerAdmin, Roles } from 'app/shared/models';
import { LoginService } from 'app/shared/services/login.service';

@Component({
  selector: 'app-header-links',
  templateUrl: './header-links.component.html',
  styleUrls: ['../header.component.scss', './header-links.component.scss'],
  imports: [RouterLink, NgOptimizedImage],
})
export class HeaderLinksComponent implements OnInit {
  readonly loginService = inject(LoginService);
  readonly store = inject(Store);
  readonly loginDotGovAuthUrl = environment.loginDotGovAuthUrl;
  @Input() ratio = 1;
  @Input() full = false;
  @Input() headerStyle = HeaderStyles.DEFAULT;

  headerStyles = HeaderStyles;
  isManagerAdmin = isManagerAdmin;

  role?: Roles;

  ngOnInit() {
    this.store.select(selectUserLoginData).subscribe((user) => {
      this.role = Roles[user.role as keyof typeof Roles];
    });
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
