import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { userLoggedOutAction } from 'app/store/login.actions';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private store: Store) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Outgoing HTTP Error: ${error.error.message}`;
        } else {
          errorMessage = `Incoming HTTP Error - [Error Code]: ${error.status},  [Message]: ${error.message
            }, [Server Message]: ${JSON.stringify(error.error)}`;
        }
        if (error && error.status === HttpStatusCode.Forbidden) {
          this.store.dispatch(userLoggedOutAction());
        } else {
          alert(errorMessage);
        }
        console.log(errorMessage);
        return throwError(() => errorMessage);
      })
    );
  }
}
