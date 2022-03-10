import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap, filter, take, tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import jwt_decode from 'jwt-decode';
import { BehaviorSubject, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  public accessToken!: string;
  public readonly REFESH_TOKEN_THRESHOLD_IN_MINUTES = 15;
  private isRefreshing: any = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  /**
   * Returns the session token if it exists in local storage.
   *
   * @return     {Object}  The session.
   */
  public getSession() {
    if (this.cookieService.get('user')) {
      return this.cookieService.get('user');
    }
    return 0;
  }

  /**
   * Removes the active session and logs a user out.
   *
   */
  public destroy(): void {
    this.accessToken = '';
    this.cookieService.deleteAll();

    localStorage.clear();
  }

  getToken(): string {
    const user = this.cookieService.get('user');
    if (user) {
      return JSON.parse(user);
    }
    return '';
  }

  setToken(token: string): void {
    this.cookieService.set('user', JSON.stringify(token));
  }

  getTokenExpirationDate(token: string): Date {
    const decoded: any = jwt_decode(token);

    if (decoded.exp === undefined) return new Date();

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  isSessionAboutToExpire(): boolean {
    let currentTime = new Date();
    currentTime.setMinutes(currentTime.getMinutes() + this.REFESH_TOKEN_THRESHOLD_IN_MINUTES);
    let minimumTimeToRefreshToken = new Date(currentTime.getTime());
    if (this.getToken()) {
      const currentExpirationTime = this.getTokenExpirationDate(this.getToken());
      if (minimumTimeToRefreshToken > currentExpirationTime) {
        return true;
      }
    }
    return false;
  }

  public refreshToken() {
    const currentToken = this.getToken();
    if (currentToken) {
      if (!this.isRefreshing) {
        this.isRefreshing = true;
        this.refreshTokenSubject.next(null);
        return this.getRefreshTokenFromServer(currentToken).pipe(
          tap((token: any) => {
            this.setToken(token.token);
          }),
          switchMap((token: any) => {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(token);
            return token;
          })
        );
      } else {
        return this.refreshTokenSubject.pipe(
          filter((token) => token !== null),
          take(1),
          switchMap((token: any) => {
            console.log('token ' + token);
            return token;
          })
        );
      }
    }
    return of(null);
  }

  public getRefreshTokenFromServer(currentToken: string) {
    return this.http
      .post(`${environment.apiUrl}/token/refresh`, {
        token: currentToken,
      })
      .pipe(
        tap((tokens: any) => {
          this.setToken(tokens.token);
        })
      );
    return of({});
  }
}
