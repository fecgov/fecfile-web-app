import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { UserLoginData } from 'app/shared/models/user.model';
import { selectUserLoginData } from 'app/store/login.selectors';
import { environment } from 'environments/environment';
import { LoginComponent } from './login.component';



describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  const userLoginData: UserLoginData = {
    committee_id: 'C00000000',
    email: 'email@fec.com',
    is_allowed: true,
    token: 'jwttokenstring',
  };


  beforeEach(async () => {
    window.onbeforeunload = jasmine.createSpy();
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, 
        RouterTestingModule, 
        ReactiveFormsModule,
      ],
      providers: [
        { provide: Window, useValue: window },
        provideMockStore({
          initialState: { fecfile_online_userLoginData: userLoginData },
          selectors: [{ selector: selectUserLoginData, value: userLoginData }],
        }),
      ],
      declarations: [LoginComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
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
  
});
