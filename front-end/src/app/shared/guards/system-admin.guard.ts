import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { selectUserLoginData } from 'app/store/user-login-data.selectors';

export const systemAdminGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const store = inject(Store);
  const userSignal = store.selectSignal(selectUserLoginData);
  if (!userSignal().is_staff) return router.createUrlTree(['/select-committee']);

  return true;
};
