import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserLoginData } from 'app/shared/models/user.model';
import { LoginService } from 'app/shared/services/login.service';
import { userLoggedInAction } from 'app/store/login.actions';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  // styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(private store: Store,
    private cookieService: CookieService,
    private loginService: LoginService) { }

  ngOnInit(): void {
    this.dispatchUserLoggedInFromCookies();
  }

  dispatchUserLoggedInFromCookies() {
    if (this.cookieService.check(environment.ffapiLoginDotGovCookieName)) {
      const userLoginData: UserLoginData = {
        first_name: this.cookieService.get(environment.ffapiFirstNameCookieName),
        last_name: this.cookieService.get(environment.ffapiLastNameCookieName),
        email: this.cookieService.get(environment.ffapiEmailCookieName),
        login_dot_gov: this.cookieService.get(
          environment.ffapiLoginDotGovCookieName).toLowerCase() === 'true',
      };
      this.loginService.clearUserFecfileApiCookies();
      this.store.dispatch(userLoggedInAction({ payload: userLoginData }));
    }
  }
}
