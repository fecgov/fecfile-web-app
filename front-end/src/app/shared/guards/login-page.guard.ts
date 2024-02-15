import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
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

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.loginService.userIsAuthenticated()) {
      this.cookieService.deleteAll();
      this.router.navigate(['login']);
      return false;
    } else {
      return true;
    }
  }
}
