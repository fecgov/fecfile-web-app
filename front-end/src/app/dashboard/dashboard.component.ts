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
  constructor(private store: Store, private cookieService: CookieService) {}

  ngOnInit(): void {
    this.dispatchUserLoggedInFromCookies();
  }

  dispatchUserLoggedInFromCookies() {
    if (this.cookieService.check(environment.ffapiEmailCookieName)) {
      const userLoginData: UserLoginData = {
        committee_id: this.cookieService.get(environment.ffapiCommitteeIdCookieName),
        email: this.cookieService.get(environment.ffapiEmailCookieName),
        is_allowed: true,
        login_dot_gov: this.cookieService.get(environment.ffapiLoginDotGovCookieName).length === 0,
      };
      this.cookieService.delete(environment.ffapiCommitteeIdCookieName);
      this.cookieService.delete(environment.ffapiEmailCookieName);
      this.store.dispatch(userLoggedInAction({ payload: userLoginData }));
    }
  }
}
