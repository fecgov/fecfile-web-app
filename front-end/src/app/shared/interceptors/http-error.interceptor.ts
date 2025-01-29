import {
  HttpContextToken,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, Observable, of, throwError } from 'rxjs';
import { singleClickEnableAction } from 'app/store/single-click.actions';
import { LoginService } from '../services/login.service';

export const ALLOW_ERROR_CODES = new HttpContextToken<number[]>(() => [200]);

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  private readonly store = inject(Store);
  private readonly loginService = inject(LoginService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        //pass on error code if allowed
        if (request.context.get(ALLOW_ERROR_CODES).includes(error.status)) {
          return of(new HttpResponse({ status: error.status }));
        }
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Outgoing HTTP Error: ${error.error.message}`;
        } else {
          errorMessage = `Incoming HTTP Error - [Error Code]: ${error.status} ${error.statusText}`;
        }
        if (error && error.status === HttpStatusCode.Forbidden) {
          this.loginService.logOut();
        } else {
          this.store.dispatch(singleClickEnableAction());
        }
        console.log(errorMessage);
        return throwError(() => errorMessage);
      }),
    );
  }
}
