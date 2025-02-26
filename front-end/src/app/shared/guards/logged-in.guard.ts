import { Router, CanActivateFn } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from '../services/login.service';
import { inject } from '@angular/core';

export const loggedInGuard: CanActivateFn = () => {
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
