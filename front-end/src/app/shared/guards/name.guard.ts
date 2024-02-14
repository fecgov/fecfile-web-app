import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

export const nameGuard: CanActivateFn = () => {
  const router = inject(Router);
  const loginService = inject(LoginService);
  return loginService.userHasProfileData().then((userHasProfileData) => {
    if (!userHasProfileData) {
      return router.createUrlTree(['/current']);
    }
    return true;
  });
};
