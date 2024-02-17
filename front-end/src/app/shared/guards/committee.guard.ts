import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { firstValueFrom } from 'rxjs';

export const committeeGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const store = inject(Store);

  const committeeAccount = await firstValueFrom(store.select(selectCommitteeAccount));

  if (!committeeAccount.id) {
    return router.createUrlTree(['/login/select-committee']);
  } else {
    return true;
  }
};
