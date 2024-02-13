import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LoginService } from '../../shared/services/login.service';
import { Store } from '@ngrx/store';
import { userLoggedOutAction } from 'app/store/login.actions';
import { setCommitteeAccountDetailsAction } from 'app/store/committee-account.actions';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';

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
  ) {}

  ngOnInit() {
    localStorage.clear();
    this.loginService.clearUserLoggedInCookies();
    this.store.dispatch(setCommitteeAccountDetailsAction({ payload: new CommitteeAccount() }));
    this.store.dispatch(userLoggedOutAction());
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
