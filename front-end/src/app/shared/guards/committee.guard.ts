import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { map } from 'rxjs';

export const committeeGuard: CanActivateFn = () => {
  const router = inject(Router);
  return inject(Store)
    .select(selectCommitteeAccount)
    .pipe(
      map((committee) => {
        if (!committee.id) {
          router.navigateByUrl('/select-committee');
          return false;
        }
        return true;
      }),
    );
};
