import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DashboardComponent } from 'app/dashboard/dashboard.component';
import { UsersService } from 'app/shared/services/users.service';
import { testMockStore, testUserLoginData } from 'app/shared/utils/unit-test.utils';
import { of } from 'rxjs';
import { LoginService } from '../../shared/services/login.service';
import { SecurityNoticeComponent } from './security-notice.component';

describe('SecurityNoticeComponent', () => {
  let component: SecurityNoticeComponent;
  let fixture: ComponentFixture<SecurityNoticeComponent>;
  let usersService: UsersService;

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
      declarations: [SecurityNoticeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityNoticeComponent);
    TestBed.inject(LoginService);
    usersService = TestBed.inject(UsersService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit', () => {
    const spy = spyOn(usersService, 'updateCurrentUser').and.returnValue(of(testUserLoginData));
    component.signConsentForm();
    const expectedUserLoginData = testUserLoginData;
    expect(spy).toHaveBeenCalledOnceWith(expectedUserLoginData);

    expectedUserLoginData.consent_for_one_year = true;
    component.form.get('security-consent-annual')?.setValue(true);
    component.signConsentForm();
    expect(spy).toHaveBeenCalledWith(expectedUserLoginData);
  });
});
