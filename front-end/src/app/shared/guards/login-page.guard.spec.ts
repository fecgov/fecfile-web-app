import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from '../utils/unit-test.utils';
import { ApiService } from 'app/shared/services/api.service';
import { LoginGuard } from './login-page.guard';

describe('LoginGuard', () => {
  let guard: LoginGuard;
  let apiService: ApiService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [ApiService, provideMockStore(testMockStore)],
    });
    guard = TestBed.inject(LoginGuard);
    apiService = TestBed.inject(ApiService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should reroute to dashboard if logged in', () => {
    spyOn(apiService, 'isAuthenticated').and.returnValue(true);
    const navigateSpy = spyOn(router, 'navigate');
    const retval = guard.canActivate();
    expect(navigateSpy).toHaveBeenCalledWith(['dashboard']);
    expect(retval).toEqual(false);
  });

  it('should allow activate if not logged in', () => {
    spyOn(apiService, 'isAuthenticated').and.returnValue(false);
    const navigateSpy = spyOn(router, 'navigate');
    const retval = guard.canActivate();
    expect(navigateSpy).not.toHaveBeenCalled();
    expect(retval).toEqual(true);
  });
});
