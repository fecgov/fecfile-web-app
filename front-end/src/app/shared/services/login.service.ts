import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AuthService } from './AuthService/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private apiService: ApiService, private authService: AuthService) {}

  /**
   * Logs a user into the API.
   *
   * @param      {String}  username  The username
   * @param      {String}  password  The password
   *
   * @return     {Observable}  The JSON web token response.
   */
  public signIn(email: string, cmteId: string, password: string): Observable<any> {
    // Django uses cmteId+email as unique username
    const username = cmteId + email;
    return this.apiService
      .post<any>(`/user/login/authenticate`, {
        username,
        password,
      })
      .pipe(
        map((res) => {
          // login successful if there's a jwt token in the response
          if (res.token) {
            this.authService.doSignIn(res.token);
          }

          return res;
        })
      );
  }
}
