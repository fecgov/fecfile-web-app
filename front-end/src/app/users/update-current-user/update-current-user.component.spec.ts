import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UpdateCurrentUserComponent } from './update-current-user.component';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ReactiveFormsModule } from '@angular/forms';
import { UserLoginData } from 'app/shared/models';
import { LoginService } from 'app/shared/services/login.service';
import { UsersService } from 'app/shared/services/users.service';
import { SignalFormControl } from 'app/shared/utils/signal-form-control';
import { singleClickEnableAction } from 'app/store/single-click.actions';
import { userLoginDataUpdatedAction } from 'app/store/user-login-data.actions';

describe('UpdateCurrentUserComponent', () => {
  let component: UpdateCurrentUserComponent;
  let fixture: ComponentFixture<UpdateCurrentUserComponent>;
  let usersService: jasmine.SpyObj<UsersService>;
  let loginService: jasmine.SpyObj<LoginService>;
  let router: jasmine.SpyObj<Router>;
  let store: jasmine.SpyObj<Store>;

  const mockUser: UserLoginData = {
    first_name: 'Test',
    last_name: 'User',
    email: 'test@example.com',
  };

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const usersServiceSpy = jasmine.createSpyObj('UsersService', ['updateCurrentUser']);
    const loginServiceSpy = jasmine.createSpyObj('LoginService', ['logOut']);
    const storeSpy = jasmine.createSpyObj('Store', ['dispatch'], {
      selectSignal: () => () => mockUser,
    });

    await TestBed.configureTestingModule({
      declarations: [UpdateCurrentUserComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: UsersService, useValue: usersServiceSpy },
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: Store, useValue: storeSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateCurrentUserComponent);
    component = fixture.componentInstance;
    usersService = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
    loginService = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    store = TestBed.inject(Store) as jasmine.SpyObj<Store>;

    fixture.detectChanges(); // triggers ngOnInit and effectOnceIf
  });

  it('should initialize form with user data', () => {
    const form = component.form();
    expect(form.get('first_name')?.value).toBe('Test');
    expect(form.get('last_name')?.value).toBe('User');
    expect(form.get('email')?.value).toBe('test@example.com');

    expect(form.get('first_name')).toBeInstanceOf(SignalFormControl);
  });

  it('should dispatch action and navigate on valid form submission', fakeAsync(() => {
    usersService.updateCurrentUser.and.resolveTo(mockUser);
    component.continue();
    tick();

    expect(usersService.updateCurrentUser).toHaveBeenCalledWith(mockUser);
    expect(store.dispatch).toHaveBeenCalledWith(userLoginDataUpdatedAction({ payload: mockUser }));
    expect(router.navigate).toHaveBeenCalledWith(['dashboard']);
  }));

  it('should not submit if form is invalid', fakeAsync(() => {
    component.form().get('first_name')?.setValue('');
    component.form().get('last_name')?.setValue('');
    component.continue();
    tick();

    expect(usersService.updateCurrentUser).not.toHaveBeenCalled();
    expect(store.dispatch).toHaveBeenCalledWith(singleClickEnableAction());
  }));

  it('should call loginService.logOut on cancel()', () => {
    component.cancel();
    expect(loginService.logOut).toHaveBeenCalled();
  });
});
