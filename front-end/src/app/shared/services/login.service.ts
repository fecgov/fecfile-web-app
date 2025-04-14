import { computed, inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { userLoginDataDiscardedAction, userLoginDataRetrievedAction } from 'app/store/user-login-data.actions';
import { selectUserLoginData } from 'app/store/user-login-data.selectors';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { UsersService } from '../services/users.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly cookieService = inject(CookieService);
  private readonly usersService = inject(UsersService);
  readonly userLoginData = this.store.selectSignal(selectUserLoginData);
  readonly userHasProfileData = computed(() => !!this.userLoginData().first_name && !!this.userLoginData().last_name);
  readonly userHasConsented = computed(() => !!this.userLoginData().security_consented);
  readonly isLoggedIn = this.cookieService.get(environment.ffapiLoginDotGovCookieName) === 'true';
  readonly userIsAuthenticated = new Date() < new Date(parseInt(this.cookieService.get('ffapi_timeout')) * 1000);

  public logOut() {
    this.store.dispatch(userLoginDataDiscardedAction());
    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
    } else {
      window.location.href = environment.loginDotGovLogoutUrl;
    }
  }

  public async retrieveUserLoginData(): Promise<void> {
    return this.usersService.getCurrentUser().then((userLoginData) => {
      this.store.dispatch(userLoginDataRetrievedAction({ payload: userLoginData }));
    });
  }
}
