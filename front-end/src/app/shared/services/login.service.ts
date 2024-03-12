import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { userLoginDataDiscardedAction, userLoginDataRetrievedAction } from 'app/store/user-login-data.actions';
import { selectUserLoginData } from 'app/store/user-login-data.selectors';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { firstValueFrom, Observable, takeUntil } from 'rxjs';
import { map } from 'rxjs/operators';
import { DestroyerComponent } from '../components/app-destroyer.component';
import { UserLoginData } from '../models/user.model';
import { UsersService } from '../services/users.service';
import { DateUtils } from '../utils/date.utils';
import { ApiService } from './api.service';

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
    private usersService: UsersService,
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
   * @return     {Promise}  The JSON response.
   */
  public logIn(email: string, cmteId: string, password: string): Promise<null> {
    // Django uses cmteId+email as unique username
    const username = cmteId + email;

    return firstValueFrom(this.apiService.post<null>('/user/login/authenticate', {
      username,
      password,
    })).then(() => {
      return this.retrieveUserLoginData().then(() => {
        return Promise.resolve(null);
      });
    });
  }

  public logOut() {
    this.store.dispatch(userLoginDataDiscardedAction());
    if (!this.isLoggedInWithLoginDotGov()) {
      this.apiService.get('/auth/logout').subscribe(() => {
        this.router.navigate(['/login']);
      });
    } else {
      window.location.href = environment.loginDotGovLogoutUrl;
    }
  }

  public async hasUserLoginData(): Promise<boolean> {
    const userLoginData = await firstValueFrom(this.userLoginData$);
    return !!userLoginData.email;
  }

  public async retrieveUserLoginData(): Promise<void> {
    return this.usersService.getCurrentUser().then(userLoginData => {
      this.store.dispatch(userLoginDataRetrievedAction({ payload: userLoginData }));
    });
  }

  public isLoggedInWithLoginDotGov() {
    return this.cookieService.check('oidc_state');
  }

  public checkLocalLoginAvailability(): Observable<boolean> {
    return this.apiService.get<EndpointAvailability>('/user/login/authenticate').pipe(
      map((response: EndpointAvailability) => {
        return response.endpoint_available;
      }),
    );
  }

  public async userHasProfileData(): Promise<boolean> {
    const userLoginData = await firstValueFrom(this.userLoginData$);
    return !!userLoginData?.first_name && !!userLoginData.last_name;
  }

  public async userHasRecentSecurityConsentDate(): Promise<boolean> {
    const userLoginData = await firstValueFrom(this.userLoginData$);
    if (!userLoginData.security_consent_exp_date) {
      return false;
    }
    const security_date_exp = DateUtils.convertFecFormatToDate(
      userLoginData.security_consent_exp_date);
    return !!security_date_exp && new Date() < security_date_exp;
  }
}
