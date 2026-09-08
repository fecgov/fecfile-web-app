/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { committeeOwnerGuard } from './committee-owner.guard';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CommitteeMemberService } from '../services/committee-member.service';
import { testCommitteeAccount, testCommitteeMember } from '../utils/unit-test.utils';
import type { Mock } from 'vitest';
import { signal } from '@angular/core';
import { CommitteeStore } from 'app/committee/committee.store';
import { CommitteeMember } from '../models/committee-member.model';
import { CommitteeAccount } from '../models/committee-account.model';

let needsSecondAdminMock = signal(false);

describe('committeeOwnerGuard', () => {
  needsSecondAdminMock = signal(false);
  let memberService: CommitteeMemberService;
  const route: ActivatedRouteSnapshot = {} as any;
  const state: RouterStateSnapshot = {} as any;
  let committeeStore: CommitteeStore;
  let router: Router;
  let getMemberSpy: Mock<() => Promise<CommitteeMember[]>>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: CommitteeMemberService,
          useValue: {
            getMembers: vi.fn(),
            membersSignal: vi.fn().mockReturnValue([]),
            needsSecondAdmin: needsSecondAdminMock,
          },
        },
      ],
    });
    committeeStore = TestBed.inject(CommitteeStore);
    memberService = TestBed.inject(CommitteeMemberService);
    getMemberSpy = vi.spyOn(memberService, 'getMembers');
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

    it('should route to reports page when memberService.needsSecondAdmin()', async () => {
      needsSecondAdminMock.set(true);
      getMemberSpy.mockResolvedValue([testCommitteeMember(), testCommitteeMember(), testCommitteeMember()]);
      const safe = await TestBed.runInInjectionContext(() => committeeOwnerGuard(route, state));
      expect(safe).toEqual(router.createUrlTree(['/reports']));
    });
  });

  it('should not hit backend for members if no committee info yet', async () => {
    needsSecondAdminMock.set(true);
    getMemberSpy.mockResolvedValue([testCommitteeMember(), testCommitteeMember(), testCommitteeMember()]);
    committeeStore.setCommittee({} as CommitteeAccount);
    const safe = await TestBed.runInInjectionContext(() => committeeOwnerGuard(route, state));
    expect(safe).toEqual(router.createUrlTree(['/select-committee']));
  });
});
