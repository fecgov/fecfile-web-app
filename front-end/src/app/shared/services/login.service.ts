import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUserLoginData } from 'app/store/login.selectors';
import { setUserLoginDataAction } from 'app/store/user-login-data.actions';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserLoginData } from '../models/user.model';
import { ApiService } from './api.service';
import { UsersService } from './users.service';

type EndpointAvailability = { endpoint_available: boolean };

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private userLoginData: UserLoginData | undefined;
  constructor(
    private store: Store,
    private apiService: ApiService,
    private usersService: UsersService,
    private cookieService: CookieService,
    private router: Router
  ) {
    this.store.select(selectUserLoginData).subscribe((userLoginData: UserLoginData) => {
      this.userLoginData = userLoginData;
    });
  }

  /**
   * Logs a user into the API.
   *
   * @param      {String}  username  The username
   * @param      {String}  password  The password
   *
   * @return     {Observable}  The JSON response.
   */
  public logIn(email: string, cmteId: string, password: string): Observable<UserLoginData> {
    // Django uses cmteId+email as unique username
    const username = cmteId + email;

    return this.apiService.post<UserLoginData>('/user/login/authenticate', {
      username,
      password,
    });
  }

  public logOut() {
    if (this.userLoginData && !this.userLoginData.login_dot_gov) {
      // Non-login.gov auth
      this.apiService.get('/auth/logout').subscribe(() => {
        this.clearUserLoggedInDataAndNavigateHome();
      });
    } else {
      this.store.dispatch(setUserLoginDataAction({}));
      if (environment.loginDotGovLogoutUrl) {
        window.location.href = environment.loginDotGovLogoutUrl;
      }
    }
    return false;
  }

  public clearUserLoggedInDataAndNavigateHome() {
    this.clearUserLoggedInData();
    this.router.navigate(['/']);
  }

  public clearUserLoggedInData() {
    this.store.dispatch(setUserLoginDataAction({}));
    this.cookieService.deleteAll();
  }

  public checkLocalLoginAvailability(): Observable<boolean> {
    return this.apiService.get<EndpointAvailability>('/user/login/authenticate').pipe(
      map((response: EndpointAvailability) => {
        return response.endpoint_available;
      })
    );
  }

  public hasUserLoginData() {
    return !!this.userLoginData;
  }

  public refreshUserLoginDataIfNeeded() {
    if (!this.userLoginData) {
      return this.usersService.getCurrentUser().pipe(
        map((response: UserLoginData) => {
          return this.store.dispatch(setUserLoginDataAction({ payload: response }));
        })
      );
    }
    return of();
  }

  public userIsAuthenticated() {
    return !!this.userLoginData?.email;
  }

  public userHasProfileData() {
    return !!this.userLoginData?.first_name && !!this.userLoginData?.last_name;
  }

}
