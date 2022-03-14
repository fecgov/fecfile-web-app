import { SessionService } from '../services/SessionService/session.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptor implements HttpInterceptor {
  public readonly REFESH_TOKEN_THRESHOLD_IN_MINUTES = 30;
  private isRefreshing: any = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private router: Router, private sessionService: SessionService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.sessionService.getToken();
    if (token) {
      this.sessionService.isSessionAboutToExpire();
    }

    if (this.sessionService.isSessionAboutToExpire()) {
      this.refreshToken(req, next);
    }

    return next.handle(req).pipe(
      catchError((error) => {
        this.showErrorMessageAndLogoutOn401(error);
        throw new Error('Error refreshing token.');
      })
    );
  }

  private showErrorMessageAndLogoutOn401(error: any) {
    if (error.status === 401) {
      this.sessionService.destroy();
    }
  }

  public refreshToken(req: HttpRequest<any>, next: HttpHandler) {
    const currentToken = this.sessionService.getToken();
    if (currentToken) {
      //check if token needs to be refreshed based on a time limit during this call
      if (!this.isRefreshing) {
        this.isRefreshing = true;
        this.refreshTokenSubject.next(null);
        return this.sessionService
          .getRefreshTokenFromServer(currentToken)
          .pipe(
            switchMap((token: any) => {
              this.isRefreshing = false;
              this.refreshTokenSubject.next(token);
              return next.handle(req);
            })
          )
          .subscribe((message) => {
            this.isRefreshing = false;
          });
      }
      //else block any calls that may be invoked while token is being refreshed, until
      //token is refreshed, and then release those calls.
      else {
        return this.refreshTokenSubject
          .pipe(
            filter((token) => token !== null),
            take(1),
            switchMap((jwt) => {
              this.isRefreshing = false;
              return next.handle(req);
            })
          )
          .subscribe((message) => {
            this.isRefreshing = false;
          });
      }
    }
    return of(null);
  }
}
