import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { CommitteeMemberService } from '../services/committee-member.service';
import { testCommitteeAccount, testMockStore } from '../utils/unit-test.utils';
import { committeeOwnerGuard } from './committee-owner.guard';
import { CommitteeStore } from 'app/committee/committee.store';
import { CommitteeAccount } from '../models/committee-account.model';

let needsSecondAdminMock = signal(false);

describe('committeeOwnerGuard', () => {
  needsSecondAdminMock = signal(false);
  const route = {} as unknown as ActivatedRouteSnapshot;
  const state = {} as unknown as RouterStateSnapshot;
  let committeeStore: CommitteeStore;
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
    committeeStore = TestBed.inject(CommitteeStore);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    needsSecondAdminMock.set(false);
    expect(TestBed.runInInjectionContext(() => committeeOwnerGuard(route, state))).toBeTruthy();
  });

  describe('has committee', () => {
    beforeEach(() => committeeStore.setCommittee(testCommitteeAccount()));

    it('should return true when not memberService.needsSecondAdmin', async () => {
      needsSecondAdminMock.set(false);
      const safe = await TestBed.runInInjectionContext(() => committeeOwnerGuard(route, state));
      expect(safe).toBe(true);
    });

    it('should not hit backend for members if no committee info yet', async () => {
      needsSecondAdminMock.set(true);
      committeeStore.setCommittee({} as CommitteeAccount);
      const safe = await TestBed.runInInjectionContext(() => committeeOwnerGuard(route, state));
      expect(safe).toEqual(router.createUrlTree(['/select-committee']));
    });
  });

  it('should route to reports page when memberService.needsSecondAdmin()', async () => {
    needsSecondAdminMock.set(true);
    const safe = await TestBed.runInInjectionContext(() => committeeOwnerGuard(route, state));
    expect(safe).toEqual(router.createUrlTree(['/reports']));
  });
});
