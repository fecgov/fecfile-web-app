import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { UserLoginData } from 'app/shared/models/user.model';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { userLoggedInAction } from 'app/store/login.actions';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { PanelModule } from 'primeng/panel';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let cookieService: CookieService;
  let store: Store;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, PanelModule, BrowserAnimationsModule],
      declarations: [DashboardComponent],
      providers: [CookieService, provideMockStore(testMockStore)],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    cookieService = TestBed.inject(CookieService);
    store = TestBed.inject(Store);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#dispatchUserLoggedInFromCookies happy path', () => {
    const testEmail = 'testEmail';
    const testLoginDotGov = false;

    const expectedUserLoginData: UserLoginData = {
      login_dot_gov: testLoginDotGov,
    };
    spyOn(cookieService, 'check').and.returnValue(true);
    spyOn(cookieService, 'get').and.callFake((name: string) => {
      if (name === environment.ffapiEmailCookieName) {
        return testEmail;
      }
      if (name === environment.ffapiLoginDotGovCookieName) {
        return testLoginDotGov.toString();
      }
      throw Error('fail!');
    });
    spyOn(store, 'dispatch');

    component.dispatchUserLoggedInFromCookies();
    expect(store.dispatch).toHaveBeenCalledWith(userLoggedInAction({ payload: expectedUserLoginData }));
  });
});
