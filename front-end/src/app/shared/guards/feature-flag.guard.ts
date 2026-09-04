import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FEATURE_FLAGS, FeatureFlags } from 'environments/tokens/feature-flags.config';

export const featureFlagGuard = (flagKey: keyof FeatureFlags, redirectTo: string = '/reports'): CanActivateFn => {
  return () => {
    const featureFlags = inject(FEATURE_FLAGS);
    const router = inject(Router);
    const isFeatureEnabled = featureFlags[flagKey];

    if (isFeatureEnabled) {
      return true;
    }

    return router.createUrlTree([redirectTo]);
  };
};
