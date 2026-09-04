import { NgOptimizedImage } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Roles } from 'app/shared/models';
import { LoginService } from 'app/shared/services/login.service';
import { ButtonModule } from 'primeng/button';
import { Popover } from 'primeng/popover';
import { HeaderStyles } from '../header-styles';
import { setServiceAvailableAction } from 'app/store/service-available.actions';
import { HttpResponse } from '@angular/common/http';
import { ApiService } from 'app/shared/services/api.service';
import { selectServiceAvailable } from 'app/store/service-available.selectors';
import { FEATURE_FLAGS } from 'environments/tokens/feature-flags.config';
import { API_CONFIG } from 'environments/tokens/api.config';

@Component({
  standalone: true,
  selector: 'app-header-links',
  templateUrl: './header-links.component.html',
  styleUrls: ['../header.component.scss', './header-links.component.scss'],
  imports: [RouterLink, NgOptimizedImage, Popover, ButtonModule],
})
export class HeaderLinksComponent {
  private readonly apiConfig = inject(API_CONFIG);
  private readonly featureFlags = inject(FEATURE_FLAGS);
  private readonly router = inject(Router);
  readonly loginService = inject(LoginService);
  readonly apiService = inject(ApiService);
  readonly store = inject(Store);
  readonly loginDotGovAuthUrl = this.apiConfig.loginDotGovAuthUrl;
  readonly disableLogin = this.apiConfig.disableLogin;
  readonly headerStyle = input(HeaderStyles.DEFAULT);
  readonly serviceAvailable = this.store.selectSignal(selectServiceAvailable);
  readonly enableUnassignedTransactions = this.featureFlags.enableUnassignedTransactions;

  headerStyles = HeaderStyles;

  role?: Roles;

  async navigateToLoginDotGov() {
    const available = this.serviceAvailable();
    if (available === false) {
      this.store.dispatch(setServiceAvailableAction({ payload: undefined }));
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: HttpResponse<any> = await this.apiService.get_from_base_uri('/devops/status/');
    if (response.status) {
      this.store.dispatch(setServiceAvailableAction({ payload: true }));
      globalThis.location.href = this.loginDotGovAuthUrl ?? '';
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
