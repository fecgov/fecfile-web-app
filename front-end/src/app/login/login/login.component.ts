import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { userLoginDataDiscardedAction } from 'app/store/user-login-data.actions';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [NgOptimizedImage],
})
export class LoginComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly cookieService = inject(CookieService);
  public loginDotGovAuthUrl = environment.loginDotGovAuthUrl;

  ngOnInit() {
    this.cookieService.deleteAll();
    this.store.dispatch(userLoginDataDiscardedAction());
  }

  navigateToLoginDotGov() {
    window.location.href = this.loginDotGovAuthUrl ?? '';
  }
}
