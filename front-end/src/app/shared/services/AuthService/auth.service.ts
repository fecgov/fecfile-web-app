import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { SessionService } from '../SessionService/session.service';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private data!: { committeeId: any; email: any };

  constructor(private _session: SessionService, private _cookieService: CookieService, private _router: Router) {}

  /**
   * Determines if signed in.
   *
   * @return     {boolean}  True if signed in, False otherwise.
   */
  public isSignedIn(): boolean {
    if (this._session.getSession()) {
      return true;
    }
    return false;
  }

  /**
   * Signs a user out of their session.
   *
   */
  public doSignOut() {
    this._session.destroy();
  }

  /**
   * Signs a user in if they have a access token.
   *
   * @param      {String}  accessToken  The access token
   */
  public doSignIn(accessToken: string) {
    if (!accessToken) {
      return;
    }
    this._session.accessToken = accessToken;

    this._cookieService.set('user', JSON.stringify(accessToken));
  }

  public getUserRole(): any {
    const sessionData = this._session.getSession();
    if (sessionData) {
      const decodedAccessToken: any = jwt_decode(sessionData);
      return decodedAccessToken.role;
    }
    this.destroySession();
  }

  private destroySession() {
    this._session.destroy();
    this._router.navigate(['']);
  }

  public getCurrentUser() {
    const sessionData = this._session.getSession();
    if (sessionData) {
      const decodedAccessToken: any = jwt_decode(sessionData);
      return (this.data = { email: decodedAccessToken.email, committeeId: decodedAccessToken.committee_id });
    }
    return {};
  }
}
