import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionService } from '../services/SessionService/session.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private sessionService: SessionService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!request.headers.has('Content-Type')) {
      request = request.clone({
        headers: request.headers.set('Content-Type', 'application/json'),
      });
    }

    const token: string = this.sessionService.getToken();
    if (!!token) {
      if (request.url.endsWith('/user/login/verify')) {
        return next.handle(
          request.clone({
            headers: request.headers.set('token', token),
          })
        );
      }
      return next.handle(
        request.clone({
          headers: request.headers.set('Authorization', `JWT ${token}`),
        })
      );
    } else {
      return next.handle(request);
    }
  }
}
