import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { LoginService } from '../services/login.service';
import { testMockStore } from '../utils/unit-test.utils';
import { UserLoginDataGuard } from './user-login-data.guard';

describe('UserLoginDataGuard', () => {
  let guard: UserLoginDataGuard;
  let loginService: LoginService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [LoginService, provideMockStore(testMockStore)],
    });
    guard = TestBed.inject(UserLoginDataGuard);
    loginService = TestBed.inject(LoginService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow if has profile data', () => {
    spyOn(loginService, 'userHasProfileData').and.returnValue(true);
    const retval = guard.canActivate();
    expect(retval).toEqual(true);
  });

  it('should disallow if no profile data', () => {
    spyOn(loginService, 'userHasProfileData').and.returnValue(false);
    const navigateSpy = spyOn(router, 'navigate');
    const retval = guard.canActivate();
    expect(navigateSpy).toHaveBeenCalledWith(['users/current']);
    expect(retval).toEqual(false);
  });

});
