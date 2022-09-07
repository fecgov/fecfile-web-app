import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testUserLoginData, testMockStore } from 'app/shared/utils/unit-test.utils';
import { UserLoginData } from 'app/shared/models/user.model';
import { of } from 'rxjs';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from 'app/shared/services/login.service';
import { AuthService } from '../../shared/services/AuthService/auth.service';
import { ConfirmTwoFactorComponent } from './confirm-two-factor.component';

describe('ConfirmTwoFactorComponent', () => {
  let component: ConfirmTwoFactorComponent;
  let fixture: ComponentFixture<ConfirmTwoFactorComponent>;
  let loginService: LoginService;
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule],
      declarations: [ConfirmTwoFactorComponent],
      providers: [
        FormBuilder,
        LoginService,
        AuthService,
        provideMockStore(testMockStore),
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmTwoFactorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loginService = TestBed.inject(LoginService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#next should validate valid code', () => {
    const data: UserLoginData = { ...testUserLoginData };
    spyOn(loginService, 'validateCode').and.returnValue(of(data));
    component.twoFactInfo.patchValue({
      securityCode: '111111',
    });
    component.next();
    expect(component.response).toEqual(data);
    expect(component.isValid).toBe(true);
    const navArgs = routerSpy.navigate.calls.mostRecent().args[0];
    expect(navArgs[0]).toBe('/dashboard');
  });

  it('#next should not validate invalid code', () => {
    const data: any = { ...testUserLoginData }; // eslint-disable-line @typescript-eslint/no-explicit-any
    data.is_allowed = false;
    data.msg = component.ACCOUNT_LOCKED_MSG;
    spyOn(loginService, 'validateCode').and.returnValue(of(data));
    component.twoFactInfo.patchValue({
      securityCode: '111111',
    });
    component.next();
    expect(component.response).toEqual(data);
    expect(component.isValid).toBe(false);
  });

  it('#onDestroy should call unsubscribe on the subscription', () => {
    let unsubscribeCalled = false;
    spyOn(component.subscription, 'unsubscribe').and.callFake(() => (unsubscribeCalled = true));
    component.onDestroy();
    expect(unsubscribeCalled).toBe(true);
  });
});
