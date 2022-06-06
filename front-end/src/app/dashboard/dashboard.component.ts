import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserLoginData } from 'app/shared/models/user.model';
import { userLoggedInAction } from 'app/store/login.actions';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  // styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  constructor(
    private store: Store,
    private cookieService: CookieService
  ) { }

  ngOnInit(): void {
    const userLoginData: UserLoginData = {
      committee_id: this.cookieService.get("ffapi_committee_id"),
      email: this.cookieService.get("ffapi_email"),
      is_allowed: true,
      token: this.cookieService.get("ffapi_jwt")
    }
    this.cookieService.delete("ffapi_committee_id")
    this.cookieService.delete("ffapi_email")
    this.cookieService.delete("ffapi_jwt")
    this.store.dispatch(userLoggedInAction({ payload: userLoginData }));
  }
  
}
