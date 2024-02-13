import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

export const nameGuard: CanActivateFn = () => {
  const router = inject(Router);
  const loginService = inject(LoginService);
  if (!loginService.userHasProfileData()) {
    router.navigate(['/login/create-profile']);
    return false;
  }
  return true;
};
