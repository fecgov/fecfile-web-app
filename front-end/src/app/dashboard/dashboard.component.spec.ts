import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { UserLoginData } from 'app/shared/models/user.model';
import { userLoggedInAction } from 'app/store/login.actions';
import { selectUserLoginData } from 'app/store/login.selectors';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { PanelModule } from 'primeng/panel';
import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let cookieService: CookieService;
  let store: Store;

  beforeEach(
    waitForAsync(() => {
      const userLoginData: UserLoginData = {
        committee_id: 'C00000000',
        email: 'email@fec.com',
        is_allowed: true,
        token: 'jwttokenstring',
      };
      
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule, 
          RouterTestingModule,
          PanelModule,
          BrowserAnimationsModule,
        ],
        declarations: [DashboardComponent],
        providers: [
          CookieService,
          provideMockStore({
            initialState: { fecfile_online_userLoginData: userLoginData },
            selectors: [{ selector: selectUserLoginData, value: userLoginData }],
          }),
        ],
      }).compileComponents();
    })
  );

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
    const testCommitteeId = "testCommitteeId";
    const testEmail = "testEmail";
    const testIsAllowed = true;
    const testToken = null;

    const expectedUserLoginData: UserLoginData = {
      committee_id: testCommitteeId,
      email: testEmail,
      is_allowed: testIsAllowed,
      token: testToken
    }
    spyOn(cookieService, 'check').and.returnValue(true);
    spyOn(cookieService, 'get').and.callFake((name: string) => {
      if (name === environment.ffapiCommitteeIdCookieName) {
        return testCommitteeId;
      }
      if (name === environment.ffapiEmailCookieName) {
        return testEmail;
      }
      throw Error("fail!");
    });
    spyOn(store, 'dispatch');
    
    component.dispatchUserLoggedInFromCookies();
    expect(store.dispatch).toHaveBeenCalledWith(
      userLoggedInAction({ payload: expectedUserLoginData }));
  });

});
