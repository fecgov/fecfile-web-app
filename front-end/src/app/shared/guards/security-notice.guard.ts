import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { map } from 'rxjs';

export const securityNoticeGuard: CanActivateFn = () => {
  const router = inject(Router);
  const loginService = inject(LoginService);
  return loginService.userHasRecentSecurityConsentDate().then((userHasRecentSecurityConsentDate) => {
    if (!userHasRecentSecurityConsentDate) {
      return router.createUrlTree(['/security-notice']);
    }
    return true;
  });
};
