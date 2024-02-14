import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ApiService } from 'app/shared/services/api.service';
import { LoginService } from '../services/login.service';
import { testMockStore } from '../utils/unit-test.utils';
import { LoginGuard } from './login-page.guard';

describe('LoginGuard', () => {
  let guard: LoginGuard;
  let loginService: LoginService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [ApiService, provideMockStore(testMockStore)],
    });
    guard = TestBed.inject(LoginGuard);
    loginService = TestBed.inject(LoginService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should continue if logged in', () => {
    spyOn(loginService, 'userIsAuthenticated').and.returnValue(Promise.resolve(true));
    const navigateSpy = spyOn(router, 'navigate');
    (guard.canActivate() as Promise<boolean | UrlTree>).then((safe) => {
      expect(navigateSpy).not.toHaveBeenCalled();
      expect(safe).toEqual(true);
    });
  });

  it('should redirect to login if not logged in', () => {
    spyOn(loginService, 'userIsAuthenticated').and.returnValue(Promise.resolve(false));
    const navigateSpy = spyOn(router, 'navigate');
    (guard.canActivate() as Promise<boolean | UrlTree>).then((safe) => {
      expect(safe).toEqual(router.createUrlTree(['/login']));
    });
  });
});
