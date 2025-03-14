import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { committeeOwnerGuard } from './committee-owner.guard';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CommitteeMemberService } from '../services/committee-member.service';

describe('committeeOwnerGuard', () => {
  let mockMemberService: jasmine.SpyObj<CommitteeMemberService>;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => committeeOwnerGuard(...guardParameters));
  const route: ActivatedRouteSnapshot = {} as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  const state: RouterStateSnapshot = {} as any; // eslint-disable-line @typescript-eslint/no-explicit-any

  beforeEach(() => {
    mockMemberService = jasmine.createSpyObj('CommitteeMemberService', ['isOnlyOne', 'getMembers']);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: CommitteeMemberService, useValue: mockMemberService },
      ],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true when not memberService.isOnlyOne', async () => {
    mockMemberService.isOnlyOne.and.returnValue(false);
    (executeGuard(route, state) as Promise<boolean>).then((safe) => {
      expect(safe).toBeTrue();
    });
  });

  it('should route to reports page when memberService.isOnlyOne()', () => {
    const router = TestBed.inject(Router);
    mockMemberService.isOnlyOne.and.returnValue(true);
    return (executeGuard(route, state) as Promise<boolean | UrlTree>).then((safe) => {
      expect(safe).toEqual(router.createUrlTree(['/reports']));
    });
  });
});
