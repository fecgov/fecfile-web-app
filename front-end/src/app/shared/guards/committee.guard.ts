import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CommitteeStore } from 'app/committee/committee.store';

export const committeeGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const committeeStore = inject(CommitteeStore);

  if (!committeeStore.committee()?.id) {
    return router.createUrlTree(['/login/select-committee']);
  } else {
    return true;
  }
};
