import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CommitteeMemberService } from '../services/committee-member.service';
import { CommitteeStore } from 'app/committee/committee.store';

export const committeeOwnerGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const committeeStore = inject(CommitteeStore);
  if (!committeeStore.committee()?.committee_id) return router.createUrlTree(['/select-committee']);

  const memberService = inject(CommitteeMemberService);

  await memberService.getMembers();
  if (memberService.needsSecondAdmin()) {
    return router.createUrlTree(['/reports']);
  }
  return true;
};
