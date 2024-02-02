import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DashboardComponent } from 'app/dashboard/dashboard.component';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { LoginService } from '../../shared/services/login.service';
import { SecurityNoticeComponent } from './security-notice.component';
import { UsersService } from 'app/shared/services/users.service';

describe('LoginComponent', () => {
  let component: SecurityNoticeComponent;
  let fixture: ComponentFixture<SecurityNoticeComponent>;
  let loginService: LoginService;
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
    loginService = TestBed.inject(LoginService);
    usersService = TestBed.inject(UsersService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
