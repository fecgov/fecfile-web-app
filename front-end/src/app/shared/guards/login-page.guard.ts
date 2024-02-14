import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard {
  constructor(
    private loginService: LoginService,
    private router: Router,
    private cookieService: CookieService,
  ) {}
  canActivate(): Promise<boolean | UrlTree> {
    return this.loginService.userIsAuthenticated().then((userIsAuthenticated) => {
      if (!userIsAuthenticated) {
        this.cookieService.deleteAll();
        return this.router.createUrlTree(['login']);
      } else {
        return true;
      }
    });
  }
}
