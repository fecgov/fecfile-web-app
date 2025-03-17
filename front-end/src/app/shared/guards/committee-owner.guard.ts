import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { CommitteeMemberService } from '../services/committee-member.service';

export const committeeOwnerGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const memberService = inject(CommitteeMemberService);
  await memberService.getMembers();

  if (memberService.needsSecondAdmin()) {
    return router.createUrlTree(['/reports']);
  } else {
    return true;
  }
};
