import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { committeeGuard } from './committee.guard';
import { CommitteeAccount } from '../models/committee-account.model';
import { CommitteeStore } from 'app/committee/committee.store';

describe('committeeGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => committeeGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return false without committee', () => {
    const router = TestBed.inject(Router);
    const route: ActivatedRouteSnapshot = {} as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    const state: RouterStateSnapshot = {} as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    return (executeGuard(route, state) as Promise<boolean | UrlTree>).then((safe) => {
      expect(safe).toEqual(router.createUrlTree(['/login/select-committee']));
    });
  });
  it('should return true with committee', () => {
    const committeeStore = TestBed.inject(CommitteeStore);
    const route: ActivatedRouteSnapshot = {} as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    const state: RouterStateSnapshot = {} as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    committeeStore.setCommittee(CommitteeAccount.fromJSON({ id: '123' }));

    (executeGuard(route, state) as Promise<boolean>).then((safe) => {
      expect(safe).toBe(true);
    });
  });
});
