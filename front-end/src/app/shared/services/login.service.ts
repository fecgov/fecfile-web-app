import { computed, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { userLoginDataDiscardedAction, userLoginDataRetrievedAction } from 'app/store/user-login-data.actions';
import { selectUserLoginData } from 'app/store/user-login-data.selectors';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { DestroyerComponent } from '../components/destroyer.component';
import { UsersService } from '../services/users.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService extends DestroyerComponent {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly cookieService = inject(CookieService);
  private readonly usersService = inject(UsersService);
  public userLoginData = this.store.selectSignal(selectUserLoginData);

  readonly userHasProfileData = computed(() => !!this.userLoginData()?.first_name && !!this.userLoginData()?.last_name);
  readonly userHasConsented = computed(() => {
    const loginData = this.userLoginData();
    return (
      !!loginData?.security_consented &&
      loginData?.security_consent_version === loginData?.security_consent_version_at_login
    );
  });

  public logOut() {
    this.store.dispatch(userLoginDataDiscardedAction());
    if (!this.userIsAuthenticated()) {
      this.router.navigate(['/login']);
    } else {
      window.location.href = environment.loginDotGovLogoutUrl;
    }
  }

  public async retrieveUserLoginData(): Promise<void> {
    if (!('ffapiTimeoutCookieName' in environment)) {
      console.error('The ffapi_timeout cookie name environment variables is not set.');
    } else if (!this.cookieService.check(environment.ffapiTimeoutCookieName)) {
      console.error('The ffapi_timeout cookie is not set.');
    }

    return this.usersService.getCurrentUser().then((userLoginData) => {
      this.store.dispatch(userLoginDataRetrievedAction({ payload: userLoginData }));
    });
  }

  public userIsAuthenticated() {
    return new Date() < new Date(parseInt(this.cookieService.get(environment.ffapiTimeoutCookieName)) * 1000);
  }
}
