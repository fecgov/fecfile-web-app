import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from 'environments/environment';

export const featureFlagGuard = (flagKey: keyof typeof environment, redirectTo: string = '/reports'): CanActivateFn => {
  return () => {
    const router = inject(Router);
    const isFeatureEnabled = environment[flagKey];

    if (isFeatureEnabled) {
      return true;
    }

    return router.createUrlTree([redirectTo]);
  };
};
