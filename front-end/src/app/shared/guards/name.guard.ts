import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

export const nameGuard: CanActivateFn = () => {
  const router = inject(Router);
  const loginService = inject(LoginService);
  if (!loginService.userHasProfileData()) {
    router.navigate(['/current']);
    return false;
  };
  return true;
};
