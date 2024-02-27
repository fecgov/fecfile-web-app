import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DashboardComponent } from 'app/dashboard/dashboard.component';
import { BannerComponent } from 'app/layout/banner/banner.component';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { of } from 'rxjs';
import { LoginService } from '../../shared/services/login.service';
import { DebugLoginComponent } from './debug-login.component';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

describe('DebugLoginComponent', () => {
  let component: DebugLoginComponent;
  let fixture: ComponentFixture<DebugLoginComponent>;
  let loginService: LoginService;

  const validForm = {
    committeeId: 'C00000009',
    loginPassword: 'foo',
    emailId: 'aaa@aaa.com',
  };

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
        InputTextModule,
        PasswordModule,
      ],
      providers: [{ provide: Window, useValue: window }, provideMockStore(testMockStore)],
      declarations: [DebugLoginComponent, BannerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DebugLoginComponent);
    loginService = TestBed.inject(LoginService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should validate properly', () => {
    component.form.updateValueAndValidity();
    expect(component.form.valid).toBeFalse();

    component.form.patchValue(validForm);

    component.form.updateValueAndValidity();
    expect(component.form.valid).toBeTrue();
  });

  it('should sign in only with a valid form', () => {
    const loginSpy = spyOn(loginService, 'logIn').and.returnValue(of());

    component.doSignIn();
    expect(loginSpy).toHaveBeenCalledTimes(0);

    component.form.patchValue(validForm);
    component.doSignIn();
    expect(loginSpy).toHaveBeenCalled();
  });
});
