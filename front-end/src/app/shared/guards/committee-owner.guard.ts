import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { CommitteeMemberService } from '../services/committee-member.service';

export const committeeOwnerGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const store = inject(Store);
  const committeeSignal = store.selectSignal(selectCommitteeAccount);
  if (!committeeSignal().committee_id) return router.createUrlTree(['/select-committee']);

  const memberService = inject(CommitteeMemberService);

  await memberService.updateCommitteeCounts();
  if (memberService.needsSecondAdmin()) {
    return router.createUrlTree(['/reports']);
  }
  return true;
};
