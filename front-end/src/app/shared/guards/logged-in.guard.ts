import { CanActivateFn } from '@angular/router';
import { Router, UrlTree } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from '../services/login.service';
import { inject } from '@angular/core';

export const loggedInGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const loginService = inject(LoginService);
  const cookieService = inject(CookieService);

  if (!loginService.userIsAuthenticated()) {
    cookieService.deleteAll();
    return router.createUrlTree(['login']);
  } else {
    return true;
  }
};
