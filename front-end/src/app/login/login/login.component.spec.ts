import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DashboardComponent } from 'app/dashboard/dashboard.component';
import { UserLoginData } from 'app/shared/models/user.model';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { environment } from 'environments/environment';
import { of, throwError } from 'rxjs';
import { LoginService } from '../../shared/services/login.service';
import { LoginComponent } from './login.component';
import { BannerComponent } from 'app/layout/banner/banner.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginService: LoginService;

  beforeEach(async () => {
    window.onbeforeunload = jasmine.createSpy();
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          {
            path: 'dashboard',
            component: DashboardComponent,
          },
        ]),
        ReactiveFormsModule,
      ],
      providers: [{ provide: Window, useValue: window }, provideMockStore(testMockStore)],
      declarations: [LoginComponent, BannerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    loginService = TestBed.inject(LoginService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updateStatus should set flags', () => {
    component.committeeIdInputError = true;
    component.passwordInputError = true;
    component.loginEmailInputError = true;
    component.updateStatus();
    expect(component.committeeIdInputError).toBeTrue();
    expect(component.passwordInputError).toBeTrue();
    expect(component.loginEmailInputError).toBeTrue();
    component.form.patchValue({
      committeeId: 'C0000009',
      loginPassword: 'foo',
      emailId: 'aaa@aaa.com',
    });
    component.updateStatus();
    expect(component.committeeIdInputError).toBeFalse();
    expect(component.passwordInputError).toBeFalse();
    expect(component.loginEmailInputError).toBeFalse();
  });

  xit('navigateToLoginDotGov should href environment location', () => {
    component.navigateToLoginDotGov();
    expect(window.location.href).toEqual(environment.loginDotGovAuthUrl);
  });

  it('should doSignIn success', () => {
    spyOn(loginService, 'logIn').and.returnValue(of({ is_allowed: true } as UserLoginData));
    component.hasFailed = true;
    component.doSignIn();
    expect(component.isBusy).toBeFalse();
    expect(component.hasFailed).toBeTrue();
    component.form.patchValue({
      committeeId: 'C0000009',
      loginPassword: 'foo',
      emailId: 'aaa@aaa.com',
    });
    component.doSignIn();
    expect(component.isBusy).toBeTrue();
    expect(component.hasFailed).toBeFalse();
  });

  it('should doSignIn fail', () => {
    spyOn(loginService, 'logIn').and.returnValue(throwError(() => new Error('test')));
    component.form.patchValue({
      committeeId: 'C0000009',
      loginPassword: 'foo',
      emailId: 'aaa@aaa.com',
    });
    component.doSignIn();
    expect(component.isBusy).toBeFalse();
    expect(component.hasFailed).toBeTrue();
  });

  it('should toggle show flag', () => {
    expect(component.show).toBeFalse();
    component.showPassword();
    expect(component.show).toBeTrue();
  });

  it('should adjust localLoginAvailable', () => {
    expect(component.localLoginAvailable).toBe(false);
    spyOn(loginService, 'checkLocalLoginAvailability').and.returnValue(of(true));
    component.checkLocalLoginAvailability();
    expect(component.localLoginAvailable).toBe(true);
  });
});
