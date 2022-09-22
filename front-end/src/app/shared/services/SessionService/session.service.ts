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
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

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
    const decoded: any = jwt_decode(token); // eslint-disable-line @typescript-eslint/no-explicit-any

    if (decoded.exp === undefined) return new Date();

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  isSessionAboutToExpire(): boolean {
    const currentTime = new Date();
    currentTime.setMinutes(currentTime.getMinutes() + this.REFESH_TOKEN_THRESHOLD_IN_MINUTES);
    const minimumTimeToRefreshToken = new Date(currentTime.getTime());
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
          // prettier-ignore
          tap((token: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
            this.setToken(token.token);
          }),
          // prettier-ignore
          switchMap((token: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
            this.isRefreshing = false;
            this.refreshTokenSubject.next(token);
            return token;
          })
        );
      } else {
        return this.refreshTokenSubject.pipe(
          filter((token) => token !== null),
          take(1),
          // prettier-ignore
          switchMap((token: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
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
        // prettier-ignore
        tap((tokens: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
          this.setToken(tokens.token);
        })
      );
  }
}
