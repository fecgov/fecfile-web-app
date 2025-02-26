import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

export const nameGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const loginService = inject(LoginService);
  const userHasProfileData = await loginService.userHasProfileData();
  if (!userHasProfileData) {
    return router.createUrlTree(['/login/create-profile']);
  }
  return true;
};
