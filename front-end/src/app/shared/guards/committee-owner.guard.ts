import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CommitteeStore } from 'app/committee/committee.store';
import { CommitteeMemberService } from '../services/committee-member.service';

export const committeeOwnerGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const committeeStore = inject(CommitteeStore);
  if (!committeeStore.committee()?.committee_id) return router.createUrlTree(['/select-committee']);

  const memberService = inject(CommitteeMemberService);
  if (memberService.needsSecondAdmin()) {
    return router.createUrlTree(['/reports']);
  }
  return true;
};
