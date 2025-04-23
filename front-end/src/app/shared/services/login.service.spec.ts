import { TestBed } from '@angular/core/testing';
import { LoginService } from './login.service';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UsersService } from '../services/users.service';
import { signal } from '@angular/core';
import { environment } from 'environments/environment';
import { userLoginDataDiscardedAction, userLoginDataRetrievedAction } from 'app/store/user-login-data.actions';

describe('LoginService', () => {
  let service: LoginService;
  let mockStore: jasmine.SpyObj<Store<any>>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockCookieService: jasmine.SpyObj<CookieService>;
  let mockUsersService: jasmine.SpyObj<UsersService>;

  const mockUser = {
    first_name: 'Jane',
    last_name: 'Doe',
    security_consented: true,
  };

  beforeEach(() => {
    mockStore = jasmine.createSpyObj('Store', ['selectSignal', 'dispatch']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockCookieService = jasmine.createSpyObj('CookieService', ['get']);
    mockUsersService = jasmine.createSpyObj('UsersService', ['getCurrentUser']);

    // Mock selectSignal to return a signal with mockUser
    (mockStore.selectSignal as jasmine.Spy).and.returnValue(signal(mockUser));
    mockCookieService.get.withArgs(environment.ffapiLoginDotGovCookieName).and.returnValue('true');
    mockCookieService.get.withArgs('ffapi_timeout').and.returnValue(
      Math.floor(Date.now() / 1000 + 60).toString(), // timeout 60 seconds in the future
    );

    TestBed.configureTestingModule({
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: Router, useValue: mockRouter },
        { provide: CookieService, useValue: mockCookieService },
        { provide: UsersService, useValue: mockUsersService },
        LoginService,
      ],
    });

    service = TestBed.inject(LoginService);
  });

  it('should return true for userHasProfileData if user has first and last name', () => {
    expect(service.userHasProfileData()).toBeTrue();
  });

  it('should return true for userHasConsented if user has consented', () => {
    expect(service.userHasConsented()).toBeTrue();
  });

  it('should return true for isLoggedIn if the cookie is "true"', () => {
    expect(service.isLoggedIn).toBeTrue();
  });

  it('should return true for userIsAuthenticated if ffapi_timeout is in the future', () => {
    expect(service.userIsAuthenticated).toBeTrue();
  });

  it('should dispatch discard action and navigate to /login if not logged in', () => {
    mockCookieService.get.withArgs(environment.ffapiLoginDotGovCookieName).and.returnValue('false');
    service.logOut();
    expect(mockStore.dispatch).toHaveBeenCalledWith(userLoginDataDiscardedAction());
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should dispatch discard action and redirect if logged in', () => {
    spyOnProperty(service, 'isLoggedIn').and.returnValue(true);
    spyOnProperty(window, 'location', 'get').and.returnValue({
      href: '',
    } as any);
    service.logOut();
    expect(mockStore.dispatch).toHaveBeenCalledWith(userLoginDataDiscardedAction());
    // Can't test window.location.href without redefining window.location, but we check the dispatch
  });

  it('should retrieve user data and dispatch it', async () => {
    mockUsersService.getCurrentUser.and.returnValue(Promise.resolve(mockUser));
    await service.retrieveUserLoginData();
    expect(mockStore.dispatch).toHaveBeenCalledWith(userLoginDataRetrievedAction({ payload: mockUser }));
  });
});
