import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { committeeOwnerGuard } from './committee-owner.guard';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CommitteeMemberService } from '../services/committee-member.service';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from '../utils/unit-test.utils';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { CommitteeAccount } from '../models';

describe('committeeOwnerGuard', () => {
  let mockMemberService: jasmine.SpyObj<CommitteeMemberService>;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => committeeOwnerGuard(...guardParameters));
  const route: ActivatedRouteSnapshot = {} as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  const state: RouterStateSnapshot = {} as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  let store: MockStore;

  beforeEach(() => {
    mockMemberService = jasmine.createSpyObj('CommitteeMemberService', ['needsSecondAdmin', 'getMembers']);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CommitteeMemberService, useValue: mockMemberService },
        provideMockStore(testMockStore()),
      ],
    });
    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true when not memberService.needsSecondAdmin', async () => {
    mockMemberService.needsSecondAdmin.and.returnValue(false);
    const safe = await (executeGuard(route, state) as Promise<boolean>);
    expect(safe).toBeTrue();
  });

  it('should not hit backend for members if no committee info yet', async () => {
    const router = TestBed.inject(Router);
    store.overrideSelector(selectCommitteeAccount, {} as CommitteeAccount);
    mockMemberService.needsSecondAdmin.and.returnValue(true);
    const safe = await (executeGuard(route, state) as Promise<boolean | UrlTree>);
    expect(mockMemberService.getMembers).not.toHaveBeenCalled();
    expect(safe).toEqual(router.createUrlTree(['/select-committee']));
  });

  it('should route to reports page when memberService.needsSecondAdmin()', async () => {
    const router = TestBed.inject(Router);
    mockMemberService.needsSecondAdmin.and.returnValue(true);
    const safe = await (executeGuard(route, state) as Promise<boolean | UrlTree>);
    expect(safe).toEqual(router.createUrlTree(['/reports']));
  });
});
