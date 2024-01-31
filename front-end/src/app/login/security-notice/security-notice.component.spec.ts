import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DashboardComponent } from 'app/dashboard/dashboard.component';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { environment } from 'environments/environment';
import { of } from 'rxjs';
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

  xit('navigateToLoginDotGov should href environment location', () => {
    component.navigateToLoginDotGov();
    expect(window.location.href).toEqual(environment.loginDotGovAuthUrl);
  });

  it('should adjust localLoginAvailable', () => {
    expect(component.localLoginAvailable).toBe(false);
    spyOn(loginService, 'checkLocalLoginAvailability').and.returnValue(of(true));
    component.checkLocalLoginAvailability();
    expect(component.localLoginAvailable).toBe(true);
  });
});
