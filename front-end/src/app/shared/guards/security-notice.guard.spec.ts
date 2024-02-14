import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { testMockStore } from '../utils/unit-test.utils';
import { provideMockStore } from '@ngrx/store/testing';
import { securityNoticeGuard } from './security-notice.guard';
import { LoginService } from '../services/login.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('securityNoticeGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => securityNoticeGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [LoginService, provideMockStore(testMockStore)],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  xit('should return false without notice', () => {
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigateByUrl').and.resolveTo(undefined);
    const loginService = TestBed.inject(LoginService);
    spyOn(loginService, 'userHasRecentSecurityConsentDate').and.returnValue(Promise.resolve(false));
    const route: ActivatedRouteSnapshot = {} as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    const state: RouterStateSnapshot = {} as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    (executeGuard(route, state) as Promise<boolean | UrlTree>).then((safe) => {
      expect(safe).toBeFalse();
      expect(navigateSpy).toHaveBeenCalled();
    });
  });
  xit('should return true with notice', () => {
    const route: ActivatedRouteSnapshot = {} as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    const state: RouterStateSnapshot = {} as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    const loginService = TestBed.inject(LoginService);
    spyOn(loginService, 'userHasRecentSecurityConsentDate').and.returnValue(Promise.resolve(true));
    (executeGuard(route, state) as Promise<boolean | UrlTree>).then((safe) => {
      expect(safe).toBeTrue();
    });
  });
});
