import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

export const securityNoticeGuard: CanActivateFn = () => {
  const router = inject(Router);
  const loginService = inject(LoginService);
  return loginService.userHasConsented().then((userHasConsented) => {
    if (!userHasConsented) {
      return router.createUrlTree(['/login/security-notice']);
    }
    return true;
  });
};
