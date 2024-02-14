import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

export const securityNoticeGuard: CanActivateFn = () => {
  const router = inject(Router);
  const loginService = inject(LoginService);
  return loginService.userHasRecentSecurityConsentDate().then((userHasRecentSecurityConsentDate) => {
    if (!userHasRecentSecurityConsentDate) {
      return router.createUrlTree(['/login/security-notice']);
    }
    return true;
  });
};
