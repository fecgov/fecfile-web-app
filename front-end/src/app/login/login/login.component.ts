import { AfterViewChecked, Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { userLoginDataDiscardedAction } from 'app/store/user-login-data.actions';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewChecked {
  private readonly store = inject(Store);
  private readonly cookieService = inject(CookieService);
  public loginDotGovAuthUrl: string | undefined;
  readonly disableLogin: boolean = environment.disableLogin;

  ngOnInit() {
    this.cookieService.deleteAll();
    this.store.dispatch(userLoginDataDiscardedAction());
    this.loginDotGovAuthUrl = environment.loginDotGovAuthUrl;

    window.addEventListener('resize', this.updateScrollbarWidth);
  }

  ngAfterViewChecked() {
    this.updateScrollbarWidth();
  }

  navigateToLoginDotGov() {
    window.location.href = this.loginDotGovAuthUrl ?? '';
  }

  updateScrollbarWidth() {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
  }
}
