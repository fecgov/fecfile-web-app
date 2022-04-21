import { ComponentFixture, flush, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { User, UserLoginData } from 'app/shared/models/user.model';
import { selectUserLoginData } from 'app/store/login.selectors';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from 'app/shared/services/login.service';
import { AuthService } from '../../shared/services/AuthService/auth.service';

import { ConfirmTwoFactorComponent } from './confirm-two-factor.component';

describe('ConfirmTwoFactorComponent', () => {
  let component: ConfirmTwoFactorComponent;
  let fixture: ComponentFixture<ConfirmTwoFactorComponent>;
  const userLoginData: UserLoginData = {
    committee_id: 'C00000000',
    email: 'email@fec.com',
    is_allowed: true,
    token: 'jwttokenstring',
  };
  let loginService: LoginService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule],
      declarations: [ConfirmTwoFactorComponent],
      providers: [
        FormBuilder,
        LoginService,
        AuthService,
        provideMockStore({
          initialState: { fecfile_online_userLoginData: userLoginData },
          selectors: [{ selector: selectUserLoginData, value: userLoginData }],
        }),
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
    const data: UserLoginData = { ...userLoginData };
    spyOn(loginService, 'validateCode').and.returnValue(of(data));
    component.twoFactInfo.patchValue({
      securityCode: '111111',
    });
    component.next();
    expect(component.response).toEqual(data);
    expect(component.isValid).toBe(true);
  });

  it('#next should not validate invalid code', () => {
    const data: UserLoginData = { ...userLoginData };
    data.is_allowed = false;
    spyOn(loginService, 'validateCode').and.returnValue(of(data));
    component.twoFactInfo.patchValue({
      securityCode: '111111',
    });
    component.next();
    expect(component.response).toEqual(data);
    expect(component.isValid).toBe(false);
  });
});
