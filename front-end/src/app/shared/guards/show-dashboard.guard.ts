import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from 'environments/environment';

export const showDashboardGuard: CanActivateFn = () => {
  const router = inject(Router);
  if (!environment.showDashboard) {
    return router.createUrlTree(['/reports']);
  } else {
    return true;
  }
};
