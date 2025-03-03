import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  provideRouter,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { loggedInGuard } from './logged-in.guard';
import { LoginService } from '../services/login.service';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from '../utils/unit-test.utils';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('loggedInGuard', () => {
  let loginService: LoginService;
  let router: Router;
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => loggedInGuard(...guardParameters));

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
    loginService = TestBed.inject(LoginService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should continue if logged in', () => {
    spyOn(loginService, 'userIsAuthenticated').and.returnValue(true);
    const navigateSpy = spyOn(router, 'navigate');
    const route: ActivatedRouteSnapshot = {} as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    const state: RouterStateSnapshot = {} as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    const safe = executeGuard(route, state) as boolean | UrlTree;
    expect(navigateSpy).not.toHaveBeenCalled();
    expect(safe).toEqual(true);
  });

  it('should redirect to login if not logged in', () => {
    spyOn(loginService, 'userIsAuthenticated').and.returnValue(false);
    const route: ActivatedRouteSnapshot = {} as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    const state: RouterStateSnapshot = {} as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    const safe = executeGuard(route, state) as boolean | UrlTree;
    expect(safe).toEqual(router.createUrlTree(['login']));
  });
});
