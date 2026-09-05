/* eslint-disable @typescript-eslint/no-explicit-any */
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { CommitteeAccount } from '../models';
import { CommitteeMemberService } from '../services/committee-member.service';
import { testMockStore } from '../utils/unit-test.utils';
import { committeeOwnerGuard } from './committee-owner.guard';

let needsSecondAdminMock = signal(false);

describe('committeeOwnerGuard', () => {
  needsSecondAdminMock = signal(false);
  let memberService: CommitteeMemberService;
  const route: ActivatedRouteSnapshot = {} as any;
  const state: RouterStateSnapshot = {} as any;
  let store: MockStore;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: CommitteeMemberService,
          useValue: {
            membersSignal: vi.fn().mockReturnValue([]),
            needsSecondAdmin: needsSecondAdminMock,
            updateCommitteeCounts: vi.fn().mockReturnValue(Promise.resolve()),
          },
        },
        provideMockStore(testMockStore()),
      ],
    });
    store = TestBed.inject(MockStore);
    memberService = TestBed.inject(CommitteeMemberService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    needsSecondAdminMock.set(false);
    expect(TestBed.runInInjectionContext(() => committeeOwnerGuard(route, state))).toBeTruthy();
  });

  it('should return true when not memberService.needsSecondAdmin', async () => {
    needsSecondAdminMock.set(false);
    const safe = await TestBed.runInInjectionContext(() => committeeOwnerGuard(route, state));
    expect(safe).toBe(true);
  });

  it('should not hit backend for members if no committee info yet', async () => {
    needsSecondAdminMock.set(true);
    store.overrideSelector(selectCommitteeAccount, {} as CommitteeAccount);
    const safe = await TestBed.runInInjectionContext(() => committeeOwnerGuard(route, state));
    expect(safe).toEqual(router.createUrlTree(['/select-committee']));
  });

  it('should route to reports page when memberService.needsSecondAdmin()', async () => {
    needsSecondAdminMock.set(true);
    const safe = await TestBed.runInInjectionContext(() => committeeOwnerGuard(route, state));
    expect(safe).toEqual(router.createUrlTree(['/reports']));
  });
});
