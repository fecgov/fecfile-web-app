import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserLoginData } from 'app/shared/models/user.model';
import { userLoggedOutAction } from 'app/store/login.actions';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../shared/services/AuthService/auth.service';
import { LoginService } from '../../shared/services/login.service';
import { SessionService } from '../../shared/services/SessionService/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public frm!: FormGroup;
  public isBusy = false;
  public hasFailed = false;
  public committeeIdInputError = false;
  public passwordInputError = false;
  public loginEmailInputError = false;
  public appTitle: string | null = null;
  public titleF!: string;
  public titleR!: string;
  public show!: boolean;
  public loginDotGovAuthUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private authService: AuthService,
    private router: Router,
    private sessionService: SessionService,
    private store: Store,
  ) {
    this.frm = this.fb.group({
      commiteeId: ['', Validators.required],
      loginPassword: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email]],
    });
    this.show = false;
  }

  ngOnInit() {
    this.sessionService.destroy();
    localStorage.clear();
    this.appTitle = environment.appTitle;
    this.titleF = this.appTitle.substring(0, 3);
    this.titleR = this.appTitle.substring(3);
    this.loginService.clearUserLoggedInCookies();
    this.store.dispatch(userLoggedOutAction());
    this.loginDotGovAuthUrl = environment.loginDotGovAuthUrl;
  }

  /**
   * Updates the form validation when fields have text entered.
   *
   */
  public updateStatus(): void {
    if (this.frm.get('commiteeId')?.valid) {
      this.committeeIdInputError = false;
    }

    if (this.frm.get('loginPassword')?.valid) {
      this.passwordInputError = false;
    }

    if (this.frm.get('emailId')?.valid) {
      this.loginEmailInputError = false;
    }
  }

  /**
   * Signs a user in once form is filled in and submit button clicked.
   *
   */
  public doSignIn(): void {
    if (this.frm.invalid) {
      this.committeeIdInputError = this.frm.get('commiteeId')?.invalid ? true : false;

      this.passwordInputError = this.frm.get('loginPassword')?.invalid ? true : false;

      this.loginEmailInputError = this.frm.get('emailId')?.invalid ? true : false;
      return;
    }

    this.isBusy = true;
    this.hasFailed = false;

    const committeeId: string = this.frm.get('commiteeId')?.value;
    const password: string = this.frm.get('loginPassword')?.value;
    const email: string = this.frm.get('emailId')?.value;

    this.loginService.signIn(email, committeeId, password).subscribe({
      next: (res: UserLoginData) => {
        if (res.token) {
          this.authService.doSignIn(res.token);
          this.router.navigate(['twoFactLogin']);
        }
      },
      error: () => {
        this.isBusy = false;
        this.hasFailed = true;
      },
    });
  }

  showPassword() {
    this.show = !this.show;
  }

  navigateToLoginDotGov() {
    window.location.href = this.loginDotGovAuthUrl || "";
  }
}
