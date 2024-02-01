import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserLoginData } from 'app/shared/models/user.model';
import { userLoggedInAction } from 'app/store/login.actions';
import { environment } from 'environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  // styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(private store: Store, private cookieService: CookieService) { }

  ngOnInit(): void {
    this.dispatchUserLoggedInFromCookies();
  }

  dispatchUserLoggedInFromCookies() {
    if (this.cookieService.check(environment.ffapiLoginDotGovCookieName)) {
      const userLoginData: UserLoginData = {
        login_dot_gov: this.cookieService.get(
          environment.ffapiLoginDotGovCookieName).toLowerCase() === 'true',
      };
      this.cookieService.delete(environment.ffapiLoginDotGovCookieName);
      this.store.dispatch(userLoggedInAction({ payload: userLoginData }));
    }
  }
}
