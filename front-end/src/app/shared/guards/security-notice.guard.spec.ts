import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  provideRouter,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { testMockStore } from '../utils/unit-test.utils';
import { provideMockStore } from '@ngrx/store/testing';
import { securityNoticeGuard } from './security-notice.guard';
import { LoginService } from '../services/login.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('securityNoticeGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => securityNoticeGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        LoginService,
        provideMockStore(testMockStore),
      ],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return false without notice', () => {
    const router = TestBed.inject(Router);
    const loginService = TestBed.inject(LoginService);
    spyOn(loginService, 'userHasConsented').and.returnValue(Promise.resolve(false));
    const route: ActivatedRouteSnapshot = {} as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    const state: RouterStateSnapshot = {} as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    return (executeGuard(route, state) as Promise<boolean | UrlTree>).then((safe) => {
      expect(safe).toEqual(router.createUrlTree(['/login/security-notice']));
    });
  });
  it('should return true with notice', () => {
    const route: ActivatedRouteSnapshot = {} as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    const state: RouterStateSnapshot = {} as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    const loginService = TestBed.inject(LoginService);
    spyOn(loginService, 'userHasConsented').and.returnValue(Promise.resolve(true));
    return (executeGuard(route, state) as Promise<boolean | UrlTree>).then((safe) => {
      expect(safe).toBeTrue();
    });
  });
});
