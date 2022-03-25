import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { SessionService } from '../SessionService/session.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private data!: { committeeId: any; email: any };

  constructor(private session: SessionService, private cookieService: CookieService, private router: Router) {}

  /**
   * Determines if signed in.
   *
   * @return     {boolean}  True if signed in, False otherwise.
   */
  public isSignedIn(): boolean {
    if (this.session.getSession()) {
      return true;
    }
    return false;
  }

  /**
   * Signs a user out of their session.
   *
   */
  public doSignOut() {
    this.session.destroy();
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
    this.session.accessToken = accessToken;

    this.cookieService.set('user', JSON.stringify(accessToken));
  }
}
