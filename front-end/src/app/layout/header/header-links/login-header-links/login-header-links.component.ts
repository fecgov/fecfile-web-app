import { HttpResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ApiService } from 'app/shared/services/api.service';
import { setServiceAvailableAction } from 'app/store/service-available.actions';
import { selectServiceAvailable } from 'app/store/service-available.selectors';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-login-header-links',
  imports: [],
  template: `@if (!disableLogin) {
    <a (click)="navigateToLoginDotGov()">SIGN IN</a>
  }`,
  styleUrl: '../header-links.component.scss',
})
export class LoginHeaderLinksComponent {
  private readonly store = inject(Store);
  private readonly apiService = inject(ApiService);
  private readonly serviceAvailable = this.store.selectSignal(selectServiceAvailable);
  private readonly loginDotGovAuthUrl = environment.loginDotGovAuthUrl;
  readonly disableLogin = environment.disableLogin;

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
}
