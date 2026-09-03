import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ElectionCycleStore } from './election-cycle.store';

export const electionCycleGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const electionCycleStore = inject(ElectionCycleStore);
  if (electionCycleStore.isForm3Committee()) return true;
  if (await electionCycleStore.hasForm3Reports()) return true;

  return router.createUrlTree(['/reports']);
};
