import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { userLoggedInAction, userLoggedOutAction } from 'app/store/login.actions';
import { SessionService } from './SessionService/session.service';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserLoginData } from '../models/user.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private store: Store,
    private sessionService: SessionService,
    private http: HttpClient,
    private apiService: ApiService
  ) {}

  /**
   * Logs a user into the API.
   *
   * @param      {String}  username  The username
   * @param      {String}  password  The password
   *
   * @return     {Observable}  The JSON web token response.
   */
  public signIn(email: string, cmteId: string, password: string): Observable<UserLoginData> {
    // Django uses cmteId+email as unique username
    const username = cmteId + email;

    return this.apiService.post<UserLoginData>('/user/login/authenticate', {
      username,
      password,
    });
  }

  public validateCode(code: string) {
    const payload = { code: code.toString() };
    const token: string = this.sessionService.getToken();
    const headers = {
      'Content-Type': 'application/json',
      token: token,
    };
    return this.http.post<UserLoginData>(`${environment.apiUrl}/user/login/verify`, payload, { headers: headers }).pipe(
      tap((userLoginData: UserLoginData) => {
        if (userLoginData.token) {
          this.store.dispatch(userLoggedInAction({ payload: userLoginData }));
        }
      })
    );
  }

  public logOut() {
    this.store.dispatch(userLoggedOutAction());
  }
}
