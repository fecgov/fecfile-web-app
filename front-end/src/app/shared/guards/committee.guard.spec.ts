import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { committeeGuard } from './committee.guard';
import { testMockStore } from '../utils/unit-test.utils';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CommitteeAccount } from '../models/committee-account.model';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';

describe('committeeGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => committeeGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore(testMockStore)],
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
    const route: ActivatedRouteSnapshot = {} as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    const state: RouterStateSnapshot = {} as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    TestBed.inject(MockStore).overrideSelector(selectCommitteeAccount, CommitteeAccount.fromJSON({ id: '123' }));
    TestBed.inject(MockStore).refreshState();
    (executeGuard(route, state) as Promise<boolean>).then((safe) => {
      expect(safe).toBeTrue();
    });
  });
});
