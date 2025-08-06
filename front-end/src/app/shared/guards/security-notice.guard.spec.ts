/* eslint-disable @typescript-eslint/no-explicit-any */
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, provideRouter, Router, RouterStateSnapshot } from '@angular/router';
import { testMockStore, testUserLoginData } from '../utils/unit-test.utils';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { securityNoticeGuard } from './security-notice.guard';
import { LoginService } from '../services/login.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { selectUserLoginData } from 'app/store/user-login-data.selectors';

describe('securityNoticeGuard', () => {
  let store: MockStore;
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => securityNoticeGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        LoginService,
        provideMockStore(testMockStore()),
      ],
    });

    store = TestBed.inject(MockStore);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return false without notice', async () => {
    const router = TestBed.inject(Router);
    const route: ActivatedRouteSnapshot = {} as any;
    const state: RouterStateSnapshot = {} as any;
    const safe = await executeGuard(route, state);
    expect(safe).toEqual(router.createUrlTree(['/login/security-notice']));
  });
  it('should return true with notice', async () => {
    store.overrideSelector(selectUserLoginData, { ...testUserLoginData(), security_consented: true });
    const route: ActivatedRouteSnapshot = {} as any;
    const state: RouterStateSnapshot = {} as any;
    const safe = await executeGuard(route, state);
    expect(safe).toBeTrue();
  });
});
