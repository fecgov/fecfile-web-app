import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { userLoggedInAction, userLoggedOutAction } from 'app/store/login.actions';
import { selectUserLoginData } from 'app/store/login.selectors';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Observable, takeUntil, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { DestroyerComponent } from '../components/app-destroyer.component';
import { UserLoginData } from '../models/user.model';
import { ApiService } from './api.service';
import { Router } from '@angular/router';

type EndpointAvailability = { endpoint_available: boolean };

@Injectable({
  providedIn: 'root',
})
export class LoginService extends DestroyerComponent {
  public userLoginData$: Observable<UserLoginData>;
  constructor(
    private store: Store,
    private router: Router,
    private apiService: ApiService,
    private cookieService: CookieService,
  ) {
    super();
    this.userLoginData$ = this.store.select(selectUserLoginData).pipe(takeUntil(this.destroy$));
  }

  /**
   * Logs a user into the API.
   *
   * @param      {String}  username  The username
   * @param      {String}  password  The password
   *
   * @return     {Observable}  The JSON response.
   */
  public logIn(email: string, cmteId: string, password: string): Observable<null> {
    // Django uses cmteId+email as unique username
    const username = cmteId + email;

    return this.apiService.post<null>('/user/login/authenticate', {
      username,
      password,
    });
  }

  public async logOut() {
    const userLoginData = await firstValueFrom(this.userLoginData$);
    console.log('\n\n\n', userLoginData, '\n\n\n');

    this.clearUserLoggedInCookies();
    if (userLoginData) {
      this.store.dispatch(userLoggedOutAction());
      if (!userLoginData.login_dot_gov) {
        this.apiService.get('/auth/logout').subscribe(() => {
          this.router.navigate(['/login']);
        });
      } else {
        if (environment.loginDotGovLogoutUrl) {
          window.location.href = environment.loginDotGovLogoutUrl;
        }
      }
    }
  }

  public clearUserFecfileApiCookies() {
    this.cookieService.delete(environment.ffapiLoginDotGovCookieName);
    this.cookieService.delete(environment.ffapiFirstNameCookieName);
    this.cookieService.delete(environment.ffapiLastNameCookieName);
    this.cookieService.delete(environment.ffapiEmailCookieName);
    this.cookieService.delete(environment.ffapiSecurityConsentCookieName);
  }

  public clearUserLoggedInCookies() {
    this.clearUserFecfileApiCookies();
    this.cookieService.delete('csrftoken');
  }

  public checkLocalLoginAvailability(): Observable<boolean> {
    return this.apiService.get<EndpointAvailability>('/user/login/authenticate').pipe(
      map((response: EndpointAvailability) => {
        return response.endpoint_available;
      }),
    );
  }

  public async userIsAuthenticated(): Promise<boolean> {
    const userLoginData = await firstValueFrom(this.userLoginData$);
    return !!userLoginData.email || this.cookieService.check(environment.ffapiEmailCookieName);
  }

  public async userHasProfileData(): Promise<boolean> {
    const userLoginData = await firstValueFrom(this.userLoginData$);
    return !!userLoginData?.first_name && !!userLoginData.last_name;
  }

  public async userHasRecentSecurityConsentDate(): Promise<boolean> {
    const userLoginData = await firstValueFrom(this.userLoginData$);
    const security_date = userLoginData.security_consent_date;
    const one_year_ago = new Date();
    one_year_ago.setFullYear(one_year_ago.getFullYear() - 1);

    return !!security_date && new Date(security_date) > one_year_ago;
  }

  public dispatchUserLoggedInFromCookies() {
    if (this.cookieService.check(environment.ffapiEmailCookieName)) {
      const userLoginData: UserLoginData = {
        first_name: this.cookieService.get(environment.ffapiFirstNameCookieName),
        last_name: this.cookieService.get(environment.ffapiLastNameCookieName),
        email: this.cookieService.get(environment.ffapiEmailCookieName),
        login_dot_gov: this.cookieService.get(environment.ffapiLoginDotGovCookieName).toLowerCase() === 'true',
        security_consent_date: this.cookieService.get(environment.ffapiSecurityConsentCookieName),
      };
      this.clearUserFecfileApiCookies();
      this.store.dispatch(userLoggedInAction({ payload: userLoginData }));
    }
  }
}
