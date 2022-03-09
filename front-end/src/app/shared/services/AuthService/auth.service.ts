import { DialogService } from '../../../shared/services/DialogService/dialog.service';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { SessionService } from '../SessionService/session.service';
import jwt_decode from 'jwt-decode';
import { Roles } from '../../enums/Roles';
import { ConfirmModalComponent, ModalHeaderClassEnum } from '../../partials/confirm-modal/confirm-modal.component';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private data!: { committeeId: any; email: any };

  constructor(
    private _session: SessionService,
    private _cookieService: CookieService,
    private _dialogService: DialogService,
    private _router: Router
  ) {}

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

  public isReadOnly(): boolean {
    const sessionData = this._session.getSession();
    if (sessionData) {
      const decodedAccessToken: any = jwt_decode(sessionData);
      if (decodedAccessToken.role === Roles.Reviewer) {
        return true;
      }
      return false;
    }
    this.destroySession();
    return false;
  }

  public isCommitteeAdmin(): boolean {
    const sessionData = this._session.getSession();
    if (sessionData) {
      const decodedAccessToken: any = jwt_decode(sessionData);
      if (decodedAccessToken.role === Roles.CommitteeAdmin) {
        return true;
      } else {
        return false;
      }
    }
    this.destroySession();
    return false;
  }
  public isBackupCommitteeAdmin(): boolean {
    const sessionData = this._session.getSession();
    if (sessionData) {
      const decodedAccessToken: any = jwt_decode(sessionData);
      if (decodedAccessToken.role === Roles.BackupCommitteeAdmin) {
        return true;
      } else {
        return false;
      }
    }
    this.destroySession();
    return false;
  }

  public isAdmin(): boolean {
    const sessionData = this._session.getSession();
    if (sessionData) {
      const decodedAccessToken: any = jwt_decode(sessionData);
      if (decodedAccessToken.role === Roles.Admin) {
        return true;
      } else {
        return false;
      }
    }
    this.destroySession();
    return false;
  }

  private destroySession() {
    this._session.destroy();
    this._router.navigate(['']);
  }

  public showPermissionDeniedMessage() {
    this._dialogService.confirm(
      'You do not have sufficient privileges to perform the requested action.',
      ConfirmModalComponent,
      'Error!',
      false,
      ModalHeaderClassEnum.errorHeader
    );
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
