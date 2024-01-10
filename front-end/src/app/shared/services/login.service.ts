import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { userLoggedOutAction, userLoggedOutForLoginDotGovAction } from 'app/store/login.actions';
import { selectUserLoginData } from 'app/store/login.selectors';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserLoginData } from '../models/user.model';
import { ApiService } from './api.service';

type EndpointAvailability = { endpoint_available: boolean };

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private userLoginData: UserLoginData | undefined;
  constructor(
    private store: Store,
    private http: HttpClient,
    private apiService: ApiService,
    private cookieService: CookieService
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
    this.cookieService.delete('csrftoken');
    if (this.userLoginData && !this.userLoginData.login_dot_gov) {
      // Non-login.gov auth
      this.store.dispatch(userLoggedOutAction());
    } else {
      this.store.dispatch(userLoggedOutForLoginDotGovAction());
      if (environment.loginDotGovLogoutUrl) {
        window.location.href = environment.loginDotGovLogoutUrl;
      }
    }
    return false;
  }

  public clearUserLoggedInCookies() {
    this.cookieService.delete(environment.ffapiCommitteeIdCookieName);
    this.cookieService.delete(environment.ffapiEmailCookieName);
    this.cookieService.delete(environment.sessionIdCookieName);
    this.cookieService.delete(environment.ffapiLoginDotGovCookieName);
  }

  public checkLocalLoginAvailability(): Observable<boolean> {
    return this.apiService.get<EndpointAvailability>('/user/login/authenticate').pipe(
      map((response: EndpointAvailability) => {
        return response.endpoint_available;
      })
    );
  }
}
