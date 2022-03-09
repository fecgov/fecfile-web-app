import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Auth } from '../../interfaces/APIService/APIService';
import { AuthService } from '../AuthService/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient, private authService: AuthService) {}

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
    return this.http
      .post<Auth>(`${environment.apiUrl}/user/login/authenticate`, {
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

  /**
   * Gets the commitee details.
   *
   * @return     {Observable}  The commitee details.
   */
  public getCommiteeDetails(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/core/get_committee_details`);
  }
}
