import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CookieService } from 'ngx-cookie-service';
import { DashboardComponent } from './dashboard.component';
import { provideMockStore } from '@ngrx/store/testing';
import { UserLoginData } from 'app/shared/models/user.model';
import { selectUserLoginData } from 'app/store/login.selectors';
import { PanelModule } from 'primeng/panel';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
