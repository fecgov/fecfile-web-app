import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, catchError } from 'rxjs';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage: string = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Outgoing HTTP Error: ${error.error.message}`;
          alert(errorMessage);
        } else {
          errorMessage = `Incoming HTTP Error - [Error Code]: ${error.status},  [Message]: ${
            error.message
          }, [Server Message]: ${JSON.stringify(error.error)}`;
          alert(errorMessage);
        }
        console.log(errorMessage);
        return throwError(() => errorMessage);
      })
    );
  }
}
