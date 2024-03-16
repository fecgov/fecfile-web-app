import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { userLoginDataDiscardedAction } from 'app/store/user-login-data.actions';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';
import { LoginService } from '../../shared/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public loginDotGovAuthUrl: string | undefined;
  public localLoginAvailable = false;

  constructor(
    private loginService: LoginService,
    private store: Store,
    private cookieService: CookieService,
  ) { }

  ngOnInit() {
    this.cookieService.deleteAll();
    this.store.dispatch(userLoginDataDiscardedAction());
    this.loginDotGovAuthUrl = environment.loginDotGovAuthUrl;
    this.checkLocalLoginAvailability();
  }

  navigateToLoginDotGov() {
    window.location.href = this.loginDotGovAuthUrl ?? '';
  }

  checkLocalLoginAvailability() {
    this.loginService.checkLocalLoginAvailability().subscribe((available) => {
      this.localLoginAvailable = available;
    });
  }
}
