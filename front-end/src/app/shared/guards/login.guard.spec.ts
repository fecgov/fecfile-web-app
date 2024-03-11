import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { LoginService } from '../services/login.service';
import { UsersService } from '../services/users.service';
import { testMockStore } from '../utils/unit-test.utils';
import { loginGuard } from './login.guard';

describe('loginGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => loginGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [provideMockStore(testMockStore)],
    });
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should continue if hasUserLoginData', () => {
    const route: ActivatedRouteSnapshot = {} as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    const state: RouterStateSnapshot = {} as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    const loginService = TestBed.inject(LoginService);
    spyOn(loginService, 'hasUserLoginData').and.returnValue(Promise.resolve(true));
    return (executeGuard(route, state) as Promise<boolean | UrlTree>).then((safe) => {
      expect(safe).toBeTrue();
    });
  });

  it('should retrieve if does not have hasUserLoginData', () => {
    const loginService = TestBed.inject(LoginService);
    const usersService = TestBed.inject(UsersService);
    spyOn(loginService, 'hasUserLoginData').and.returnValue(Promise.resolve(false));
    spyOn(usersService, 'getCurrentUser').and.returnValue(Promise.resolve({}));
    const route: ActivatedRouteSnapshot = {} as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    const state: RouterStateSnapshot = {} as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    return (executeGuard(route, state) as Promise<boolean | UrlTree>).then((safe) => {
      expect(safe).toBeTrue();
    });
  });
});
