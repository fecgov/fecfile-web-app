import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

export const securityNoticeGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const loginService = inject(LoginService);
  if (!loginService.userHasConsented()) {
    return router.createUrlTree(['/login/security-notice']);
  }
  return true;
};
