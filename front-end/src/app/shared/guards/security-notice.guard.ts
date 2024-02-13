import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

export const securityNoticeGuard: CanActivateFn = () => {
  const router = inject(Router);
  const loginService = inject(LoginService);
  if (!loginService.userHasRecentSecurityConsentDate()) {
    router.navigate(['/login/security-notice']);
    return false;
  }
  return true;
};
